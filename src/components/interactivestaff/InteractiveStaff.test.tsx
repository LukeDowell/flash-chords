import React from 'react'
import {InteractiveStaff} from "@/components/interactivestaff/InteractiveStaff";
import {render, screen, waitFor} from "@testing-library/react";
import {Chord} from "@/lib/music/Circle";

describe('an interactive staff', () => {
  it('should render', () => {
    render(<InteractiveStaff/>)
  })

  it('should render chord symbols', async () => {
    const chords = [
      new Chord('C', 'Major'),
      new Chord('D', 'Minor'),
      new Chord('G', 'Major'),
      new Chord('C', 'Major'),
    ]

    render(<InteractiveStaff chords={chords}/>)

    await waitFor(() => {
      expect(screen.getByText(/Dm/)).toBeInTheDocument()
      expect(screen.getByText(/G/)).toBeInTheDocument()
      expect(screen.getAllByText(/C/).length).toBe(2)
    })
  })
})
