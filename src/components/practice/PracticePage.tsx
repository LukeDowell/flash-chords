import React, {useCallback, useContext, useEffect, useState} from 'react';
import CheckIcon from '@mui/icons-material/Check'
import useInterval from "@/lib/utility";
import {Close as CloseIcon, Settings as SettingsIcon} from "@mui/icons-material";
import {PracticeSettings} from "@/components/settings/PracticeSettings";
import LogoSvg from '@/components/images/Icon'
import {DEFAULT_PRACTICE_SETTINGS, Settings} from "@/components/settings/Settings";
import {Chord, ChordQuality, generateRandomChord, isValidVoicing, SeventhQuality, toSymbol} from "@/lib/music/Chord";
import {Accidental, FLAT, Note, Root, SHARP} from "@/lib/music/Note";
import _ from "lodash";
import {VoicingHistory, VoicingResult} from "./VoicingHistory";
import {styled} from "@mui/material/styles";
import {Staff} from "@/components/staff/Staff";
import {LinearProgress} from "@mui/material";
import {MIDIPianoContext} from "@/pages/_app.page";

export interface Props {
  initialChord?: Chord,
  initialSettings?: Partial<Settings>
}

export const generateChordFromSettings = (settings: Settings) => {
  if (settings.activeKey) {
    const chords = settings.activeKey.diatonicChords
    return chords[Math.floor(Math.random() * chords.length)]
  }

  const roots = ["A", "B", "C", "D", "E", "F", "G"] as Root[]
  const qualities: Array<ChordQuality> = []
  const accidentals: Array<Accidental> = []
  const addedThirds: Array<SeventhQuality> = []

  if (!settings.majorEnabled && !settings.minorEnabled) {
    qualities.push("Major")
  } else {
    if (settings.minorEnabled) qualities.push("Minor")
    if (settings.majorEnabled) qualities.push("Major")
  }

  if (settings.flatRootsEnabled) accidentals.push(FLAT)
  if (settings.sharpRootsEnabled) accidentals.push(SHARP)

  if (settings.seventhsEnabled) {
    if (settings.minorEnabled) addedThirds.push("Minor")
    if (settings.majorEnabled) addedThirds.push("Major")
  }

  if (settings.augmentedEnabled) qualities.push("Augmented")
  if (settings.diminishedEnabled) qualities.push("Diminished")

  return generateRandomChord(roots, qualities, accidentals, addedThirds)
}

const StyledRoot = styled('div')({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",

  ".prompt-header": {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between ",
    padding: "0 1rem 0 1rem",
    width: "100%",
    ".logo": {
      width: "4rem",
      height: "4rem",
    },
    ".button": {
      width: "3rem",
      height: "4rem",
      color: "grey"
    }
  },

  ".timer": {
    marginTop: 0,
    width: "50%",
    height: "1vmax",
    marginBottom: "5rem"
  }
})

const ChordSymbolPrompt = styled('div')({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flex: "1",
  ".current-chord-symbol": {
    fontSize: "10vmax",
    marginTop: "0",
    marginBottom: "0"
  }
})

export default function PracticePage({
                                       initialChord = generateRandomChord(),
                                       initialSettings = DEFAULT_PRACTICE_SETTINGS
                                     }: Props) {
  const piano = useContext(MIDIPianoContext)
  const [currentChord, setCurrentChord] = useState<Chord>(initialChord)
  const [timeOfLastSuccess, setTimeOfLastSuccess] = useState(Date.now())
  const [shouldDisplaySuccess, setShouldDisplaySuccess] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [timerProgress, setTimerProgress] = useState(100)
  const [settings, setSettings] = useState({...DEFAULT_PRACTICE_SETTINGS, ...initialSettings})
  const [voicingResults, setVoicingResults] = useState<VoicingResult[]>([])

  const generateNewChord = useCallback(() => {
    let newChord = generateChordFromSettings(settings)
    while (_.isEqual(currentChord, newChord)) {
      newChord = generateChordFromSettings(settings)
    }
    setCurrentChord(newChord)
  }, [currentChord, settings])

  useEffect(() => {
    const callback = (activeNotes: Note[]) => {
      if (isValidVoicing(currentChord, activeNotes)) {
        setShouldDisplaySuccess(true)
        setTimeOfLastSuccess(Date.now())
        setVoicingResults([...voicingResults, {chord: currentChord, validNotes: activeNotes}])
        generateNewChord()
      }
    };
    const id = _.uniqueId('practice-page-')
    piano.setListener(id, callback)
    return () => piano.removeListener(id)
  }, [currentChord, piano, generateNewChord, voicingResults])

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
      setVoicingResults([...voicingResults, {chord: currentChord, validNotes: []}])
      setTimeOfLastSuccess(Date.now())
      generateNewChord()
    } else setTimerProgress(Math.floor((timeLeft / (settings.timerMilliseconds)) * 100))
  }, 100)

  return <StyledRoot>
    <div className="prompt-header">
      <LogoSvg height={40} width={40}/>
      {
        (isSettingsOpen
          && <CloseIcon className="button" onClick={() => setIsSettingsOpen(false)}/>
        ) || <SettingsIcon className="button" onClick={() => setIsSettingsOpen(true)}/>
      }
    </div>
    {isSettingsOpen &&
        <PracticeSettings settings={settings} onSettingsUpdate={setSettings}/>
    }
    <ChordSymbolPrompt>
      <h2 className="current-chord-symbol">{toSymbol(currentChord)}</h2>
      {shouldDisplaySuccess && <CheckIcon style={{color: "green"}}/>}
    </ChordSymbolPrompt>
    <Staff chord={currentChord}/>
    {settings?.timerEnabled && <LinearProgress className="timer" variant="determinate" value={timerProgress}/>}
    <VoicingHistory voicingResults={voicingResults}/>
  </StyledRoot>
}
