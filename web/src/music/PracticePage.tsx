import React, {useEffect, useState} from 'react';
import {Chord, generateRandomChord, isValidVoicing, MIDIPiano, Note, toChordSymbol} from "./Music";

interface ChordResult {
  targetChord: Chord,
  playedNotes: Note[],
  time: number
}

export interface Props {
  piano: MIDIPiano,
  onValidVoicing?: (activeNotes: Note[], chord: Chord) => any
}

function PracticePage({
                        piano, onValidVoicing = () => {
  }
                      }: Props) {
  const [chordResults, setChordResults] = useState<ChordResult[]>([])
  const [currentChord, setCurrentChord] = useState<Chord>(generateRandomChord)

  useEffect(() => {
    piano.addListener(onActiveNotes)
  }, [piano])

  const onActiveNotes = (activeNotes: Note[], e: WebMidi.MIDIMessageEvent) => {
    console.log(activeNotes)
    if (isValidVoicing(currentChord, activeNotes)) {
      const chordResult = {targetChord: currentChord, playedNotes: activeNotes, time: Date.now()}
      setChordResults([...chordResults, chordResult])
      let newChord = generateRandomChord()
      while (newChord === currentChord) newChord = generateRandomChord()
      onValidVoicing(activeNotes, currentChord)
      setCurrentChord(newChord)
    }
  }

  return (
    <div className="practice-page-root">
      <div className="chord-symbol-prompt" data-testid="chord-symbol-prompt">
        <h2>{toChordSymbol(currentChord)}</h2>
      </div>
    </div>
  )
}

export default PracticePage;
