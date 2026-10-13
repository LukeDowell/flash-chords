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

  it('should register the statechange listener only once across re-renders', async () => {
    const addEventListener = jest.fn()
    global.navigator.requestMIDIAccess = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        addEventListener,
        inputs: new Map<string, MIDIInput>([
          ["fake-id", {name: 'piano', addEventListener: jest.fn()} as unknown as MIDIInput]])
      })
    })

    render(<MidiInputSelector/>)

    await waitFor(() => expect(screen.getByRole('combobox').textContent).toContain('piano'))
    expect(addEventListener.mock.calls.filter(([type]) => type === 'statechange')).toHaveLength(1)
  })

  it('should show an error message naming supported browsers when midi access fails', async () => {
    global.navigator.requestMIDIAccess = jest.fn().mockRejectedValue(new Error('no midi for you'))

    render(<MidiInputSelector/>)

    await waitFor(() => expect(screen.getByText(/unable to access midi/i)).toBeInTheDocument())
    expect(screen.getByText(/chrome/i)).toBeInTheDocument()
  })

  it('should re-select an input after a device reconnects without showing an error', async () => {
    let stateChangeListener: (e: Partial<WebMidi.MIDIConnectionEvent>) => void = () => {
    }
    const input = {name: 'piano', id: 'id-1', addEventListener: jest.fn()} as unknown as MIDIInput
    global.navigator.requestMIDIAccess = jest.fn().mockImplementation(() => Promise.resolve({
      addEventListener: jest.fn().mockImplementation((type: string, cb: typeof stateChangeListener) => {
        if (type === 'statechange') stateChangeListener = cb
      }),
      inputs: new Map<string, MIDIInput>([["id-1", input]])
    }))
    const onInputSelected = jest.fn()

    render(<MidiInputSelector onInputSelected={onInputSelected}/>)
    await waitFor(() => expect(onInputSelected).toHaveBeenCalledTimes(1))

    act(() => stateChangeListener({}))

    await waitFor(() => expect(onInputSelected).toHaveBeenCalledTimes(2))
    expect(screen.queryByText(/does not exist/i)).not.toBeInTheDocument()
  })
})
