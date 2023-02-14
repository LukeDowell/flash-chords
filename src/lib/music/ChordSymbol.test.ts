import {chordToSymbol} from "@/lib/music/ChordSymbol";
import {Chord} from "@/lib/music/Circle";

describe('chord symbol', () => {
  it('should render basic triads', () => {
    expect(chordToSymbol(new Chord('C', 'Major'))).toBe('C')
    expect(chordToSymbol(new Chord('Ab', 'Minor'))).toBe('Abm')
    expect(chordToSymbol(new Chord('E#', 'Major'))).toBe('E#')
    expect(chordToSymbol(new Chord('B', 'Diminished'))).toBe('Bdim')
    expect(chordToSymbol(new Chord('F', 'Augmented'))).toBe('Faug')
  })
})
