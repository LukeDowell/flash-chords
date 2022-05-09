import {Chord, symbolToChord} from "./Chord";
import {Note, toNote} from "./Note";

export interface Key {
  root: Note,

  quality: "major" | "minor",

  /** Diatonic chords for this key, with */
  diatonicChords: Chord[],
}

export const MAJOR_KEYS = {
  'C': {
    root: toNote("C"),
    quality: "major",
    diatonicChords: ["Cmaj7", "Dm7", "Em7", "Fmaj7", "G7", "Am7", "B"].map(symbolToChord)
  },

  'F': {
    root: toNote('F'),
    quality: "major",
    diatonicChords: []
  },

  'B\u266d': {
    root: toNote('B\u266d'),
    quality: "major",
    diatonicChords: []
  },

  'G': {
    root: toNote("G"),
    quality: "major",
    // diatonicChords: ["Gmaj7", "Am7", "Bm7", "Cmaj7", "D7", "Em7", "F#7(\u266d5)"].map(symbolToChord)
    diatonicChords: [].map(symbolToChord) // TODO support for flat 5s
  },
}

export const MINOR_KEYS = {
  'Gm': {
    root: toNote('Gm'),
    quality: 'minor',
    diatonicChords: MAJOR_KEYS['B\u266d']
  }
}
