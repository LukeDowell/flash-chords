import * as React from 'react'
import {VoicingHistory, VoicingResult} from "@/components/practice/VoicingHistory";
import {render, screen} from "@testing-library/react";
import {SHARP, toNote} from "@/lib/music/Note";
import {toChord} from "@/lib/music/Chord";

describe('the voicing history component', () => {
  it('should render a voicing', async () => {
    const validNotes = ["C2", "Eb2", "G2"].map(toNote)
    const voicingResults: VoicingResult[] = [
      {
        chord: {root: "C", quality: "Minor"},
        validNotes
      }
    ]

    render(<VoicingHistory voicingResults={voicingResults}/>)

    const expected = await screen.findByText(/C, Eb, G/)
    expect(expected).toBeInTheDocument()
  })

  it('should render a voicing formatted in a proper way', async () => {
    const validNotes = ["C", "D#", "F#"].map(toNote)
    const voicingResults: VoicingResult[] = [
      {
        chord: {root: "B", accidental: SHARP, quality: "Diminished"},
        validNotes
      }
    ]

    render(<VoicingHistory voicingResults={voicingResults}/>)

    const expected = await screen.findByText(/B#, D#, F#/)
    expect(expected).toBeInTheDocument()
  })

  it('should render the required notes for a voicing if none are provided', async () => {
    const voicingResults: VoicingResult[] = [
      {
        chord: toChord("B#dim")!!,
        validNotes: []
      }
    ]

    render(<VoicingHistory voicingResults={voicingResults}/>)

    const expected = await screen.findByText(/B#, D#, F#/)
    expect(expected).toBeInTheDocument()
  })

  test.each([
    ['DbM7', ['Db', 'F', 'Ab', 'C']],
    ['E#7', ['E#', 'A', 'C', 'D#']],
  ])(
    `should render the required notes for a seventh voicing if none are provided`,
    async (chordSymbol: string, expectedNotes: string[]) => {
      const voicingResults: VoicingResult[] = [
        {
          chord: toChord(chordSymbol)!!,
          validNotes: []
        }
      ]

      render(<VoicingHistory voicingResults={voicingResults}/>)

      const expected = await screen.findByText(expectedNotes.join(', '))
      expect(expected).toBeInTheDocument()
    }
  )
})
