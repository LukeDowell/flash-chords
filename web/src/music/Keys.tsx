import {Chord, symbolToChord} from "./Chord";
import {Note, toNote} from "./Note";

export interface Key {
  notes: Note[],

  quality: "major" | "minor",

  /** Diatonic seventh chords for this key */
  diatonicChords: Chord[],
}

export const MAJOR_KEYS: Record<string, Key> = {
  'D♭': {
    notes: ['D♭', 'E♭', 'F', 'G♭', 'A♭', 'B♭', 'C'].map(toNote),
    quality: "major",
    diatonicChords: ['D♭maj7', 'E♭m7', 'Fm7', 'G♭maj7', 'A♭7', 'B♭m7', 'Cdim7'].map(symbolToChord)
  },

  'A♭': {
    notes: ['A♭'].map(toNote),
    quality: "major",
    diatonicChords: []
  },

  'E♭': {
    notes: ['E♭'].map(toNote),
    quality: "major",
    diatonicChords: []
  },

  'B♭': {
    notes: ['B♭'].map(toNote),
    quality: "major",
    diatonicChords: []
  },

  'F': {
    notes: ['F'].map(toNote),
    quality: "major",
    diatonicChords: []
  },

  'C': {
    notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(toNote),
    quality: "major",
    diatonicChords: ["Cmaj7", "Dm7", "Em7", "Fmaj7", "G7", "Am7", "B"].map(symbolToChord)
  },

  'G': {
    notes: ['G'].map(toNote),
    quality: "major",
    // diatonicChords: ["Gmaj7", "Am7", "Bm7", "Cmaj7", "D7", "Em7", "F#7(♭5)"].map(symbolToChord)
    diatonicChords: [].map(symbolToChord)
  },
}

export const MINOR_KEYS: Record<string, Key> = {
  'G': {
    notes: [toNote('G')],
    quality: 'minor',
    diatonicChords: MAJOR_KEYS['B♭'].diatonicChords
  }
}

export const transposeNotesToKey = (notes: Note[], key: Key): Note[] => {
  return notes
}
