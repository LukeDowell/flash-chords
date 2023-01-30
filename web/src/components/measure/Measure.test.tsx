import React from 'react'
import {render, screen} from "@testing-library/react";
import {toNote} from "../../music/Note";
import {Measure, MeasureOptions} from "./Measure";
import {MAJOR_KEYS} from '../../music/Keys';


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

    render(<Measure notes={notes} key={undefined}/>)

    expect(screen.getByTestId('Cb4-accidental')).toBeInTheDocument()
    expect(screen.getByTestId('D#4-accidental')).toBeInTheDocument()
    expect(screen.queryByTestId('Eb4-accidental')).not.toBeInTheDocument()
    expect(screen.queryByTestId('E#4-accidental')).not.toBeInTheDocument()
  })

  it('should render according to the provided key', () => {
    const notes = ['C#4', 'F4', 'G#4', 'C5'].map(toNote)
    const key = MAJOR_KEYS['Db']

    render(<Measure notes={notes} musicalKey={key}/>)

    expect(screen.queryByTestId('C#4-note')).not.toBeInTheDocument()
    expect(screen.queryByTestId('G#4-note')).not.toBeInTheDocument()

    expect(screen.getByTestId('Db4-note')).toBeInTheDocument()
    expect(screen.getByTestId('F4-note')).toBeInTheDocument()
    expect(screen.getByTestId('Ab4-note')).toBeInTheDocument()
    expect(screen.getByTestId('C5-note')).toBeInTheDocument()
  })

  it('should filter notes above or below the provided note limits', () => {
    const notes = ['C4', 'E4', 'G4'].map(toNote)
    const options: MeasureOptions = {
      upperNoteLimit: toNote('F4'),
      lowerNoteLimit: toNote('D4')
    }

    render(<Measure notes={notes} options={options}/>)

    expect(screen.queryByTestId('C4-note')).not.toBeInTheDocument()
    expect(screen.getByTestId('E4-note')).toBeInTheDocument()
    expect(screen.queryByTestId('G4-note')).not.toBeInTheDocument()
  })
})
