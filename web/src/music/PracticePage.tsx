import React, {useCallback, useEffect, useState} from 'react';
import {Chord, generateRandomChord, isValidVoicing, Note, chordToSymbol} from "./Music";
import MIDIPiano from "./MIDIPiano";
import styled from "@emotion/styled";
import CheckIcon from '@mui/icons-material/Check'
import {useInterval} from "../utility";

export interface Props {
  piano: MIDIPiano,
  initialChord?: Chord,
}

const StyledComponent = styled('div')({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "h2": {
    fontSize: 50
  }
})

export default function PracticePage({
                                       piano,
                                       initialChord = generateRandomChord()
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
    return () => {
      piano.removeListener("PracticePage")
    }
  }, [currentChord])

  useInterval(() => {
    const inTimeWindow = Date.now() - timeOfLastSuccess <= 1000
    if (!inTimeWindow && shouldDisplaySuccess) {
      setShouldDisplaySuccess(false)
      let newChord = generateRandomChord()
      while (newChord == currentChord) {
        newChord = generateRandomChord()
      }
      setCurrentChord(newChord)
    }
  }, 100)

  return <StyledComponent>
    <h2>{chordToSymbol(currentChord)}</h2>
    {shouldDisplaySuccess &&
    <CheckIcon style={{color: "green"}}/>
    }
  </StyledComponent>
}
