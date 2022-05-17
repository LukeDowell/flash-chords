import {Chord, symbolToChord} from "./Chord";
import {Note, toNote} from "./Note";

export interface Key {
  root: Note,

  quality: "major" | "minor",

  /** Diatonic seventh chords for this key */
  diatonicChords: Chord[],
}

export const MAJOR_KEYS = {
  'D\u266d': {
    root: toNote('D\u266d'),
    quality: "major",
    diatonicChords: ['D\u266dmaj7',]
  },

  'A\u266d': {
    root: toNote('A\u266d'),
    quality: "major",
    diatonicChords: []
  },

  'E\u266d': {
    root: toNote('E\u266d'),
    quality: "major",
    diatonicChords: []
  },

  'B\u266d': {
    root: toNote('B\u266d'),
    quality: "major",
    diatonicChords: []
  },

  'F': {
    root: toNote('F'),
    quality: "major",
    diatonicChords: []
  },

  'C': {
    root: toNote("C"),
    quality: "major",
    diatonicChords: ["Cmaj7", "Dm7", "Em7", "Fmaj7", "G7", "Am7", "B"].map(symbolToChord)
  },

  'G': {
    root: toNote("G"),
    quality: "major",
    diatonicChords: ["Gmaj7", "Am7", "Bm7", "Cmaj7", "D7", "Em7", "F#7(\u266d5)"].map(symbolToChord)
  },
}

export const MINOR_KEYS = {
  'Gm': {
    root: toNote('Gm'),
    quality: 'minor',
    diatonicChords: MAJOR_KEYS['B\u266d']
  }
}
