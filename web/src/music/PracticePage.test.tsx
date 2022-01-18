import React from 'react';
import {render, screen} from "@testing-library/react";
import PracticePage from "./PracticePage";
import MIDIPiano from "./MIDIPiano";
import {Chord} from "./Music";

const mockedMidiInput: Partial<WebMidi.MIDIInput> = {
  addEventListener: jest.fn().mockImplementation(() => {
  })
}


describe("the practice page", () => {
  let midiPiano: MIDIPiano

  beforeEach(() => {
    midiPiano = new MIDIPiano(mockedMidiInput as WebMidi.MIDIInput)
  })

  it('should render', () => {
    render(<PracticePage piano={midiPiano} onValidVoicing={() => {
    }}/>)
  })

  it('should display feedback when the user correctly voices a chord', async () => {
    const initialChord: Chord = {root: "C", quality: "Major"}
    render(<PracticePage piano={midiPiano} initialChord={initialChord}/>)
    midiPiano['listeners'].forEach((c) => c.call(c, ["C2", "E2", "G2"]))
    const expected = await screen.findByTestId('CheckIcon')
    expect(expected).toBeInTheDocument()
  })
})
