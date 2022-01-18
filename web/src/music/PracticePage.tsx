import React, {useEffect, useState} from 'react';
import {Chord, generateRandomChord, isValidVoicing, Note, toChordSymbol} from "./Music";
import MIDIPiano from "./MIDIPiano";
import styled from "@emotion/styled";
import CheckIcon from '@mui/icons-material/Check'
import {useInterval} from "../utility";

export interface Props {
  piano: MIDIPiano,
  initialChord?: Chord,
  onValidVoicing?: (activeNotes: Note[], chord: Chord) => any
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
                        initialChord = generateRandomChord(),
                        onValidVoicing = () => {}}: Props) {
  const [currentChord, setCurrentChord] = useState<Chord>(initialChord)
  const [timeOfLastSuccess, setTimeOfLastSuccess] = useState(Date.now() - 1000)
  const [shouldDisplaySuccess, setShouldDisplaySuccess] = useState(false)

  useEffect(() => {
    piano.setListener("PracticePage", onActiveNotes)
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

  function onActiveNotes(activeNotes: Note[]) {
    if (activeNotes.length >= 3) {
      console.log(`Checking voicing of ${toChordSymbol(currentChord)}`)
    }
    if (isValidVoicing(currentChord, activeNotes)) {
      console.log(`Valid voicing of ${toChordSymbol(currentChord)}`)
      setTimeOfLastSuccess(Date.now())
      setShouldDisplaySuccess(true)
    }
  }

  return <StyledComponent>
    <h2>{toChordSymbol(currentChord)}</h2>
    {shouldDisplaySuccess &&
    <CheckIcon style={{color: "green"}}/>
    }
  </StyledComponent>
}
