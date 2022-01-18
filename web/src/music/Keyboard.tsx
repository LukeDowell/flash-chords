import React, {useState} from 'react'
import {KEYBOARD, MIDIPiano, Note} from "./Music";

export interface KeyProps {
  note: Note,
  onPress: (n: Note) => void
}

export const Key = ({note, onPress}: KeyProps) => {
  const [isPressed, setIsPressed] = useState(false)
  return <div className={`${note}-key-root`}>
  </div>
}

interface KeyboardProps {
  midiPiano: MIDIPiano,
  onKeyPress: (n: Note) => void
}

export const Keyboard = ({midiPiano, onKeyPress}: KeyboardProps) => {
  const keys = KEYBOARD.map((note) => <Key key={note} note={note} onPress={onKeyPress}/>)
  return <div className="keyboard-root">
    {keys}
  </div>
}
