import {Chord, symbolToChord} from "./Chord";
import {FLAT, Note, Root, SHARP, toNote} from "./Note";
import _ from "lodash";

export interface Key {
  notes: Note[],

  quality: "major" | "minor",

  /** Diatonic seventh chords for this key */
  diatonicChords: Chord[],
}

export const MAJOR_KEYS: Record<string, Key> = {
  'C♭': {
    notes: ['C♭', 'D♭', 'E♭', 'F♭', 'G♭', 'A♭', 'B♭'].map(toNote),
    quality: "major",
    diatonicChords: ['D♭maj7', 'E♭m7', 'Fm7', 'G♭maj7', 'A♭7', 'B♭m7', 'Cdim7'].map(symbolToChord)
  },

  'G♭': {
    notes: ['G♭', 'A♭', 'B♭', 'C♭', 'D♭', 'E♭', 'F'].map(toNote),
    quality: "major",
    diatonicChords: ['D♭maj7', 'E♭m7', 'Fm7', 'G♭maj7', 'A♭7', 'B♭m7', 'Cdim7'].map(symbolToChord)
  },

  'D♭': {
    notes: ['D♭', 'E♭', 'F', 'G♭', 'A♭', 'B♭', 'C'].map(toNote),
    quality: "major",
    diatonicChords: ['D♭maj7', 'E♭m7', 'Fm7', 'G♭maj7', 'A♭7', 'B♭m7', 'Cdim7'].map(symbolToChord)
  },

  'A♭': {
    notes: ['A♭', 'B♭', 'C', 'D♭', 'E♭', 'F', 'G'].map(toNote),
    quality: "major",
    diatonicChords: []
  },

  'E♭': {
    notes: ['E♭', 'F', 'G', 'A♭', 'B♭', 'C', 'D'].map(toNote),
    quality: "major",
    diatonicChords: []
  },

  'B♭': {
    notes: ['B♭', 'C', 'D', 'E♭', 'F', 'G', 'A'].map(toNote),
    quality: "major",
    diatonicChords: []
  },

  'F': {
    notes: ['F', 'G', 'A', 'B♭', 'C', 'D', 'E'].map(toNote),
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
    // diatonicChords: ["Gmaj7", "Am7", "Bm7", "Cmaj7", "D7", "Em7", "F#7(♭5)"].map(symbolToChord)
    diatonicChords: [].map(symbolToChord)
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
    diatonicChords: MAJOR_KEYS['B♭'].diatonicChords
  }
}

/**
 * This function takes a series of notes and makes sure that they are rendered in a compatible
 * way for a given key.
 *
 * Ex. D♭maj7 on a standardized keyboard would be C#, G, A#, and C which isn't great due to the C# and C.
 * Those notes passed in with the D♭ key would result in D♭, G, B♭, C
 *
 * No transposition has taken place, the notes are simply formatted in a way that makes sense under a given
 * key
 */
const allRoots: Root[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
export const formatNotesInKey = (notes: Note[], key: Key): Note[] => {
  return notes.map((n) => {
    if (key.notes.some((note) => _.isEqual(note, n))) return n
    else if (!n.accidental) {
      throw new Error("ahhhhhh maybe we need to implement natural?")
    }

    // Root
    const rootIndex = allRoots.indexOf(n.root)
    let newIndex;
    if (rootIndex + n.accidental.mod <= 0) newIndex = allRoots.length - 1
    else if (rootIndex + n.accidental.mod >= allRoots.length) newIndex = 0
    else newIndex = rootIndex + n.accidental.mod

    const newRoot = allRoots[newIndex]

    // Octave
    let newOctave = n.octave
    if (n.octave && (n.root === 'C' || newRoot === 'C')) {
      if (n.root === 'C' && newRoot === 'B') newOctave = n.octave - 1
      else if (newRoot === 'C' && n.root === 'B') newOctave = n.octave + 1
    }

    // Accidental
    let newAccidental = n.accidental === FLAT ? SHARP : FLAT

    return {
      ...n,
      root: newRoot,
      octave: newOctave,
      accidental: newAccidental
    } as Note
  })
}
