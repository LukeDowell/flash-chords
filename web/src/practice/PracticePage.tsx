import React, {useEffect, useState} from 'react';
import MIDIPiano from "../music/MIDIPiano";
import styled from "@emotion/styled";
import CheckIcon from '@mui/icons-material/Check'
import {useInterval} from "../utility";
import {Close as CloseIcon, Settings as SettingsIcon} from "@mui/icons-material";
import {PracticeSettings} from "./PracticeSettings";
import flashchordsLogo from '../images/icon.png'
import {DEFAULT_PRACTICE_SETTINGS, Settings} from "./Settings";
import {LinearProgress} from "@mui/material";
import {Chord, chordToSymbol, generateRandomChord} from "../music/Chord";
import {Note} from "../music/Note";
import {isValidVoicing} from "../music/VoicingValidator";
import _ from "lodash";

export interface Props {
  piano: MIDIPiano,
  initialChord?: Chord,
  initialSettings?: Partial<Settings>
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

  ".prompt-statistics": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    ".stat": {
      "h3": {}
    }
  },

  ".timer": {
    marginTop: 0,
    width: "50%"
  }
})

const ChordSymbolPrompt = styled('div')({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  ".current-chord-symbol": {
    fontSize: "5rem",
    marginTop: "0",
    marginBottom: "0"
  },
  ".timer": {}
})

export default function PracticePage({
                                       piano,
                                       initialChord = generateRandomChord(),
                                       initialSettings = DEFAULT_PRACTICE_SETTINGS
                                     }: Props) {
  const [currentChord, setCurrentChord] = useState<Chord>(initialChord)
  const [timeLastChordEnded, setTimeLastChordEnded] = useState(Date.now())
  const [shouldDisplaySuccess, setShouldDisplaySuccess] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [timerProgress, setTimerProgress] = useState(100)
  const [settings, setSettings] = useState({...DEFAULT_PRACTICE_SETTINGS, ...initialSettings})
  const [voicingsAttempted, setVoicingsAttempted] = useState(0)
  const [validVoicings, setValidVoicings] = useState(0)

  useEffect(() => {
    const onActiveNotes = (activeNotes: Note[]) => {
      if (isValidVoicing(currentChord, activeNotes)) {
        setTimeLastChordEnded(Date.now())
        setShouldDisplaySuccess(true)
        setValidVoicings(validVoicings + 1)
        setVoicingsAttempted(voicingsAttempted + 1)
        if (!settings.timerEnabled) setVoicingsAttempted(voicingsAttempted + 1)
      }
    }
    piano.setListener("PracticePage", onActiveNotes)
    return () => piano.removeListener("PracticePage")
  }, [currentChord, piano, settings, validVoicings, voicingsAttempted])

  useInterval(() => {
    const inTimeWindow = Date.now() - timeLastChordEnded <= 1000
    if (!inTimeWindow && shouldDisplaySuccess) {
      setShouldDisplaySuccess(false)
      let newChord = generateRandomChord()
      while (_.isEqual(currentChord, newChord)) {
        newChord = generateRandomChord()
      }
      setCurrentChord(newChord)
    }
  }, 100)

  useInterval(() => {
    if (!settings?.timerEnabled) return
    const timeLeft = (timeLastChordEnded + settings.timerValue) - Date.now()
    if (timeLeft <= 0) {
      setShouldDisplaySuccess(false)
      let newChord = generateRandomChord()
      while (_.isEqual(currentChord, newChord)) {
        newChord = generateRandomChord()
      }
      setCurrentChord(newChord)
      setTimeLastChordEnded(Date.now())
      setVoicingsAttempted(voicingsAttempted + 1)
    } else setTimerProgress(Math.floor((timeLeft / settings.timerValue) * 100))
  }, 100)

  return <StyledRoot>
    <div className="prompt-header">
      <img src={flashchordsLogo} className="logo" alt="flashchords logo"/>
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
      <h2 className="current-chord-symbol">{chordToSymbol(currentChord)}</h2>
      {shouldDisplaySuccess &&
      <CheckIcon style={{color: "green"}}/>}
    </ChordSymbolPrompt>
    {settings?.timerEnabled &&
    <LinearProgress className="timer" variant="determinate" value={timerProgress}/>
    }
    <div className="prompt-statistics">
      <span className="stat">{`Valid voicings: ${validVoicings}`}</span>
      <span className="stat">{`Voicings attempted: ${voicingsAttempted}`}</span>
    </div>
  </StyledRoot>
}
