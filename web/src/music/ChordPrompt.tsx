import React, {useEffect, useState} from 'react';
import {MIDIPiano, Chord} from "./Music";

function ChordPrompt() {
  const [loadedMidi, setLoadedMidi] = useState(false)
  const [midiPiano, setMidiPiano] = useState<MIDIPiano>()
  const [currentChord, setCurrentChord] = useState<Chord>()

  useEffect(() => {
    if (loadedMidi) return
    navigator.requestMIDIAccess().then(
      (midiAccess: WebMidi.MIDIAccess) => {
        const piano = new MIDIPiano(midiAccess.inputs.get("input-0")!!)
        piano.addListener(onActiveKeys)
        setMidiPiano(piano)
        setLoadedMidi(true)
      },
      (err: any) => console.log("OOPS", err)
    )
  }, [loadedMidi])

  const onActiveKeys = (activeKeys: Array<string>, e: WebMidi.MIDIMessageEvent) => {

  }

  return (
    <>
      <div className="chord-notation-prompt">

      </div>
      <div className="answer-indicator">

      </div>
    </>
  )
}

export default ChordPrompt;
