import _ from "lodash";

export type Root = "A" | "B" | "C" | "D" | "E" | "F" | "G"

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

  isLowerThan(other: Note): boolean {
    return _.isEqual(lowerNote(this, other), this)
  }
}

export type Accidental = {
  symbol: "#" | "♭",

  /**
   * Semitone modifier. This is the amount of half steps
   * from the base note.
   */
  mod: 1 | -1
}

export const SHARP: Accidental = {
  symbol: "#",
  mod: 1
}

export const FLAT: Accidental = {
  symbol: "♭",
  mod: -1
}

export const hasAccidental = (s: string): boolean => s.includes("#") || s.includes("♭")

export const noteToSymbol = (n: Note) => `${n.root}${n?.accidental?.symbol || ""}${n.octave || ""}`

export const toNote = (s: string): Note => {
  const validNote = /^[a-gA-G][#♭]?[0-8]?$/g
  if (!validNote.test(s)) throw new Error(`invalid note format ${s}`)

  const root = s.charAt(0) as Root
  if (s.length === 1) return new Note(root)

  let accidental: undefined | Accidental
  if (hasAccidental(s)) {
    const a = s.charAt(1)
    if (a === "♭") accidental = {symbol: "♭", mod: -1}
    else accidental = {symbol: "#", mod: 1}
  }

  let octave: undefined | number
  if (/[0-9]/g.test(s) && !accidental) octave = parseInt(s.charAt(1))
  else if (/[0-9]/g.test(s) && accidental) octave = parseInt(s.charAt(2))

  return new Note(root, accidental, octave)
}

const lowerNote = (a: Note, b: Note) => {
  if (a.octave === undefined || b.octave === undefined) throw new Error("cannot compare notes without octaves")

  if (a.octave > b.octave) return b
  else if (b.octave > a.octave) return a
  else {
    const aValue = a.root.charCodeAt(0) + (a.accidental?.mod || 0)
    const bValue = b.root.charCodeAt(0) + (b.accidental?.mod || 0)
    if (aValue > bValue) return b
    else return a
  }
}

export const sortNotes = (notes: Note[]): Note[] => notes.sort((a, b) => {
  if (lowerNote(a, b) === a) return -1;

  return 1
})

export const notesToString = (notes: Note[]): string => notes.map((n) => {
  return `${n.root}${n.accidental?.symbol || ""}${n?.octave || ""}`
}).join(", ")

/**
 * Standardize all notes onto the same notation that the keyboard uses
 * @param n
 */
export const standardizeNote = (n: Note): Note => {
  if (_.isEqual(n.accidental, FLAT)) {
    const newRoot = n.root === "A" ?
      String.fromCharCode(71) as Root :
      String.fromCharCode(n.root.charCodeAt(0) - 1) as Root
    const newOctave = n.root === "C" && n.octave ? n.octave - 1 : n.octave
    let newAccidental = undefined;
    if (newRoot !== "E" && newRoot !== "B") newAccidental = SHARP
    return new Note(newRoot, newAccidental, newOctave)
  } else if (_.isEqual(n.accidental, SHARP) && (n.root === "B" || n.root === "E")) {
    const newRoot = String.fromCharCode(n.root.charCodeAt(0) + 1) as Root
    const newOctave = newRoot === "C" && n.octave ? n.octave + 1 : n.octave // Increment if we go from B to C
    return new Note(newRoot, undefined, newOctave)
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

export const genericInterval = (n1a: Note, n2a: Note): number => {
  if (!n1a.octave || !n2a.octave) throw new Error('cannot calculate generic interval without octave information')

  const n1 = new Note(n1a.root, undefined, n1a.octave)
  const n2 = new Note(n2a.root, undefined, n2a.octave)

  if (_.isEqual(n1, n2)) return 1

  const i1 = KEYBOARD.findIndex((n) => _.isEqual(standardizeNote(n1), n))
  const i2 = KEYBOARD.findIndex((n) => _.isEqual(standardizeNote(n2), n))


  const genericKeys = (i1 < i2 ? KEYBOARD.slice(i1, i2 + 1) : KEYBOARD.slice(i2, i1 + 1)).filter((n) => !n.accidental)
  return genericKeys.length
}
