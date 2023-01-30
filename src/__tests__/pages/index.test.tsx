import * as React from 'react'
import {render, screen} from '@testing-library/react'
import HomePage from "@/pages/index";
import {mockRequestMIDIAccess} from "../../../jest.setup";

describe('the index page', () => {
  beforeEach(() => {
    mockRequestMIDIAccess.mockClear()
  })

  it('should render', () => {
    render(<HomePage/>)
  })

  it('should display a message when the browser does not support MIDI', async () => {
    mockRequestMIDIAccess.mockReturnValue(undefined)
    render(<HomePage/>)
    const errorMessage = await screen.findByText(/Your browser does not provide MIDI access, please use Chrome, Safari or Edge on a desktop or android device/)
    expect(errorMessage).toBeInTheDocument()
  })

  it('should display a message when a valid MIDI input was unable to be found', async () => {
    mockRequestMIDIAccess.mockImplementation((): Promise<Partial<WebMidi.MIDIAccess>> => {
      return Promise.resolve({
        inputs: new Map<string, WebMidi.MIDIInput>([])
      })
    })

    render(<HomePage/>)
    const expectedElement = await screen.findByText(/Your browser supports MIDI access, but a MIDI device could not be found/)
    expect(expectedElement).toBeInTheDocument()
  })
})
