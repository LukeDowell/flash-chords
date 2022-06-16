import React from 'react'
import {render, screen} from "@testing-library/react";
import {toNote} from "../music/Note";
import {Measure} from "./Measure";


describe('a measure', () => {
  it('should render notes', () => {
    const notes = ['C4', 'E4', 'G4'].map(toNote)

    render(<Measure notes={notes}/>)

    expect(screen.getByTestId('C4-note')).toBeInTheDocument()
    expect(screen.getByTestId('C4-note')).toBeInTheDocument()
    expect(screen.getByTestId('G4-note')).toBeInTheDocument()
  })

  it('should render accidentals', () => {
    const notes = ['Cb4', 'D#4', 'E4', 'A5'].map(toNote)

    render(<Measure notes={notes}/>)

    expect(screen.getByTestId('Cb4-accidental')).toBeInTheDocument()
    expect(screen.getByTestId('D#4-accidental')).toBeInTheDocument()
    expect(screen.queryByTestId('Eb4-accidental')).not.toBeInTheDocument()
    expect(screen.queryByTestId('E#4-accidental')).not.toBeInTheDocument()
  })
})
