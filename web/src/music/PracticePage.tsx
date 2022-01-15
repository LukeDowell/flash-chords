import React, {useEffect, useState} from 'react';
import {Chord, generateRandomChord, isValidVoicing, MIDIPiano, Note, toChordSymbol} from "./Music";

interface ChordResult {
  targetChord: Chord,
  playedNotes: Note[],
  time: number
}

function PracticePage() {
  const [loadedMidi, setLoadedMidi] = useState(false)
  const [midiPiano, setMidiPiano] = useState<MIDIPiano>()
  const [currentChord, setCurrentChord] = useState<Chord>(generateRandomChord())
  const [chordRecords, setChordRecords] = useState<ChordResult[]>([])

  useEffect(() => {
    if (loadedMidi) return
    try {
      navigator.requestMIDIAccess().then(
        (midiAccess: WebMidi.MIDIAccess) => {
          const piano = new MIDIPiano(midiAccess.inputs.get("input-0")!!)
          piano.addListener(onActiveKeys)
          setMidiPiano(piano)
          setLoadedMidi(true)
        },
        (err: any) => console.log("OOPS", err)
      )
    } catch (e) {
      console.error("Unable to request MIDI access", e)
      setLoadedMidi(true)
    }
  }, [loadedMidi])

  const onActiveKeys = (activeKeys: Array<Note>, e: WebMidi.MIDIMessageEvent) => {
    if (isValidVoicing(currentChord, activeKeys)) {
      chordRecords.push({ targetChord: currentChord, playedNotes: activeKeys, time: Date.now()})
      let newChord = generateRandomChord()
      while(newChord === currentChord) newChord = generateRandomChord()
      setCurrentChord(newChord)
    }
  }

  return (
    <>
      <div className="chord-symbol-prompt" data-testid="chord-symbol-prompt">
        <h2>{ toChordSymbol(currentChord) }</h2>
      </div>
      <hr/>
      { chordRecords.length > 0 && Date.now() - chordRecords[chordRecords.length - 1].time <= 3000 &&
        <h2>Correct!</h2>
      }
      <div className="previous-chord-stats">
        { chordRecords.length > 0 &&
          <div>
            <p>{chordRecords[chordRecords.length - 1].targetChord}</p>
            <p>{chordRecords[chordRecords.length - 1].playedNotes}</p>
            <p>{chordRecords[chordRecords.length - 1].time}</p>
          </div>
        }
      </div>
    </>
  )
}

export default PracticePage;
