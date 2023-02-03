import _ from "lodash";

export type Root = "A" | "B" | "C" | "D" | "E" | "F" | "G"

export const ALL_ROOTS: Root[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

export interface NoteInterface {
  root: Root
  accidental?: Accidental,
  octave?: number,
}

export class Note implements NoteInterface {
  root: Root;
  accidental?: Accidental;
  octave?: number;

  constructor(root: Root, accidental?: Accidental, octave?: number) {
    this.root = root
    this.accidental = accidental
    this.octave = octave
  }

  static of(symbol: string): Note {
    return toNote(symbol)
  }

  isLowerThan(other: Note): boolean {
    return _.isEqual(lowerNote(this, other), this)
  }

  equalsWithoutOctave(other: Note): boolean {
    return _.isEqual({...other, octave: undefined}, {...this, octave: undefined})
  }

  isEquivalent(other: Note): boolean {
    return _.isEqual(standardizeNote(this), standardizeNote(other))
  }

  toString(): string {
    return `${this.root}${this.accidental?.symbol || ""}${this.octave || ""}`
  }
}

export type Accidental = {
  symbol: "#" | "##" | "b" | "bb" | "\u266E",

  /**
   * Semitone modifier. This is the amount of half steps
   * from the root note.
   */
  mod: 2 | 1 | 0 | -1 | -2
}

export const DOUBLE_SHARP: Accidental = {
  symbol: "##",
  mod: 2
}

export const SHARP: Accidental = {
  symbol: "#",
  mod: 1
}

export const DOUBLE_FLAT: Accidental = {
  symbol: "bb",
  mod: -2
}

export const FLAT: Accidental = {
  symbol: "b",
  mod: -1
}

export const NATURAL: Accidental = {
  symbol: "\u266E", // ♮
  mod: 0
}

export const getAccidental = (s: string): Accidental | undefined => {
  const accidentals = [NATURAL, SHARP, DOUBLE_SHARP, FLAT, DOUBLE_FLAT].filter(a => s.includes(a.symbol))
  if (accidentals.length > 2) throw new Error(`too many accidentals found for input ${s}`)
  else if (accidentals.includes(DOUBLE_FLAT) && accidentals.includes(FLAT)) return DOUBLE_FLAT
  else if (accidentals.includes(DOUBLE_SHARP) && accidentals.includes(SHARP)) return DOUBLE_SHARP
  else return accidentals.pop()
}

export const noteToSymbol = (n: Note) => `${n.root}${n?.accidental?.symbol || ""}${n.octave || ""}`

export const toNote = (s: string): Note => {
  if (!/^[A-G][#b\u266E]?[#b]?[0-9]?$/g.test(s)) throw new Error(`invalid note format ${s}`)

  const root = s.charAt(0) as Root
  if (s.length === 1) return new Note(root)

  const accidental = getAccidental(s)

  let octave: undefined | number
  if (/[0-9]/g.test(s)) octave = parseInt(s.charAt(s.length - 1))

  return new Note(root, accidental, octave)
}

// TODO below is probably wrong
export const notesFromLowestToHighest: Root[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

const lowerNote = (a: Note, b: Note) => {
  if (a.octave === undefined || b.octave === undefined) throw new Error("cannot compare notes without octaves")

  if (a.octave > b.octave) return b
  else if (b.octave > a.octave) return a
  else {
    let aValue = notesFromLowestToHighest.indexOf(a.root)
    let bValue = notesFromLowestToHighest.indexOf(b.root)
    if (aValue > bValue) return b
    else if (bValue > aValue) return a
    else {
      aValue = a?.accidental?.mod || 0
      bValue = b?.accidental?.mod || 0
      if (aValue > bValue) return b
      else if (bValue > aValue) return a
    }

    return a
  }
}

/** Lowest to highest */
export const sortNotes = (notes: Note[]): Note[] => notes.sort((a, b) => {
  if (a.isLowerThan(b)) return -1;
  return 1
})

/**
 * Standardize all notes onto the same notation that the keyboard uses
 * @param n
 */
export const standardizeNote = (n: Note): Note => {
  if (n.accidental) {
    const tempNote = new Note(n.root, undefined, 4)
    const tempIndex = KEYBOARD.findIndex(kn => _.isEqual(kn, tempNote))
    const newNote = KEYBOARD[tempIndex + n.accidental.mod]
    return new Note(newNote.root, newNote.accidental, n.octave ? newNote.octave : undefined)
  } else return n
}

/**
 * A physical representation of a keyboard
 */
export const KEYBOARD: Note[] = [
  "A0", "A#0", "B0", // 2
  "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1", "A1", "A#1", "B1", // 14
  "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", // 26
  "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", // 38
  "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
  "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5",
  "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6", "A6", "A#6", "B6",
  "C7", "C#7", "D7", "D#7", "E7", "F7", "F#7", "G7", "G#7", "A7", "A#7", "B7",
  "C8",
].map(toNote)

export const findNoteOnKeyboard = (note: Note): number => {
  const n = standardizeNote(note)
  return KEYBOARD.findIndex((k) => note.octave ? n.isEquivalent(k) : n.equalsWithoutOctave(k))
}

export const genericInterval = (n1a: Note, n2a: Note): number => {
  if (n1a?.octave === undefined || n2a?.octave === undefined) throw new Error('cannot calculate generic interval without octave information')

  const n1 = new Note(n1a.root, undefined, n1a.octave)
  const n2 = new Note(n2a.root, undefined, n2a.octave)

  if (_.isEqual(n1, n2)) return 1

  const i1 = KEYBOARD.findIndex((n) => _.isEqual(standardizeNote(n1), n))
  const i2 = KEYBOARD.findIndex((n) => _.isEqual(standardizeNote(n2), n))

  const genericKeys = (i1 < i2 ? KEYBOARD.slice(i1, i2 + 1) : KEYBOARD.slice(i2, i1 + 1)).filter((n) => !n.accidental)
  return genericKeys.length
}

export const placeOnOctave = (octave: number, notes: Note[]): Note[] => {
  let currentOctave = octave;

  return notes.map((n, i, self) => {
    if (i !== 0) {
      const tempNote = new Note(n.root, n.accidental, currentOctave)
      if (tempNote.isLowerThan(self [i - 1])) currentOctave++
    }
    n.octave = currentOctave
    return n
  })
}
