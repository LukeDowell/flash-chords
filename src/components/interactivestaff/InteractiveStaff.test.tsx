import React from 'react'
import {InteractiveStaff} from "@/components/interactivestaff/InteractiveStaff";
import {render} from "@testing-library/react";
import MIDIPiano from "@/lib/music/MIDIPiano";

describe('an interactive staff', () => {
  it('should render', () => {
    render(<InteractiveStaff midiPiano={{} as MIDIPiano}/>)
  })

  // it('should render chord symbols', () => {
  //   render(<InteractiveStaff midiPiano={{} as MIDIPiano} />)
  //
  //   expect(screen.findByText(/Dm/)).toBeInTheDocument()
  //   expect(screen.findByText(/G/)).toBeInTheDocument()
  //   expect(screen.findByText(/C/)).toBeInTheDocument()
  // })
})
