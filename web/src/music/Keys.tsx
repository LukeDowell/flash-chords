import {Chord, toChord} from "./Chord";
import {FLAT, Note, noteToSymbol, Root, SHARP, toNote} from "./Note";

export type KeyQuality = "Major" | "Natural Minor" | "Harmonic Minor" | "Melodic Minor"

export interface KeyInterface {
  name: string,

  notes: Note[],

  quality: KeyQuality,

  /** Diatonic seventh chords for this key */
  diatonicChords: Chord[],
}

export class Key implements KeyInterface {
  name: string;
  notes: Note[];
  quality: KeyQuality;
  diatonicChords: Chord[];

  constructor(notes: Note[], quality: KeyQuality) {
    this.name = `${noteToSymbol(notes[0])} ${quality}`
    this.notes = notes
    this.quality = quality
    this.diatonicChords = getDiatonicChords(notes, quality)
  }
}

/**
 * TODO
 * Something about this bugs me but I don't have enough of a grounding
 * in the theory yet to put my finger on why. I think I am tempted to
 * try and model this solution by using degrees, instead. For melodic
 * minor, I'd like to be able to say that it is the same as the major
 * scale except with a flat third, and then derive the chords from there
 */
const DIATONIC_QUALITIES: Record<KeyQuality, string[]> = {
  'Major': ['maj7', 'm7', 'm7', 'maj7', '7', 'm7', 'm7b5'],
  'Natural Minor': ['m7', 'm7b5', 'maj7', 'm7', 'm7', 'maj7', '7'],
  'Harmonic Minor': ['m7', 'm7b5', 'mM7', 'm7', '7', 'maj7', 'o7'],
  'Melodic Minor': ['mM7', 'm7', 'augM7', '7', '7', 'm7b5', 'm7b5'],
}

export const getDiatonicChords = (notes: Note[], quality: KeyQuality = "Major"): Chord[] => {
  if (notes.length !== 7) throw new Error('Provided note array must have length of 7')
  const noteSymbols = notes.map((n) => new Note(n.root, n.accidental, undefined)).map(noteToSymbol)
  const [first, second, third, fourth, fifth, sixth, seventh] = noteSymbols
  return [
    first.concat(DIATONIC_QUALITIES[quality][0]),
    second.concat(DIATONIC_QUALITIES[quality][1]),
    third.concat(DIATONIC_QUALITIES[quality][2]),
    fourth.concat(DIATONIC_QUALITIES[quality][3]),
    fifth.concat(DIATONIC_QUALITIES[quality][4]),
    sixth.concat(DIATONIC_QUALITIES[quality][5]),
    seventh.concat(DIATONIC_QUALITIES[quality][6]),
  ].map(toChord)
}

export const MAJOR_KEYS: Record<string, Key> = {
  'Cb': new Key(['Cb', 'Db', 'Eb', 'Fb', 'Gb', 'Ab', 'Bb'].map(toNote), "Major"),
  'Gb': new Key(['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F'].map(toNote), "Major"),
  'Db': new Key(['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'].map(toNote), "Major"),
  'Ab': new Key(['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'].map(toNote), "Major"),
  'Eb': new Key(['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'].map(toNote), "Major"),
  'Bb': new Key(['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'].map(toNote), "Major"),
  'F': new Key(['F', 'G', 'A', 'Bb', 'C', 'D', 'E'].map(toNote), "Major"),
  'C': new Key(['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(toNote), "Major"),
  'G': new Key(['G', 'A', 'B', 'C', 'D', 'E', 'F#'].map(toNote), "Major"),
  'D': new Key(['D', 'E', 'F#', 'G', 'A', 'B', 'C#'].map(toNote), "Major"),
  'A': new Key(['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'].map(toNote), "Major"),
  'E': new Key(['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'].map(toNote), "Major"),
  'B': new Key(['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'].map(toNote), "Major"),
  'F#': new Key(['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'].map(toNote), "Major"),
  'C#': new Key(['C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#'].map(toNote), "Major"),
}

export const MINOR_KEYS: Record<string, Key> = {
  'Eb': new Key(['Bb', 'Cb', 'Db', 'Eb', 'F', 'Gb', 'Ab'].map(toNote), "Natural Minor"),
  'Bb': new Key(['Bb', 'C', 'Db', 'Eb', 'F', 'Gb', 'Ab'].map(toNote), "Natural Minor"),
  'F': new Key(['F', 'G', 'Ab', 'Bb', 'C', 'Db', 'Eb'].map(toNote), "Natural Minor"),
  'C': new Key(['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'].map(toNote), "Natural Minor"),
  'G': new Key(['G', 'A', 'Bb', 'C', 'D', 'Eb', 'F'].map(toNote), "Natural Minor"),
  'D': new Key(['D', 'E', 'F', 'G', 'A', 'Bb', 'C'].map(toNote), "Natural Minor"),
  'A': new Key(['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(toNote), "Natural Minor"),
  'E': new Key(['E', 'F#', 'G', 'A', 'B', 'C', 'D'].map(toNote), "Natural Minor"),
  'B': new Key(['B', 'C#', 'D', 'E', 'F#', 'G', 'A'].map(toNote), "Natural Minor"),
  'F#': new Key(['F#', 'G#', 'A', 'B', 'C#', 'D', 'E'].map(toNote), "Natural Minor"),
  'C#': new Key(['C#', 'D#', 'E', 'F#', 'G#', 'A', 'B'].map(toNote), "Natural Minor"),
  'G#': new Key(['G#', 'A#', 'B', 'C#', 'D#', 'E', 'F#'].map(toNote), "Natural Minor"),
  'D#': new Key(['D#', 'E#', 'F#', 'G#', 'A#', 'B', 'C#'].map(toNote), "Natural Minor"),
}

/**
 * This function takes a series of notes and makes sure that they are rendered in a compatible
 * way for a given key.
 *
 * Ex. Dbmaj7 on a standardized keyboard would be C#, G, A#, and C which isn't great due to the C# and C.
 * Those notes passed in with the Db key would result in Db, G, Bb, C
 *
 * No transposition has taken place, the notes are simply formatted in a way that makes sense under a given
 * key
 */
const allRoots: Root[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
export const formatNoteInKey = (note: Note, key: Key): Note => {
  // Strip octave
  if (key.notes.some((n) => note.equalsWithoutOctave(n))) return note
  else if (!note.accidental) {
    const noteString = `${note?.root}${note?.accidental}`
    throw new Error(`natural is unimplemented - note: ${noteString} key: ${key.name}`)
  }

  // Root
  const rootIndex = allRoots.indexOf(note.root)
  let newIndex;
  if (rootIndex + note.accidental.mod <= 0) newIndex = allRoots.length - 1
  else if (rootIndex + note.accidental.mod >= allRoots.length) newIndex = 0
  else newIndex = rootIndex + note.accidental.mod

  const newRoot = allRoots[newIndex]

  // Octave
  let newOctave = note.octave
  if (note.octave && (note.root === 'C' || newRoot === 'C')) {
    if (note.root === 'C' && newRoot === 'B') newOctave = note.octave - 1
    else if (newRoot === 'C' && note.root === 'B') newOctave = note.octave + 1
  }

  // Accidental
  let newAccidental = note.accidental === FLAT ? SHARP : FLAT

  return new Note(newRoot, newAccidental, newOctave)
}

export const formatNotesInKey = (notes: Note[], key: Key): Note[] => {
  return notes.map((n) => formatNoteInKey(n, key))
}
