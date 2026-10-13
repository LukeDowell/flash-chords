'use client'

import React, {useCallback, useContext, useEffect, useState} from 'react';
import CheckIcon from '@mui/icons-material/Check'
import SettingsIcon from '@mui/icons-material/Settings'
import {useInstrument, useInterval} from "@/lib/react/hooks";
import {DEFAULT_PRACTICE_SETTINGS, Settings} from "@/components/settings/Settings";
import {PracticeSettings} from "@/components/settings/PracticeSettings";
import {Note} from "@/lib/music/Note";
import _ from "lodash";
import {VoicingHistory, VoicingResult} from "./VoicingHistory";
import {Alert, Chip, Drawer, IconButton, LinearProgress, Stack} from "@mui/material";
import {
  CIRCLE_OF_FIFTHS,
  diatonicChords,
  getKey,
  isValidVoicingForChord,
  MusicKey,
  notesInKey
} from "@/lib/music/Circle";
import {InteractiveStaff} from "@/components/interactivestaff/InteractiveStaff";
import {Chord} from "@/lib/music/Chord";
import {styled} from "@mui/system";
import {NoteEvent} from "@/lib/music/MidiPiano";
import {InstrumentContext, MidiInputContext, MidiPianoContext} from "@/lib/react/contexts";

export interface Props {
  initialChord?: Chord,
  initialKey?: MusicKey,
  initialSettings?: Partial<Settings>
}

const isChordAllowed = (chord: Chord, settings: Settings): boolean => {
  const accidentalMod = chord.rootNote.accidental?.mod || 0
  if (accidentalMod < 0 && !settings.flatRootsEnabled) return false
  if (accidentalMod > 0 && !settings.sharpRootsEnabled) return false

  switch (chord.seventhQuality) {
    case "Major": // Cmaj7 / Cm(maj7)
      return chord.quality === "Major" ? settings.majorEnabled : settings.minorEnabled
    case "Minor": // C7 / Cm7
      return chord.quality === "Major" ? settings.dominantEnabled : settings.minorEnabled
    case "Half-Diminished":
      return settings.halfDiminishedEnabled
    case "Fully-Diminished":
      return settings.diminishedEnabled
  }

  switch (chord.quality) {
    case "Major":
      return settings.majorEnabled
    case "Minor":
      return settings.minorEnabled
    case "Augmented":
      return settings.augmentedEnabled
    case "Diminished":
      return settings.diminishedEnabled
  }
}

/** How many previous voicings render on the staff; VexFlow redraws every stave
 * on each note event, so an unbounded history lags long practice sessions */
export const STAFF_HISTORY_LIMIT = 8

export const staffHistory = (voicingResults: VoicingResult[]): VoicingResult[] =>
  voicingResults.slice(-STAFF_HISTORY_LIMIT).reverse()

export const generateChordFromSettings = (settings: Settings): [Chord, MusicKey] => {
  const candidates: Array<[Chord, MusicKey]> = CIRCLE_OF_FIFTHS.flatMap(key => {
    const chords: Chord[] = []
    if (settings.triadsEnabled) chords.push(...diatonicChords(key, false))
    if (settings.seventhsEnabled) chords.push(...diatonicChords(key, true))
    return chords.filter(c => isChordAllowed(c, settings)).map((c): [Chord, MusicKey] => [c, key])
  })

  // Overly restrictive settings fall back to any diatonic chord rather than breaking the practice loop
  if (candidates.length === 0) {
    const key = _.sample(CIRCLE_OF_FIFTHS)!!
    return [_.sample(diatonicChords(key))!!, key]
  }
  return _.sample(candidates)!!
}


const StyledRoot = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .timer {
    margin-top: 0;
    width: 50%;
    height: 1vmax;
    margin-bottom: 5rem
  }

  #vexflow-output {
    min-height: 280px;
  }

  #vexflow-output svg {
    overflow: visible;
  }
`

const ChordSymbolPrompt = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;

  .current-chord-symbol {
    font-size: 10vmax;
    margin-top: 0;
    margin-bottom: 0;
  }
`

export default function PracticePage({
                                       initialChord = new Chord('Db', 'Major'),
                                       initialKey = getKey('Db', 'Major'),
                                       initialSettings = DEFAULT_PRACTICE_SETTINGS
                                     }: Props) {
  const piano = useContext(MidiPianoContext)
  const midiInput = useContext(MidiInputContext)
  const sample = useContext(InstrumentContext)
  const instrument = useInstrument(sample, true)
  const [currentChord, setCurrentChord] = useState<Chord>(initialChord)
  const [currentKey, setCurrentKey] = useState<MusicKey>(initialKey)
  const [timeOfLastSuccess, setTimeOfLastSuccess] = useState(() => Date.now())
  const [shouldDisplaySuccess, setShouldDisplaySuccess] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [timerProgress, setTimerProgress] = useState(100)
  const [settings, setSettings] = useState({...DEFAULT_PRACTICE_SETTINGS, ...initialSettings})
  const [voicingResults, setVoicingResults] = useState<VoicingResult[]>([])
  const [activeNotes, setActiveNotes] = useState<Note[]>([])

  const generateNewChord = useCallback(() => {
    let [newChord, newKey] = generateChordFromSettings(settings)
    while (_.isEqual(currentChord, newChord)) {
      [newChord, newKey] = generateChordFromSettings(settings)
    }
    setCurrentChord(newChord)
    setCurrentKey(newKey)
  }, [currentChord, settings])

  useEffect(() => {
    const callback = (noteEvent: NoteEvent, currentActiveNotes: Note[]) => {
      if (isValidVoicingForChord(currentActiveNotes, currentChord)) {
        setShouldDisplaySuccess(true)
        setTimeOfLastSuccess(Date.now())
        setVoicingResults([...voicingResults, {
          chord: currentChord,
          key: currentKey,
          validNotes: notesInKey(currentActiveNotes, currentKey)
        }])
        setActiveNotes([])
        generateNewChord()
      } else setActiveNotes(currentActiveNotes.slice())
    };

    const id = _.uniqueId('practice-page-')
    piano.addSubscriber(id, callback)
    return () => piano.removeSubscriber(id)
  }, [currentChord, piano, generateNewChord, voicingResults, currentKey])

  useInterval(() => {
    const inTimeWindow = Date.now() - timeOfLastSuccess <= 1000
    if (!inTimeWindow && shouldDisplaySuccess) {
      setShouldDisplaySuccess(false)
    }
  }, 100)

  useInterval(() => {
    if (!settings?.timerEnabled) return
    const timeLeft = (timeOfLastSuccess + (settings.timerMilliseconds)) - Date.now()
    if (timeLeft <= 0) {
      setVoicingResults([...voicingResults, {chord: currentChord, key: currentKey, validNotes: []}])
      setTimeOfLastSuccess(Date.now())
      generateNewChord()
    } else setTimerProgress(Math.floor((timeLeft / (settings.timerMilliseconds)) * 100))
  }, 100)

  return <StyledRoot>
    <IconButton aria-label="open-settings"
                style={{alignSelf: 'flex-end'}}
                onClick={() => setIsSettingsOpen(true)}>
      <SettingsIcon/>
    </IconButton>
    <Drawer anchor="right"
            open={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}>
      <PracticeSettings settings={settings} onSettingsUpdate={setSettings}/>
    </Drawer>
    {!midiInput &&
      <Alert severity="info">
        Connect a MIDI keyboard, then pick it under &quot;MIDI Input&quot; in the menu (top left) to start playing
      </Alert>}
    <ChordSymbolPrompt>
      <h2 className="current-chord-symbol">{currentChord.toString()}</h2>
      {shouldDisplaySuccess && <CheckIcon style={{color: "green"}}/>}
    </ChordSymbolPrompt>
    <Stack direction="row" spacing={1} marginBottom={2}>
      {currentChord.notes().map((chordNote, i) => {
        const label = notesInKey([chordNote], currentKey)[0].withOctave(undefined).toString()
        const isHeld = activeNotes.some(an => an.equalsWithoutOctave(chordNote))
        return <Chip key={label}
                     data-testid={`note-feedback-${label}-${isHeld ? 'held' : 'missing'}`}
                     label={label}
                     size="small"
                     color={isHeld ? 'success' : 'default'}
                     variant={isHeld ? 'filled' : 'outlined'}/>
      })}
      {_.uniqBy(activeNotes.filter(an => !currentChord.notes().some(cn => an.equalsWithoutOctave(cn))),
        an => an.withOctave(undefined).toString())
        .map(wrongNote => {
          const label = notesInKey([wrongNote], currentKey)[0].withOctave(undefined).toString()
          return <Chip key={label}
                       data-testid={`note-feedback-${label}-wrong`}
                       label={label}
                       size="small"
                       color="error"/>
        })}
    </Stack>
    <InteractiveStaff musicKey={currentKey}
                      chords={[currentChord].concat(staffHistory(voicingResults).map(v => v.chord))}
                      chordVoicings={staffHistory(voicingResults).map(v => v.validNotes)}
    />
    {settings?.timerEnabled && <LinearProgress className="timer" variant="determinate" value={timerProgress}/>}
    <VoicingHistory voicingResults={voicingResults}/>
  </StyledRoot>
}
