import React from 'react';
import {act, render, screen} from "@testing-library/react";
import PracticePage from "./PracticePage";
import MIDIPiano from "../music/MIDIPiano";
import userEvent from "@testing-library/user-event";
import {Chord} from "../music/Chord";
import {toNote} from "../music/Note";

const mockedMidiInput: Partial<WebMidi.MIDIInput> = {
  addEventListener: jest.fn().mockImplementation(() => {
  })
}


describe("the practice page", () => {
  let midiPiano: MIDIPiano

  beforeEach(() => {
    mockedMidiInput.addEventListener = jest.fn().mockImplementation(() => {
    })
    midiPiano = new MIDIPiano(mockedMidiInput as WebMidi.MIDIInput)
  })

  it('should render', () => {
    render(<PracticePage piano={midiPiano}/>)
  })

  it('should display feedback when the user correctly voices a chord', async () => {
    const initialChord: Chord = {root: "C", quality: "Major"}
    render(<PracticePage piano={midiPiano} initialChord={initialChord}/>)

    act(() => {
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
      await new Promise((r) => setTimeout(r, 1300))
      midiPiano['listeners'].forEach((c) => c.call(c, ["C2", "E2", "G2"].map(toNote)))
    })

    expect(screen.queryByTestId('CheckIcon')).not.toBeInTheDocument()
  })

  it('should show the settings window after clicking the settings button', async () => {
    const user = userEvent.setup()
    render(<PracticePage piano={midiPiano}/>)

    await user.click(screen.getByTestId('SettingsIcon'))

    expect(screen.getByText(/Sevenths/)).toBeInTheDocument()
    expect(screen.getByText(/Triads/)).toBeInTheDocument()
  })

  it('should show a close icon after opening the settings window', async () => {
    const user = userEvent.setup()
    render(<PracticePage piano={midiPiano}/>)

    await user.click(screen.getByTestId('SettingsIcon'))

    expect(screen.getByTestId('CloseIcon')).toBeInTheDocument()
    expect(screen.queryByTestId('SettingsIcon')).not.toBeInTheDocument()
  })

  it('should show basic statistics about chord practice', async () => {
    const initialChord: Chord = {root: "C", quality: "Major"}
    render(<PracticePage piano={midiPiano} initialChord={initialChord}/>)

    act(() => midiPiano['listeners'].forEach((c) => c.call(c, ["C2", "E2", "G2"].map(toNote))))

    const expectedAttempts = await screen.findByText(/Voicings attempted: 1/)
    const expectedValidVoicings = await screen.findByText(/Valid voicings: 1/)
    expect(expectedAttempts).toBeInTheDocument()
    expect(expectedValidVoicings).toBeInTheDocument()
  })

  it('should fail a chord voicing after the timer ends', async () => {
    const practiceSettings = {
      timerEnabled: true,
      timerSeconds: 1
    }
    render(<PracticePage piano={midiPiano} initialSettings={practiceSettings}/>)

    await act(async () => await new Promise((r) => setTimeout(r, 1250)))

    const element = await screen.findByText(/Voicings attempted: 1/)
    expect(element).toBeInTheDocument()
    expect(screen.getByText(/Valid voicings: 0/)).toBeInTheDocument()
  })
})
