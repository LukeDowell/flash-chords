import * as React from 'react'
import {VoicingHistory, VoicingResult} from "./VoicingHistory";
import {render, screen} from "@testing-library/react";
import {toNote} from "../music/Note";
import {chordToSymbol} from "../music/Chord";

describe('the voicing history component', () => {
  it('should render a voicing', async () => {
    const voicingResults: VoicingResult[] = [
      {
        chord: {root: "C", quality: "Minor"},
        validNotes: ["C2, E\u266d2, G2"].map(toNote)
      }
    ]

    render(<VoicingHistory voicingResults={voicingResults}/>)

    const expected = await screen.findByText(chordToSymbol(voicingResults[0].chord))
    expect(expected).toBeInTheDocument()
    expect(screen.getByText(/C2, E\u266d2, G2/)).toBeInTheDocument()
  })
})
