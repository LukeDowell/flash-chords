import {Chord, symbolToChord} from "./Chord";
import {FLAT, Note, Root, SHARP, toNote} from "./Note";

export interface Key {
  notes: Note[],

  quality: "major" | "minor",

  /** Diatonic seventh chords for this key */
  diatonicChords: Chord[],
}

export const MAJOR_KEYS: Record<string, Key> = {
  'Cb': {
    notes: ['Cb', 'Db', 'Eb', 'Fb', 'Gb', 'Ab', 'Bb'].map(toNote),
    quality: "major",
    diatonicChords: [].map(symbolToChord)
  },

  'Gb': {
    notes: ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F'].map(toNote),
    quality: "major",
    diatonicChords: [].map(symbolToChord)
  },

  'Db': {
    notes: ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'].map(toNote),
    quality: "major",
    diatonicChords: ['Dbmaj7', 'Ebm7', 'Fm7', 'Gbmaj7', 'Ab7', 'Bbm7', 'Cm7b5'].map(symbolToChord)
  },

  'Ab': {
    notes: ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'].map(toNote),
    quality: "major",
    diatonicChords: []
  },

  'Eb': {
    notes: ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'].map(toNote),
    quality: "major",
    diatonicChords: []
  },

  'Bb': {
    notes: ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'].map(toNote),
    quality: "major",
    diatonicChords: []
  },

  'F': {
    notes: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'].map(toNote),
    quality: "major",
    diatonicChords: []
  },

  'C': {
    notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(toNote),
    quality: "major",
    diatonicChords: ["Cmaj7", "Dm7", "Em7", "Fmaj7", "G7", "Am7", "B"].map(symbolToChord)
  },

  'G': {
    notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'].map(toNote),
    quality: "major",
    diatonicChords: ["Gmaj7", "Am7", "Bm7", "Cmaj7", "D7", "Em7", "F#7b5"].map(symbolToChord)
  },

  'D': {
    notes: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'].map(toNote),
    quality: 'major',
    diatonicChords: [].map(symbolToChord)
  },

  'A': {
    notes: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'].map(toNote),
    quality: 'major',
    diatonicChords: [].map(symbolToChord)
  },

  'E': {
    notes: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'].map(toNote),
    quality: 'major',
    diatonicChords: [].map(symbolToChord)
  },

  'B': {
    notes: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'].map(toNote),
    quality: 'major',
    diatonicChords: [].map(symbolToChord)
  },

  'F#': {
    notes: ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'].map(toNote),
    quality: 'major',
    diatonicChords: [].map(symbolToChord)
  },

  'C#': {
    notes: ['C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#'].map(toNote),
    quality: 'major',
    diatonicChords: [].map(symbolToChord)
  }
}

export const MINOR_KEYS: Record<string, Key> = {
  'G': {
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
  else if (!note.accidental) throw new Error("natural is unimplemented")

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
