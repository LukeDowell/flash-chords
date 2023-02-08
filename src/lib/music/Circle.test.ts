import {circleKeys, diatonicChords, FChord, getKey, stepFrom} from "@/lib/music/Circle";
import {Note} from "@/lib/music/Note";
import {MAJOR_SCALE} from "@/lib/music/Scale";

describe('a chord', () => {
  it('should calculate its intervals', () => {
    expect(new FChord(Note.of('C'), "Major").intervals()).toStrictEqual([4, 3])
    expect(new FChord(Note.of('C'), "Minor").intervals()).toStrictEqual([3, 4])
    expect(new FChord(Note.of('C'), "Diminished").intervals()).toStrictEqual([3, 3])
    expect(new FChord(Note.of('C'), "Augmented").intervals()).toStrictEqual([4, 4])
  })

  it('should be parsed from a set of notes', () => {
    expect(FChord.fromNotes(['C', 'E', 'G'].map(Note.of))).toStrictEqual(new FChord(Note.of('C'), 'Major'))
    expect(FChord.fromNotes(['F', 'A', 'C'].map(Note.of))).toStrictEqual(new FChord(Note.of('F'), 'Major'))
    expect(FChord.fromNotes(['G', 'Bb', 'D'].map(Note.of))).toStrictEqual(new FChord(Note.of('G'), 'Minor'))
    expect(FChord.fromNotes(['Db', 'F', 'Ab'].map(Note.of))).toStrictEqual(new FChord(Note.of('Db'), 'Major'))
    expect(FChord.fromNotes(['B#', 'D#', 'F#'].map(Note.of))).toStrictEqual(new FChord(Note.of('B#'), 'Diminished'))
  })

  it('should know the notes that are required for a voicing, provided a key', () => {
    expect(new FChord(Note.of('Db'), 'Major').notesInKey(getKey('Db', 'Major'))).toStrictEqual(['Db', 'F', 'Ab'].map(Note.of))
    expect(new FChord(Note.of('F#'), 'Diminished').notesInKey(getKey('G', 'Major'))).toStrictEqual(['F#', 'A', 'C'].map(Note.of))
  })
})

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
    expect(chords).toContainEqual(new FChord(Note.of('C'), 'Major'))
    expect(chords).toContainEqual(new FChord(Note.of('B'), 'Diminished'))
    expect(chords).toContainEqual(new FChord(Note.of('E'), 'Minor'))
    expect(chords).toContainEqual(new FChord(Note.of('F'), 'Major'))
  })

  it('should get the diatonic chords for F major', () => {
    const chords = diatonicChords(getKey('F', 'Major'))
    expect(chords).toContainEqual(new FChord(Note.of('F'), 'Major'))
    expect(chords).toContainEqual(new FChord(Note.of('Bb'), 'Major'))
    expect(chords).toContainEqual(new FChord(Note.of('A'), 'Minor'))
    expect(chords).toContainEqual(new FChord(Note.of('C'), 'Major'))
  })

  it('should get the diatonic chords for Cb major', () => {
    const chords = diatonicChords(getKey('Cb', 'Major'))
    expect(chords).toContainEqual(new FChord(Note.of('Cb'), 'Major'))
  })
})
