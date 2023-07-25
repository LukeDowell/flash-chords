import {MidiInputSelector} from "@/components/midi-input-selector/MidiInputSelector";
import {fireEvent, render, screen} from "@testing-library/react";
import MIDIInput = WebMidi.MIDIInput;


describe('midi input selector', () => {
  it('should display a list of available midi inputs', async () => {
    const expectedInputID = Math.random().toString(16).slice(2)
    global.navigator.requestMIDIAccess = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        addEventListener: jest.fn(),
        inputs: new Map<string, MIDIInput>([
          [expectedInputID, {} as MIDIInput]
        ])
      })
    })

    render(<MidiInputSelector/>)
    fireEvent.mouseDown(screen.getByRole('button'))

    expect(await screen.findByText(expectedInputID)).toBeVisible()
  })
})
