import React, {useEffect, useState} from 'react';
import {Chord, chordToSymbol, generateRandomChord, isValidVoicing, Note} from "../music/Music";
import MIDIPiano from "../music/MIDIPiano";
import styled from "@emotion/styled";
import CheckIcon from '@mui/icons-material/Check'
import {useInterval} from "../utility";
import {Settings} from "@mui/icons-material";
import {DEFAULT_PRACTICE_SETTINGS, PracticeSettings} from "./PracticeSettings";
import {isDeepStrictEqual} from "util";

export interface Props {
  piano: MIDIPiano,
  initialChord?: Chord,
  practiceSettings?: PracticeSettings
}

const StyledRoot = styled('div')({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",

  ".prompt-header": {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    ".logo": {
      width: "4rem",
      height: "4rem",
    },
    ".button": {
      width: "4rem",
      height: "4rem",
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
  }
})

const ChordSymbolPrompt = styled('div')({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "h2": {
    fontSize: 50
  }
})

export default function PracticePage({
                                       piano,
                                       initialChord = generateRandomChord(),
                                       practiceSettings = DEFAULT_PRACTICE_SETTINGS
                                     }: Props) {
  const [currentChord, setCurrentChord] = useState<Chord>(initialChord)
  const [timeOfLastSuccess, setTimeOfLastSuccess] = useState(Date.now() - 1000)
  const [shouldDisplaySuccess, setShouldDisplaySuccess] = useState(false)

  useEffect(() => {
    const onActiveNotes = (activeNotes: Note[]) => {
      if (isValidVoicing(currentChord, activeNotes)) {
        setTimeOfLastSuccess(Date.now())
        setShouldDisplaySuccess(true)
      }
    }
    piano.setListener("PracticePage", onActiveNotes)
    return () => piano.removeListener("PracticePage")
  }, [currentChord, piano])

  useInterval(() => {
    const inTimeWindow = Date.now() - timeOfLastSuccess <= 1000
    if (!inTimeWindow && shouldDisplaySuccess) {
      setShouldDisplaySuccess(false)
      let newChord = generateRandomChord()
      while (isDeepStrictEqual(currentChord, newChord)) {
        newChord = generateRandomChord()
      }
      setCurrentChord(newChord)
    }
  }, 100)

  return <StyledRoot>
    <div className="prompt-header">
      <img src="%PUBLIC_URL%/images/logo.png" className="logo" alt="flashchords logo"/>
      <Settings className="button"/>
    </div>
    <ChordSymbolPrompt>
      <h2 className="current-chord-symbol">{chordToSymbol(currentChord)}</h2>
      {shouldDisplaySuccess &&
      <CheckIcon style={{color: "green"}}/>
      }
    </ChordSymbolPrompt>
    <div className="">

    </div>
  </StyledRoot>
}
