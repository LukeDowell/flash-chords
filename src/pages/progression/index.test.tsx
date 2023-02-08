import React from 'react'
import ProgressionPage from './index.page'
import {render} from "@testing-library/react";

const mockedMidiInput: Partial<WebMidi.MIDIInput> = {
  addEventListener: jest.fn().mockImplementation(() => {
  })
}

describe('the chord progression practice page', () => {
  it('should render', () => {
    render(<ProgressionPage/>)
  })
})
