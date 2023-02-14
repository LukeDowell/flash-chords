import * as React from 'react'
import {VoicingHistory, VoicingResult} from "@/components/practice/VoicingHistory";
import {render, screen} from "@testing-library/react";
import {toNote} from "@/lib/music/Note";
import {FChord, getKey} from "@/lib/music/Circle";

describe('the voicing history component', () => {
  it('should render a voicing', async () => {
    const validNotes = ["Db2", "F2", "Ab2"].map(toNote)
    const voicingResults: VoicingResult[] = [
      {
        chord: new FChord('Db', 'Major'),
        key: getKey('Db', 'Major'),
        validNotes
      }
    ]

    render(<VoicingHistory voicingResults={voicingResults}/>)

    const expected = await screen.findByText(/Db, F, Ab/)
    expect(expected).toBeInTheDocument()
  })

  it('should render the required notes for a voicing if none are provided', async () => {
    const voicingResults: VoicingResult[] = [
      {
        chord: new FChord('C', 'Diminished'),
        key: getKey('Db', 'Major'),
        validNotes: ['C', 'Eb', 'Gb'].map(toNote)
      }
    ]

    render(<VoicingHistory voicingResults={voicingResults}/>)

    const expected = await screen.findByText(/C, Eb, Gb/)
    expect(expected).toBeInTheDocument()
  })
})
