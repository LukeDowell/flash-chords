// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'
import MidiPiano from "@/lib/music/MidiPiano";
import {render, RenderOptions, RenderResult} from "@testing-library/react";
import {MidiPianoContext} from "@/pages/_app.page";
import {ReactElement} from "react";


window.AudioContext = jest.fn().mockImplementation(() => {
  return {}
})


type MidiCallback = (e: WebMidi.MIDIMessageEvent) => void

export function midiRender(ui: ReactElement, options?: Omit<RenderOptions, 'queries'>): [MidiPiano, MidiCallback, RenderResult] {
  let midiCallback = (e: WebMidi.MIDIMessageEvent) => {
  }
  const mockedMidiInput: Partial<WebMidi.MIDIInput> = {
    addEventListener: jest.fn().mockImplementation(() => {
    })
  }
  mockedMidiInput.addEventListener = jest.fn().mockImplementation((key: string, callback: (e: WebMidi.MIDIMessageEvent) => void) => {
    midiCallback = callback
  })

  const midiPiano = new MidiPiano(mockedMidiInput as WebMidi.MIDIInput)

  return [
    midiPiano,
    midiCallback,
    render(<MidiPianoContext.Provider value={midiPiano}>{ui}</MidiPianoContext.Provider>, options)
  ]
}
