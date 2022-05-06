import React from 'react';
import {act, render, screen} from "@testing-library/react";
import PracticePage from "./PracticePage";
import MIDIPiano, {MIDI, MIDI_KEYBOARD_OFFSET} from "../music/MIDIPiano";
import userEvent from "@testing-library/user-event";
import {Chord, chordToSymbol, symbolToChord} from "../music/Chord";
import {FLAT, toNote} from "../music/Note";

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

  it('should show the correct notes for a chord if the user fails to enter a vaid voicing in time', async () => {
    const initialChord: Chord = {root: "C", quality: "Major"}
    const settings = {
      timerEnabled: true,
      timerSeconds: 1
    }

    render(<PracticePage piano={midiPiano} initialChord={initialChord} initialSettings={settings}/>)

    await act(() => new Promise((r) => setTimeout(r, 1300)))

    const expected = await screen.findByText(chordToSymbol(initialChord))
    expect(expected).toBeInTheDocument()
    expect(screen.getByText(/C, E, G/)).toBeInTheDocument()
  })

  it('should fail a chord voicing after the timer ends', async () => {
    const practiceSettings = {
      timerEnabled: true,
      timerSeconds: 1
    }

    const initialChord = symbolToChord("B#dim")
    render(<PracticePage piano={midiPiano} initialSettings={practiceSettings} initialChord={initialChord}/>)
    await act(() => new Promise((r) => setTimeout(r, 1250)))

    const expected = await screen.findByTestId("B#dim-invalid-voicing");
    expect(expected).toBeInTheDocument()
  })

  it('should be able to successfully play a chord via a midi piano', async () => {
    let pianoEmitter: (e: WebMidi.MIDIMessageEvent) => void
    mockedMidiInput.addEventListener = jest.fn().mockImplementation(
      (key: string, callback: (e: WebMidi.MIDIMessageEvent) => void) => {
        pianoEmitter = callback
      }
    )
    midiPiano = new MIDIPiano(mockedMidiInput as WebMidi.MIDIInput)

    const events = [13, 16, 20, 23]
      .map((n): Partial<WebMidi.MIDIMessageEvent> => {
        return {
          data: Uint8Array.of(MIDI.KEY_DOWN, n + MIDI_KEYBOARD_OFFSET, 100)
        }
      })

    const initialChord: Chord = {
      accidental: FLAT,
      quality: "Minor",
      root: "B",
      seventh: "Minor"
    }

    render(<PracticePage piano={midiPiano} initialChord={initialChord}/>)

    act(() => events.forEach((e) => pianoEmitter.call(e, e as WebMidi.MIDIMessageEvent)))

    const expected = await screen.findByTestId('CheckIcon')
    expect(expected).toBeInTheDocument()
  })
})
