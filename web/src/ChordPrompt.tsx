import React from 'react';

function ChordPrompt() {
  const onSuccess = (midi: WebMidi.MIDIAccess) => {
    console.log("Hi", midi)
    const input = midi.inputs.get(midi.inputs.keys().next().value)!!
    console.log("Input", input)

    input.addEventListener("midimessage", onMidiMessage)
  }

  const onMidiMessage = (e: WebMidi.MIDIMessageEvent) => {
    console.log(e) // Seems like the value at index 1 in the data field is the note?
  }

  navigator.requestMIDIAccess().then(onSuccess, (err: any) => console.log("OOPS", err))

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
