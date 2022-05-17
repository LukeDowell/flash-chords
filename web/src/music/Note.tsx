import _ from "lodash";

export type Root = "A" | "B" | "C" | "D" | "E" | "F" | "G"

export interface Note {
  root: Root
  accidental?: Accidental,
  octave?: number
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

  const root = s.charAt(0)
  if (s.length === 1) return {root, octave: undefined, accidental: undefined} as Note

  let accidental: undefined | Accidental
  if (hasAccidental(s)) {
    const a = s.charAt(1)
    if (a === "♭") accidental = {symbol: "♭", mod: -1}
    else accidental = {symbol: "#", mod: 1}
  }

  let octave: undefined | number
  if (/[0-9]/g.test(s) && !accidental) octave = parseInt(s.charAt(1))
  else if (/[0-9]/g.test(s) && accidental) octave = parseInt(s.charAt(2))

  return {root, accidental: accidental, octave: octave} as Note
}

export const lowerNote = (a: Note, b: Note) => {
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
    const newRoot = n.root === "A" ? String.fromCharCode(71) : String.fromCharCode(n.root.charCodeAt(0) - 1)
    const newOctave = n.root === "C" && n.octave ? n.octave - 1 : n.octave
    let newAccidental = undefined;
    if (newRoot !== "E" && newRoot !== "B") newAccidental = SHARP
    return {
      ...n,
      octave: newOctave,
      root: newRoot,
      accidental: newAccidental,
    } as Note
  } else if (_.isEqual(n.accidental, SHARP) && (n.root === "B" || n.root === "E")) {
    const newRoot = String.fromCharCode(n.root.charCodeAt(0) + 1)
    const newOctave = newRoot === "C" && n.octave ? n.octave + 1 : n.octave // Increment if we go from B to C
    return {
      ...n,
      root: newRoot,
      octave: newOctave,
      accidental: undefined,
    } as Note
  } else return n
}
