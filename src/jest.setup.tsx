// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'
import MIDIPiano from "@/lib/music/MIDIPiano";
import {render, RenderOptions, RenderResult} from "@testing-library/react";
import {MIDIPianoContext} from "@/pages/_app.page";
import {ReactElement} from "react";

export const mockRequestMIDIAccess = jest.fn().mockImplementation(() => new Error("Not Implemented!"))
global.navigator.requestMIDIAccess = mockRequestMIDIAccess;

type PianoNoteEmitter = (e: WebMidi.MIDIMessageEvent) => void

export function midiRender(ui: ReactElement, options?: Omit<RenderOptions, 'queries'>): [MIDIPiano, PianoNoteEmitter, RenderResult] {
  let pianoNoteEmitter: PianoNoteEmitter = () => {
  }
  const mockedMidiInput: Partial<WebMidi.MIDIInput> = {
    addEventListener: jest.fn().mockImplementation(() => {
    })
  }
  mockedMidiInput.addEventListener = jest.fn().mockImplementation((key: string, callback: (e: WebMidi.MIDIMessageEvent) => void) => {
    pianoNoteEmitter = callback
  })

  const midiPiano = new MIDIPiano(mockedMidiInput as WebMidi.MIDIInput)

  return [
    midiPiano,
    pianoNoteEmitter,
    render(<MIDIPianoContext.Provider value={midiPiano}>{ui}</MIDIPianoContext.Provider>, options)
  ]
}
