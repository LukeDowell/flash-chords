import React from 'react';
import {render, screen} from "@testing-library/react";
import PracticePage from "./PracticePage";
import {MIDIPiano} from "./Music";

const mockedMidiInput: Partial<WebMidi.MIDIInput> = {
  addEventListener: jest.fn().mockImplementation(() => {})
}
const mockedPiano: MIDIPiano = jest.mocked(new MIDIPiano(mockedMidiInput as WebMidi.MIDIInput), false)
describe("the practice page", () => {
  it('should render', () => {
    render(<PracticePage piano={mockedPiano} />)
  })
})
