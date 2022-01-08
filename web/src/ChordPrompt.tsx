import React from 'react';

function ChordPrompt() {
  const onSuccess = (midi: any) => {
    console.log("Hi", midi)
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
