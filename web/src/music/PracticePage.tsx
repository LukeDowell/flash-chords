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

function PracticePage({
                        piano, initialChord = generateRandomChord(), onValidVoicing = () => {
  }
                      }: Props) {
  const [currentChord, setCurrentChord] = useState<Chord>(initialChord)
  const [hasAddedListener, setHasAddedListener] = useState(false)
  const [timeOfLastSuccess, setTimeOfLastSuccess] = useState(Date.now() - 1000)
  const [shouldDisplaySuccess, setShouldDisplaySuccess] = useState(false)

  useEffect(() => {
    if (!hasAddedListener) {
      piano.addListener(onActiveNotes)
      setHasAddedListener(true)
    }
  }, [piano])

  useInterval(() => {
    const inTimeWindow = Date.now() - timeOfLastSuccess <= 1000
    console.log(`${inTimeWindow} --- ${shouldDisplaySuccess}`)
    if (!inTimeWindow && shouldDisplaySuccess) {
      console.log('display to false')
      setShouldDisplaySuccess(false)
      let newChord = generateRandomChord()
      while (newChord === currentChord) newChord = generateRandomChord()
      setCurrentChord(newChord)
    }
  }, 100)

  const onActiveNotes = (activeNotes: Note[]) => {
    if (isValidVoicing(currentChord, activeNotes)) {
      onValidVoicing(activeNotes, currentChord)
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

export default PracticePage;
