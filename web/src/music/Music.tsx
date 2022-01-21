import {isDeepStrictEqual} from "util";

export type Root = "A" | "B" | "C" | "D" | "E" | "F" | "G"

export interface Note {
  root: Root
  accidental?: Accidental,
  octave?: number
}

export const hasAccidental = (s: string): boolean => s.includes("#") || s.includes("\u266D")

export const noteToSymbol = (n: Note) => `${n.root}${n?.accidental?.symbol}${n.octave || ""}`
export const toNote = (s: string): Note => {
  const root = s.charAt(0)
  if (s.length === 1) return {root} as Note

  let accidental: undefined | Accidental
  if (hasAccidental(s)) {
    const a = s.charAt(1)
    if (a === "\u266d") accidental = { symbol: "\u266d", mod: -1 }
    else accidental = { symbol: "#", mod: 1 }
  }

  let octave: undefined | number
  if (/[0-9]/g.test(s) && !accidental) octave = parseInt(s.charAt(1))
  else if (/[0-9]/g.test(s) && accidental) octave = parseInt(s.charAt(2))

  return { root, accidental, octave } as Note
}

/**
 * A physical representation of a keyboard. Notes are all sharped for consistency.
 */
export const KEYBOARD: Note[] = [
  "A0", "A#0", "B0",
  "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1", "A1", "A#1", "B1",
  "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2",
  "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3",
  "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
  "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5",
  "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6", "A6", "A#6", "B6",
  "C7", "C#7", "D7", "D#7", "E7", "F7", "F#7", "G7", "G#7", "A7", "A#7", "B7",
  "C8",
].map(toNote)

export type Accidental = {
  symbol: "#" | "\u266d",

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
  symbol: "\u266d",
  mod: -1
}

export type ChordQuality = "Major" | "Minor" | "Augmented" | "Diminished"

export interface Chord {
  root: Root
  quality: ChordQuality
  accidental?: Accidental
  seventh?: "Major" | "Minor"
  bassNote?: Note
}

export const toChordSymbol = (c: Chord, withOctave: boolean = false) => {
  let quality = "";
  switch (c.quality) {
    case "Diminished":
      quality = "dim"
      break;
    case "Minor":
      quality = "m"
      break;
    case "Augmented":
      quality = "aug"
      break;
  }

  let addedNotes = ""
  switch (c.seventh) {
    case "Major":
      break;
    case "Minor":
      break;
  }

  return `${c.root}${quality}${addedNotes}`
}

export const generateRandomChord = (): Chord => {
  const roots = ["A", "B", "C", "D", "E", "F", "G"] as Root[]
  const qualities = ["Major", "Minor", "Augmented", "Diminished"] as ChordQuality[]
  const accidentals = [FLAT, SHARP, undefined] as Accidental[]
  const addedThirds = ["Major", "Minor", undefined]
  return {
    root: roots[Math.floor(Math.random() * roots.length)],
    quality: qualities[Math.floor(Math.random() * qualities.length)],
    accidental: accidentals[Math.floor(Math.random() * accidentals.length)],
    addedThird: addedThirds[Math.floor(Math.random() * addedThirds.length)],
  } as Chord
}

export const symbolToChord = (symbol: string): Chord | undefined => {
  const validExpressions = [
    // Triad
    /^[a-gA-G][#\u266D]?(?:dim|m|aug)?$/g,

    // Seventh TODO unicode characters for delta (major major) and the weird o?
    /^[a-gA-G][#\u266D]?(?:dim|m|aug|maj)?7$/g,
  ]

  if (!validExpressions.find((e) => e.test(symbol))) return

  return undefined
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

export const isValidVoicing = (chord: Chord, activeNotes: Array<Note>): boolean => {
  if (activeNotes.length < 3) return false
  if (chord.seventh && activeNotes.length < 4) return false

  const semitones = Array<number>()
  switch (chord.quality) {
    case "Diminished":
      semitones.push(3, 3)
      break;
    case "Minor":
      semitones.push(3, 4)
      break;
    case "Major":
      semitones.push(4, 3)
      break;
    case "Augmented":
      semitones.push(4, 4)
      break;
  }

  switch (chord.seventh) {
    case "Major":
      semitones.push(4)
      break
    case "Minor":
      semitones.push(3)
      break
  }

  const sortedActiveNotes = sortNotes(activeNotes);
  const rootNotes = activeNotes.filter((n) => n.root === chord.root && n.accidental === chord.accidental)

  if (rootNotes.length === 0) return false

  const lowestRootNote: Note = rootNotes.length > 1 ? activeNotes[0] : rootNotes.reduce(lowerNote)
  const nonRootActiveNotes = sortedActiveNotes
    .filter((n) => !rootNotes.some((r) => r.root === n.root && r.accidental === n.accidental))
  const uniqueNonRootActiveNotes = Array.from(new Set(nonRootActiveNotes))
  const transposedActiveNotes: Note[] = [lowestRootNote]
  const rootNoteKeyIndex = KEYBOARD.findIndex((k) => isDeepStrictEqual(k, lowestRootNote))
  const notesAboveRoot: Note[] = KEYBOARD.slice(rootNoteKeyIndex, KEYBOARD.length)

  uniqueNonRootActiveNotes.forEach((active) => {
    const closestNoteToRoot = notesAboveRoot.find((n) => {
      return n.root === active.root && isDeepStrictEqual(n.accidental, active.accidental)
    })
    transposedActiveNotes.push(closestNoteToRoot!!)
  })

  const requiredNotes: Note[] = [lowestRootNote]

  semitones.forEach((s) => {
    const nextThirdIndex = KEYBOARD.findIndex((k) => isDeepStrictEqual(k, requiredNotes[requiredNotes.length - 1])) + s
    requiredNotes.push(KEYBOARD[nextThirdIndex])
  })

  return requiredNotes.every((n) => transposedActiveNotes.some((an) => isDeepStrictEqual(n, an)))
}
