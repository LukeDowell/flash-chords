import {chordToSymbol} from "@/lib/music/ChordSymbol";
import {FChord} from "@/lib/music/Circle";

describe('chord symbol', () => {
  it('should render basic triads', () => {
    expect(chordToSymbol(new FChord('C', 'Major'))).toBe('C')
    expect(chordToSymbol(new FChord('Ab', 'Minor'))).toBe('Abm')
    expect(chordToSymbol(new FChord('E#', 'Major'))).toBe('E#')
    expect(chordToSymbol(new FChord('B', 'Diminished'))).toBe('Bdim')
    expect(chordToSymbol(new FChord('F', 'Augmented'))).toBe('Faug')
  })
})
