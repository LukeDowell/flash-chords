import {chordToSymbol} from "@/lib/music/ChordSymbol";
import {FChord} from "@/lib/music/Circle";
import {Note} from "@/lib/music/Note";

describe('chord symbol', () => {
  it('should render basic triads', () => {
    expect(chordToSymbol(new FChord(Note.of('C'), 'Major'))).toBe('C')
    expect(chordToSymbol(new FChord(Note.of('Ab'), 'Minor'))).toBe('Abm')
    expect(chordToSymbol(new FChord(Note.of('E#'), 'Major'))).toBe('E#')
    expect(chordToSymbol(new FChord(Note.of('B'), 'Diminished'))).toBe('Bdim')
    expect(chordToSymbol(new FChord(Note.of('F'), 'Augmented'))).toBe('Faug')
  })
})
