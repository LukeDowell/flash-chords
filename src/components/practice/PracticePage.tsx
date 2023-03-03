import React, {useCallback, useContext, useEffect, useState} from 'react';
import CheckIcon from '@mui/icons-material/Check'
import {useInterval} from "@/lib/hooks";
import {Close as CloseIcon, Settings as SettingsIcon} from "@mui/icons-material";
import {PracticeSettings} from "@/components/settings/PracticeSettings";
import LogoSvg from '@/components/images/Icon'
import {DEFAULT_PRACTICE_SETTINGS, Settings} from "@/components/settings/Settings";
import {Note} from "@/lib/music/Note";
import _ from "lodash";
import {VoicingHistory, VoicingResult} from "./VoicingHistory";
import {LinearProgress} from "@mui/material";
import {MidiPianoContext} from "@/pages/_app.page";
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

export interface Props {
  initialChord?: Chord,
  initialKey?: MusicKey,
  initialSettings?: Partial<Settings>
}

export const generateChordFromSettings = (settings: Settings): [Chord, MusicKey] => {
  const key = _.sample(CIRCLE_OF_FIFTHS)!!
  return [_.sample(diatonicChords(key, _.random(1, 2) % 2 === 0))!!, key]
}


const StyledRoot = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;

  .prompt-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 1rem 0 1rem;
    width: 100%;

    .logo {
      width: 5rem;
      height: 5rem;
    }

    .button {
      width: 5rem;
      height: 5rem;
      color: grey
    }
  }

  .timer {
    margin-top: 0;
    width: 50%;
    height: 1vmax;
    margin-bottom: 5rem
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
  const [currentChord, setCurrentChord] = useState<Chord>(initialChord)
  const [currentKey, setCurrentKey] = useState<MusicKey>(initialKey)
  const [timeOfLastSuccess, setTimeOfLastSuccess] = useState(Date.now())
  const [shouldDisplaySuccess, setShouldDisplaySuccess] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [timerProgress, setTimerProgress] = useState(100)
  const [settings, setSettings] = useState({...DEFAULT_PRACTICE_SETTINGS, ...initialSettings})
  const [voicingResults, setVoicingResults] = useState<VoicingResult[]>([])

  const generateNewChord = useCallback(() => {
    let [newChord, newKey] = generateChordFromSettings(settings)
    while (_.isEqual(currentChord, newChord)) {
      [newChord, newKey] = generateChordFromSettings(settings)
    }
    setCurrentChord(newChord)
    setCurrentKey(newKey)
  }, [currentChord, settings])

  useEffect(() => {
    const callback = (activeNotes: Note[]) => {
      if (isValidVoicingForChord(activeNotes, currentChord)) {
        setShouldDisplaySuccess(true)
        setTimeOfLastSuccess(Date.now())
        setVoicingResults([...voicingResults, {
          chord: currentChord,
          key: currentKey,
          validNotes: notesInKey(activeNotes, currentKey)
        }])
        generateNewChord()
      }
    };

    const id = _.uniqueId('practice-page-')
    piano.setListener(id, callback)
    return () => piano.removeListener(id)
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
    <div className="prompt-header">
      <LogoSvg className={'logo'}/>
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
      <h2 className="current-chord-symbol">{currentChord.toString()}</h2>
      {shouldDisplaySuccess && <CheckIcon style={{color: "green"}}/>}
    </ChordSymbolPrompt>
    <InteractiveStaff musicKey={currentKey}
                      chords={[currentChord].concat(_.reverse(voicingResults.slice()).map(v => v.chord))}
                      chordVoicings={_.reverse(voicingResults.slice()).map(v => v.validNotes)}
    />
    {settings?.timerEnabled && <LinearProgress className="timer" variant="determinate" value={timerProgress}/>}
    <VoicingHistory voicingResults={voicingResults}/>
  </StyledRoot>
}
