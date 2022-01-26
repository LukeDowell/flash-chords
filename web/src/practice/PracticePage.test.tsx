import React from 'react';
import {act, render, screen} from "@testing-library/react";
import PracticePage from "./PracticePage";
import MIDIPiano from "../music/MIDIPiano";
import {Chord, toNote} from "../music/Music";
import userEvent from "@testing-library/user-event";

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

  it('should show the settings window after clicking the settings button', () => {
    render(<PracticePage piano={midiPiano}/>)

    userEvent.click(screen.getByTestId('SettingsIcon'))

    expect(screen.getByText(/Sevenths/)).toBeInTheDocument()
    expect(screen.getByText(/Triads/)).toBeInTheDocument()
  })

  it('should show a close icon after opening the settings window', () => {
    render(<PracticePage piano={midiPiano}/>)

    userEvent.click(screen.getByTestId('SettingsIcon'))

    expect(screen.getByTestId('CloseIcon')).toBeInTheDocument()
    expect(screen.getByTestId('SettingsIcon')).not.toBeInTheDocument()
  })

  it('should show basic statistics about chord practice', () => {
    const initialChord: Chord = {root: "C", quality: "Major"}
    render(<PracticePage piano={midiPiano} initialChord={initialChord}/>)

    midiPiano['listeners'].forEach((c) => c.call(c, ["C2", "E2", "G2"].map(toNote)))

    expect(screen.getByText(/Voicings attempted: 1/)).toBeInTheDocument()
    expect(screen.getByText(/Valid voicings: 1/)).toBeInTheDocument()
  })

  it('should fail a chord voicing after the timer ends', async () => {
    const practiceSettings = {
      timerEnabled: true,
      timerValue: 1
    }

    render(<PracticePage piano={midiPiano} practiceSettings={practiceSettings}/>)
    const element = await screen.queryByText(/Voicings attempted: 2/)

    expect(element).toBeInTheDocument()
    expect(screen.getByText(/Valid voicings: 0/))
  })
})
