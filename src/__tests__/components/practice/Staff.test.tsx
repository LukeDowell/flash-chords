import React from 'react'
import {render} from "@testing-library/react";
import {Staff} from "@/components/practice/Staff";
import {toChord} from "@/lib/music/Chord";

describe('the musical staff', () => {
  it('should be able to render a Dbmaj7 chord', () => {
    render(<Staff chord={toChord('Dbmaj7')} />)
  })
})
