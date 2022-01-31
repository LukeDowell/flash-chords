import * as React from 'react'
import {VoicingHistory, VoicingResult} from "./VoicingHistory";
import {render, screen} from "@testing-library/react";
import {toNote} from "../music/Note";
import {symbolToChord} from "../music/Chord";

describe('the voicing history component', () => {
  it('should render a voicing', async () => {
    const validNotes = ["C2", "E\u266d2", "G2"].map(toNote)
    const voicingResults: VoicingResult[] = [
      {
        chord: {root: "C", quality: "Minor"},
        validNotes
      }
    ]

    render(<VoicingHistory voicingResults={voicingResults}/>)

    const expected = await screen.findByText(/C, E\u266d, G/)
    expect(expected).toBeInTheDocument()
  })

  it('should render the required notes for a voicing if none are provided', async () => {
    const voicingResults: VoicingResult[] = [
      {
        chord: symbolToChord("B#dim")!!,
        validNotes: []
      }
    ]

    render(<VoicingHistory voicingResults={voicingResults}/>)

    const expected = await screen.findByText(/C, D#, F#/)
    expect(expected).toBeInTheDocument()
  })
})
