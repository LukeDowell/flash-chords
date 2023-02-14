import {Accidental, FLAT, getAccidental, KEYBOARD, Note, Root, SHARP, standardizeNote} from "./Note";
import _ from "lodash";

export type ChordQuality = "Major" | "Minor" | "Augmented" | "Diminished"
export type SeventhQuality = "Major" | "Minor" | "Half-Diminished" | "Fully-Diminished"

/**
 * @deprecated
 */
export interface Chord {
  root: Root
  quality: ChordQuality
  accidental?: Accidental
  seventh?: SeventhQuality
  bassNote?: Note
}

export const generateRandomChord = (
  roots = ["A", "B", "C", "D", "E", "F", "G"] as Root[],
  qualities = ["Major", "Minor", "Augmented", "Diminished"] as ChordQuality[],
  accidentals = [FLAT, SHARP, undefined] as Accidental[],
  addedThirds = ["Major", "Minor", undefined]
): Chord => {
  const root = roots[Math.floor(Math.random() * roots.length)]
  const quality = qualities[Math.floor(Math.random() * qualities.length)]
  const accidental = accidentals[Math.floor(Math.random() * accidentals.length)]
  let seventh = undefined
  if (quality !== "Augmented") {
    seventh = addedThirds[Math.floor(Math.random() * addedThirds.length)]
  }

  return {root, quality, accidental, seventh} as Chord
}

export const toSymbol = (c: Chord) => {
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

  let seventh = ""
  switch (c.seventh) {
    case "Major":
      if (c.quality === "Diminished") {
        seventh = "\u00f87"
        quality = ""
      } // ø
      else if (c.quality !== "Minor") seventh = "M7"
      else seventh = "7"
      break;
    case "Minor":
      if (c.quality === "Diminished") {
        seventh = "o7"
        quality = ""
      } else seventh = "7"
      break;
  }

  return `${c.root}${c.accidental?.symbol || ""}${quality}${seventh}`
}

export const toChord = (symbol: string): Chord => {
  const validExpressions = [
    // Triad
    /^[A-G][#b]?[#b\u266E]?(?:dim|m|aug)?$/g,

    // Seventh
    /^[A-G][#b]?[#b\u266E]?(?:mM?|(aug)?M|o|\u00f8|maj|dim)?7(b5)?$/g,
  ]

  if (!validExpressions.find((e) => e.test(symbol))) throw new Error(`invalid chord symbol format ${symbol}`)

  const root = symbol.charAt(0) as Root
  let rootAccidental = getAccidental(symbol.replace('b5', '')) // remove half diminished to avoid confusion with the 'b'

  // Seventh
  let seventh: "Major" | "Minor" | undefined
  let quality: ChordQuality
  if (symbol.includes('7')) {
    if (symbol.includes("maj")) {
      quality = "Major"
      seventh = "Major"
    } else if (symbol.includes('m7b5')) {
      quality = "Diminished"
      seventh = "Major"
    } else if (symbol.includes('mM7')) {
      quality = "Minor"
      seventh = "Major"
    } else if (symbol.includes("augM")) {
      quality = "Augmented"
      seventh = "Minor"
    } else if (symbol.includes("M7")) {
      quality = "Major"
      seventh = "Major"
    } else if (symbol.includes("o")) {
      quality = "Diminished"
      seventh = "Minor"
    } else if (symbol.includes("m")) {
      quality = "Minor"
      seventh = "Minor"
    } else {
      quality = "Major"
      seventh = "Minor"
    }
  } else if (symbol.includes("dim")) {
    quality = "Diminished"
  } else if (symbol.includes("m")) {
    quality = "Minor"
  } else if (symbol.includes("aug")) {
    quality = "Augmented"
  } else {
    quality = "Major"
  }

  // We want quality = diminished and the seventh = major
  return {root, quality, accidental: rootAccidental, seventh}
}

/**
 * Returns the standardized required notes for a chord (all sharps)
 */
export const requiredNotesForChord = (c: Chord): Note[] => {
  const semitones: number[] = []
  switch (c.quality) {
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

  switch (c.seventh) {
    case "Major":
      semitones.push(4)
      break
    case "Minor":
      semitones.push(3)
      break
  }

  const requiredNotes: Note[] = [standardizeNote(new Note(c.root, c.accidental))]
  semitones.forEach((s) => {
    const previousNoteIndex = KEYBOARD.findIndex((k) => {
      const previousNote = requiredNotes[requiredNotes.length - 1]
      return _.isEqual(k.root, previousNote.root) && _.isEqual(k.accidental, previousNote.accidental)
    })
    if (previousNoteIndex !== -1) {
      let copy = KEYBOARD[previousNoteIndex + s]
      let note = new Note(copy.root, copy.accidental)
      requiredNotes.push(note)
    }
  })

  return requiredNotes
}

export const isValidVoicing = (chord: Chord, nonNormalizedActiveNotes: Array<Note>): boolean => {
  if (nonNormalizedActiveNotes.length < 3) return false
  if (chord.seventh && nonNormalizedActiveNotes.length < 4) return false

  const activeNotes = nonNormalizedActiveNotes.map(standardizeNote)
  const standardizedRootNote = standardizeNote(new Note(chord.root, chord.accidental))

  const rootNotes = activeNotes.filter((n) => _.isEqual(n.root, standardizedRootNote.root) && _.isEqual(n.accidental, standardizedRootNote.accidental))
  if (rootNotes.length === 0) return false

  // For every required note, we must find a matching (sans octave) note in the activeNotes parameter
  return requiredNotesForChord(chord).every((requiredNote) => activeNotes.some((activeNote) => {
      return requiredNote.root === activeNote.root && _.isEqual(requiredNote.accidental, activeNote.accidental)
    })
  )
}
