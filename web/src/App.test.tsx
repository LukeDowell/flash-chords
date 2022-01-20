import React from 'react'
import {render, screen} from "@testing-library/react";
import App from "./App";
import {mockRequestMIDIAccess} from "./setupTests";

describe('the flash chords app', () => {
  beforeEach(() => {
    mockRequestMIDIAccess.mockClear()
  })

  it('should render', () => {
    render(<App/>)
  })

  it('should display a message when the browser does not support MIDI', () => {
    mockRequestMIDIAccess.mockReturnValue(undefined)
    render(<App/>)
    expect(screen.getByText(/Your browser does not provide MIDI access, please use Chrome, Safari or Edge on a desktop or android device/)).toBeInTheDocument()
  })

  it('should display a message when a valid MIDI input was unable to be found', async () => {
    mockRequestMIDIAccess.mockImplementation((): Promise<Partial<WebMidi.MIDIAccess>> => {
      return Promise.resolve({
        inputs: new Map<string, WebMidi.MIDIInput>([])
      })
    })

    render(<App/>)
    const expectedElement = await screen.findByText(/Your browser supports MIDI access, but a MIDI device could not be found/)
    expect(expectedElement).toBeInTheDocument()
  })
})
