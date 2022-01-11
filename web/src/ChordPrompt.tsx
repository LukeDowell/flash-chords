import React, {useEffect, useState} from 'react';
import {MIDIPiano} from "./Music";

function ChordPrompt() {
  const [loadedMidi, setLoadedMidi] = useState(false)
  const [midiPiano, setMidiPiano] = useState<MIDIPiano>()

  useEffect(() => {
    if (loadedMidi) return
    navigator.requestMIDIAccess().then(
      (midiAccess: WebMidi.MIDIAccess) => {
        setMidiPiano(new MIDIPiano(midiAccess.inputs.get("input-0")!!))
        setLoadedMidi(true)
      },
      (err: any) => console.log("OOPS", err)
    )
  }, [loadedMidi])

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
