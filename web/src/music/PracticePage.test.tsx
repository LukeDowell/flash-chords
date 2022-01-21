import React from 'react';
import {act, render, screen} from "@testing-library/react";
import PracticePage from "./PracticePage";
import MIDIPiano from "./MIDIPiano";
import {Chord, toNote} from "./Music";

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
    render(<PracticePage piano={midiPiano}/>)
  })

  it('should display feedback when the user correctly voices a chord', async () => {
    const initialChord: Chord = {root: "C", quality: "Major"}
    render(<PracticePage piano={midiPiano} initialChord={initialChord}/>)

    await act(async () => {
      midiPiano['listeners'].forEach((c) => c.call(c, ["C2", "E2", "G2"].map(toNote)))
    })

    const expected = await screen.findByTestId('CheckIcon')
    expect(expected).toBeInTheDocument()
  })

  it('should not accept the same chord symbol twice in a row', async () => {
    const initialChord: Chord = {root: "C", quality: "Major"}
    render(<PracticePage piano={midiPiano} initialChord={initialChord}/>)

    await act(async () => {
      midiPiano['listeners'].forEach((c) => c.call(c, ["C2", "E2", "G2"].map(toNote)))
      await new Promise((r) => setTimeout(r, 1100))
      midiPiano['listeners'].forEach((c) => c.call(c, ["C2", "E2", "G2"].map(toNote)))
    })

    const hopefullyNoCheckIcon = await screen.queryByTestId('CheckIcon')
    expect(hopefullyNoCheckIcon).not.toBeInTheDocument()
  })
})
