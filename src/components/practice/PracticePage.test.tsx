import React from 'react';
import {act, screen, waitFor} from "@testing-library/react";
import PracticePage from "@/components/practice/PracticePage";
import {MIDI, MIDI_KEYBOARD_OFFSET} from "@/lib/music/MIDIPiano";
import userEvent from "@testing-library/user-event";
import {findNoteOnKeyboard, toNote} from "@/lib/music/Note";
import {midiRender} from "../../jest.setup";
import {getKey} from "@/lib/music/Circle";
import {Chord} from "@/lib/music/Chord";


describe("the practice page", () => {
  it('should render', () => {
    midiRender(<PracticePage/>)
  })

  it('should display feedback when the user correctly voices a chord', async () => {
    const [midiPiano, _, screen] = midiRender(<PracticePage initialChord={new Chord('C', 'Major')}
                                                            initialKey={getKey('C', 'Major')}/>)

    await act(() => {
      midiPiano['listeners'].forEach((c) => c.call(c, ["C2", "E2", "G2"].map(toNote)))
    })

    await waitFor(() => expect(screen.getByTestId('CheckIcon')).toBeInTheDocument())
  })

  it('should show the settings window after clicking the settings button', async () => {
    const user = userEvent.setup()
    midiRender(<PracticePage/>)

    await user.click(screen.getByTestId('SettingsIcon'))

    expect(screen.getByText(/Sevenths/)).toBeInTheDocument()
    expect(screen.getByText(/Triads/)).toBeInTheDocument()
  })

  it('should show a close icon after opening the settings window', async () => {
    const user = userEvent.setup()
    midiRender(<PracticePage/>)

    await user.click(screen.getByTestId('SettingsIcon'))

    expect(screen.getByTestId('CloseIcon')).toBeInTheDocument()
    expect(screen.queryByTestId('SettingsIcon')).not.toBeInTheDocument()
  })

  it('should show the correct notes for a chord if the user fails to enter a valid voicing in time', async () => {
    const initialChord = new Chord('C', 'Major')
    const settings = {
      timerEnabled: true,
      timerMilliseconds: 100
    }
    const [p, i, screen] = midiRender(<PracticePage initialChord={initialChord} initialKey={getKey('C', 'Major')}
                                                    initialSettings={settings}/>)

    await waitFor(() => {
      expect(screen.getByText("C, E, G")).toBeInTheDocument()
    })
  })

  it('should fail a chord voicing after the timer ends', async () => {
    const settings = {
      timerEnabled: true,
      timerMilliseconds: 1
    }

    midiRender(<PracticePage initialChord={new Chord('B#', 'Diminished')} initialSettings={settings}/>)

    await waitFor(() => expect(screen.getByTestId("B#dim-invalid-voicing")).toBeInTheDocument())
  })

  it('should be able to successfully play a chord via a midi piano', async () => {
    const events = ['B', 'D', 'F'].map(toNote).map(findNoteOnKeyboard).map((n): Partial<WebMidi.MIDIMessageEvent> => {
      return {
        data: Uint8Array.of(MIDI.KEY_DOWN, n + MIDI_KEYBOARD_OFFSET, 100)
      }
    })

    const [_, pianoEmitter, screen] = midiRender(<PracticePage initialChord={new Chord('B', 'Diminished')}
                                                               initialKey={getKey('C', 'Major')}/>)

    await act(() => events.forEach((e) => pianoEmitter.call(e, e as WebMidi.MIDIMessageEvent)))
    await waitFor(() => expect(screen.getByTestId('CheckIcon')).toBeInTheDocument())
  })
})
