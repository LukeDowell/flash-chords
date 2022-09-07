import {Chord, toChord} from "./Chord";
import {FLAT, Note, Root, SHARP, toNote} from "./Note";

export interface Key {
  name: string,

  notes: Note[],

  quality: "major" | "minor",

  /** Diatonic seventh chords for this key */
  diatonicChords: Chord[],
}

export const MAJOR_KEYS: Record<string, Key> = {
  'Cb': {
    name: 'Cb',
    notes: ['Cb', 'Db', 'Eb', 'Fb', 'Gb', 'Ab', 'Bb'].map(toNote),
    quality: "major",
    diatonicChords: [].map(toChord)
  },

  'Gb': {
    name: 'Gb',
    notes: ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F'].map(toNote),
    quality: "major",
    diatonicChords: [].map(toChord)
  },

  'Db': {
    name: 'Db',
    notes: ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'].map(toNote),
    quality: "major",
    diatonicChords: ['Dbmaj7', 'Ebm7', 'Fm7', 'Gbmaj7', 'Ab7', 'Bbm7', 'Cm7b5'].map(toChord)
  },

  'Ab': {
    name: 'Ab',
    notes: ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'].map(toNote),
    quality: "major",
    diatonicChords: []
  },

  'Eb': {
    name: 'Eb',
    notes: ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'].map(toNote),
    quality: "major",
    diatonicChords: []
  },

  'Bb': {
    name: 'Bb',
    notes: ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'].map(toNote),
    quality: "major",
    diatonicChords: ['Bbmaj7', 'Cm7', 'Dm7', 'F7', 'Gm7', 'Am7b5'].map(toChord)
  },

  'F': {
    name: 'F',
    notes: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'].map(toNote),
    quality: "major",
    diatonicChords: ['Fmaj7', 'Gm7', 'Am7', 'Bbmaj7', 'C7', 'Dm7', 'Em7b5'].map(toChord)
  },

  'C': {
    name: 'C',
    notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(toNote),
    quality: "major",
    diatonicChords: ["Cmaj7", "Dm7", "Em7", "Fmaj7", "G7", "Am7", "Bm7b5"].map(toChord)
  },

  'G': {
    name: 'G',
    notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'].map(toNote),
    quality: "major",
    diatonicChords: ["Gmaj7", "Am7", "Bm7", "Cmaj7", "D7", "Em7", "F#7b5"].map(toChord)
  },

  'D': {
    name: 'D',
    notes: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'].map(toNote),
    quality: 'major',
    diatonicChords: ['Dmaj7', 'Em7', 'F#m7', 'Gmaj7', 'A7', 'Bm7', 'C#7b5'].map(toChord)
  },

  'A': {
    name: 'A',
    notes: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'].map(toNote),
    quality: 'major',
    diatonicChords: [].map(toChord)
  },

  'E': {
    name: 'E',
    notes: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'].map(toNote),
    quality: 'major',
    diatonicChords: ['Emaj7', 'F#m7', 'G#m7', 'Amaj7', 'B7', 'C#m7', 'D#m7b5'].map(toChord)
  },

  'B': {
    name: 'B',
    notes: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'].map(toNote),
    quality: 'major',
    diatonicChords: [].map(toChord)
  },

  'F#': {
    name: 'F#',
    notes: ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'].map(toNote),
    quality: 'major',
    diatonicChords: [].map(toChord)
  },

  'C#': {
    name: 'C#',
    notes: ['C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#'].map(toNote),
    quality: 'major',
    diatonicChords: [].map(toChord)
  }
}

export const MINOR_KEYS: Record<string, Key> = {
  'G': {
    name: 'G',
    notes: [toNote('G')],
    quality: 'minor',
    diatonicChords: MAJOR_KEYS['Bb'].diatonicChords
  }
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
