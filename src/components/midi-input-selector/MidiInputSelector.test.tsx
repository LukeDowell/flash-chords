import {MidiInputSelector} from "@/components/midi-input-selector/MidiInputSelector";
import {act, fireEvent, render, screen, waitFor} from "@testing-library/react";
import MIDIInput = WebMidi.MIDIInput;


describe('midi input selector', () => {
  it('should display a list of available midi inputs', async () => {
    const expectedInputName = Math.random().toString(16).slice(2)
    global.navigator.requestMIDIAccess = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        addEventListener: jest.fn(),
        inputs: new Map<string, MIDIInput>([
          ["fake-id", {name: expectedInputName} as MIDIInput]])
      })
    })

    render(<MidiInputSelector/>)
    fireEvent.mouseDown(screen.getByRole('combobox'))

    await waitFor(() => expect(screen.getByRole('option').textContent).toBe(expectedInputName))
  })
})
