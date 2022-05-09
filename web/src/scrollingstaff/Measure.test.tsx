import React from 'react'
import {render, screen} from "@testing-library/react";
import {toNote} from "../music/Note";
import {Measure} from "./Measure";


describe('a measure', () => {
  it.skip('should render notes', () => {
    const notes = ['C4', 'E4', 'G4'].map(toNote)

    render(<Measure notes={notes} />)

    expect(screen.getByTestId('c4-note')).toBeInTheDocument()
    expect(screen.getByTestId('e4-note')).toBeInTheDocument()
    expect(screen.getByTestId('g4-note')).toBeInTheDocument()
  })
})
