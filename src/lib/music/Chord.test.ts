import {Chord} from "@/lib/music/Chord";
import {Note} from "@/lib/music/Note";
import {getKey, notesInKey} from "@/lib/music/Circle";

describe('a chord', () => {
  it('should calculate its intervals', () => {
    expect(new Chord('C', "Major").intervals()).toStrictEqual([4, 3])
    expect(new Chord('C', "Minor").intervals()).toStrictEqual([3, 4])
    expect(new Chord('C', "Diminished").intervals()).toStrictEqual([3, 3])
    expect(new Chord('C', "Augmented").intervals()).toStrictEqual([4, 4])
  })

  it('should be parsed from a set of notes', () => {
    expect(Chord.fromNotes(['C', 'E', 'G'].map(Note.of))).toStrictEqual(new Chord('C', 'Major'))
    expect(Chord.fromNotes(['F', 'A', 'C'].map(Note.of))).toStrictEqual(new Chord('F', 'Major'))
    expect(Chord.fromNotes(['G', 'Bb', 'D'].map(Note.of))).toStrictEqual(new Chord('G', 'Minor'))
    expect(Chord.fromNotes(['Db', 'F', 'Ab'].map(Note.of))).toStrictEqual(new Chord('Db', 'Major'))
    expect(Chord.fromNotes(['B#', 'D#', 'F#'].map(Note.of))).toStrictEqual(new Chord('B#', 'Diminished'))
  })

  it('should be parsed from a set of notes including a seventh', () => {
    expect(Chord.fromNotes(['C', 'E', 'G', 'B'].map(Note.of))).toStrictEqual(new Chord('C', 'Major', 'Major'))
    expect(Chord.fromNotes(['G', 'B', 'D', 'F'].map(Note.of))).toStrictEqual(new Chord('G', 'Major', 'Minor'))
    expect(Chord.fromNotes(['D', 'F', 'A', 'C'].map(Note.of))).toStrictEqual(new Chord('D', 'Minor', 'Minor'))
    expect(Chord.fromNotes(['B', 'D', 'F', 'A'].map(Note.of))).toStrictEqual(new Chord('B', 'Diminished', 'Half-Diminished'))
  })

  it('should reject notes that do not stack in thirds', () => {
    expect(() => Chord.fromNotes(['C', 'F#', 'B'].map(Note.of))).toThrow()
    expect(() => Chord.fromNotes(['C', 'D', 'E'].map(Note.of))).toThrow()
  })

  it('should be parsed from a chord symbol', () => {
    expect(Chord.fromSymbol('C')).toStrictEqual(new Chord('C', 'Major'))
    expect(Chord.fromSymbol('Abm')).toStrictEqual(new Chord('Ab', 'Minor'))
    expect(Chord.fromSymbol('F#dim')).toStrictEqual(new Chord('F#', 'Diminished'))
    expect(Chord.fromSymbol('Eaug')).toStrictEqual(new Chord('E', 'Augmented'))
    expect(Chord.fromSymbol('Cmaj7')).toStrictEqual(new Chord('C', 'Major', 'Major'))
    expect(Chord.fromSymbol('G7')).toStrictEqual(new Chord('G', 'Major', 'Minor'))
    expect(Chord.fromSymbol('Dm7')).toStrictEqual(new Chord('D', 'Minor', 'Minor'))
    expect(Chord.fromSymbol('Dm(maj7)')).toStrictEqual(new Chord('D', 'Minor', 'Major'))
    expect(Chord.fromSymbol('Bø7')).toStrictEqual(new Chord('B', 'Diminished', 'Half-Diminished'))
    expect(Chord.fromSymbol('B°7')).toStrictEqual(new Chord('B', 'Diminished', 'Fully-Diminished'))
  })

  it('should round trip between symbol and chord', () => {
    const symbols = ['C', 'Abm', 'F#dim', 'Eaug', 'Cmaj7', 'G7', 'Dm7', 'Bø7', 'B°7']
    symbols.forEach(s => expect(Chord.fromSymbol(s).toString()).toBe(s))
  })

  it('should reject an unparseable chord symbol', () => {
    expect(() => Chord.fromSymbol('H7')).toThrow()
    expect(() => Chord.fromSymbol('Cwat')).toThrow()
    expect(() => Chord.fromSymbol('')).toThrow()
  })

  it('should know the notes that are required for a voicing, provided a key', () => {
    expect(notesInKey(new Chord('Db', 'Major').notes(), getKey('Db', 'Major'))).toStrictEqual(['Db', 'F', 'Ab'].map(Note.of))
    expect(notesInKey(new Chord('F#', 'Diminished').notes(), getKey('G', 'Major'))).toStrictEqual(['F#', 'A', 'C'].map(Note.of))
  })

  it('should render basic triads', () => {
    expect(new Chord('C', 'Major').toString()).toBe('C')
    expect(new Chord('Ab', 'Minor').toString()).toBe('Abm')
    expect(new Chord('E#', 'Major').toString()).toBe('E#')
    expect(new Chord('B', 'Diminished').toString()).toBe('Bdim')
    expect(new Chord('F', 'Augmented').toString()).toBe('Faug')
  })

  it('should render seventh chords', () => {
    expect(new Chord('C', 'Major', 'Major').toString()).toBe('Cmaj7')
    expect(new Chord('G', 'Major', 'Minor').toString()).toBe('G7')
    expect(new Chord('D', 'Minor', 'Minor').toString()).toBe('Dm7')
    expect(new Chord('D', 'Minor', 'Major').toString()).toBe('Dm(maj7)')
    expect(new Chord('B', 'Diminished', 'Half-Diminished').toString()).toBe('Bø7')
    expect(new Chord('B', 'Diminished', 'Fully-Diminished').toString()).toBe('B°7')
  })
})
