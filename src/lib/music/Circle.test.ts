import {circleKeys, diatonicChords, getKey, notesInKey, stepFrom} from "@/lib/music/Circle";
import {Note, toNote} from "@/lib/music/Note";
import {MAJOR_SCALE} from "@/lib/music/Scale";
import {Chord} from "@/lib/music/Chord";

describe('the circle of fifths', () => {
  it('should find notes that are n whole steps apart', () => {
    expect(stepFrom('A', 0)).toStrictEqual('A')
    expect(stepFrom('C', 7)).toStrictEqual('C')
    expect(stepFrom('C', 4)).toStrictEqual('G')
    expect(stepFrom('G', 8)).toStrictEqual('A')
    expect(stepFrom('F', 11)).toStrictEqual('C')
    expect(stepFrom('C', -7)).toStrictEqual('C')
    expect(stepFrom('C', -4)).toStrictEqual('F')
  })

  it('should make a key with one sharp', () => {
    expect(circleKeys(1)).toStrictEqual({
      root: Note.of('G'),
      scale: MAJOR_SCALE,
      notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'].map(Note.of)
    })
  })

  it('should make a key with many sharps', () => {
    expect(circleKeys(4)).toStrictEqual({
      root: Note.of('E'),
      scale: MAJOR_SCALE,
      notes: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'].map(Note.of)
    })
  })

  it('should make a key with all sharps', () => {
    expect(circleKeys(7)).toStrictEqual({
      root: Note.of('C#'),
      scale: MAJOR_SCALE,
      notes: ['C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#'].map(Note.of)
    })
  })

  it('should make a key with a flat', () => {
    expect(circleKeys(-1)).toStrictEqual({
      root: Note.of('F'),
      scale: MAJOR_SCALE,
      notes: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'].map(Note.of)
    })
  })

  it('should make a key with many flats', () => {
    expect(circleKeys(-4)).toStrictEqual({
      root: Note.of('Ab'),
      scale: MAJOR_SCALE,
      notes: ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'].map(Note.of)
    })
  })

  it('should make a key with all flats', () => {
    expect(circleKeys(-7)).toStrictEqual({
      root: Note.of('Cb'),
      scale: MAJOR_SCALE,
      notes: ['Cb', 'Db', 'Eb', 'Fb', 'Gb', 'Ab', 'Bb'].map(Note.of)
    })
  })

  it('should contain circle of fifth major keys', () => {
    const fMajor = getKey('F', 'Major')
    expect(fMajor).not.toBeUndefined()
    expect(fMajor?.root).toStrictEqual(Note.of('F'))
  })
})

describe('diatonic chords', () => {
  it('should get the diatonic chords for C major', () => {
    const chords = diatonicChords(getKey('C', 'Major'))
    expect(chords).toContainEqual(new Chord('C', 'Major'))
    expect(chords).toContainEqual(new Chord('B', 'Diminished'))
    expect(chords).toContainEqual(new Chord('E', 'Minor'))
    expect(chords).toContainEqual(new Chord('F', 'Major'))
  })

  it('should get the diatonic chords for F major', () => {
    const chords = diatonicChords(getKey('F', 'Major'))
    expect(chords).toContainEqual(new Chord('F', 'Major'))
    expect(chords).toContainEqual(new Chord('Bb', 'Major'))
    expect(chords).toContainEqual(new Chord('A', 'Minor'))
    expect(chords).toContainEqual(new Chord('C', 'Major'))
  })

  it('should get the diatonic chords for Cb major', () => {
    const chords = diatonicChords(getKey('Cb', 'Major'))
    expect(chords).toContainEqual(new Chord('Cb', 'Major'))
  })
})

describe('notes in key', () => {
  it('should format notes in key', () => {
    expect(notesInKey(['C#', 'F', 'G#'].map(toNote), getKey('Db', 'Major'))).toStrictEqual(['Db', 'F', 'Ab'].map(toNote))
    expect(notesInKey(['C#4', 'F4', 'G#4'].map(toNote), getKey('Db', 'Major'))).toStrictEqual(['Db4', 'F4', 'Ab4'].map(toNote))
    expect(notesInKey(['E3', 'G#3', 'B3'].map(toNote), getKey('Cb', 'Major'))).toStrictEqual(['Fb3', 'Ab3', 'Cb4'].map(toNote))
  })
})
