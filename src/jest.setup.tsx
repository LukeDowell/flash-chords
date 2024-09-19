// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

import '@testing-library/jest-dom'
import {render, RenderOptions, RenderResult} from "@testing-library/react";
import {ReactElement} from "react";
import MidiPiano from "@/lib/music/MidiPiano";
import 'whatwg-fetch'
import {MidiPianoContext} from '@/lib/react/contexts';

declare var window: {
  webkitAudioContext: typeof AudioContext;
  AudioContext: typeof AudioContext
} & Window & typeof globalThis;

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
