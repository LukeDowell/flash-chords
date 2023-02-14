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
})
