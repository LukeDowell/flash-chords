import React from 'react'
import {ScrollingStaff} from "./ScrollingStaff";
import {render, screen} from "@testing-library/react";
import {toNote} from "../music/Note";

describe('the staff component',  () => {
  it.skip('should render a note', () => {
    const notes = [
      ["C4", "E4", "G4"].map(toNote)
    ]

    render(<ScrollingStaff cleff={'treble'}/>)

    expect(screen.getByTestId('c4-note')).toBeInTheDocument()
    expect(screen.getByTestId('e4-note')).toBeInTheDocument()
    expect(screen.getByTestId('g4-note')).toBeInTheDocument()
  })
});
