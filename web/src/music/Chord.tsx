import {Accidental, FLAT, hasAccidental, Note, Root, SHARP, standardizeNote} from "./Note";
import _ from "lodash";
import {KEYBOARD} from "./MIDIPiano";

export type ChordQuality = "Major" | "Minor" | "Augmented" | "Diminished"
export type SeventhQuality = "Major" | "Minor"

export interface Chord {
  root: Root
  quality: ChordQuality
  accidental?: Accidental
  seventh?: SeventhQuality
  bassNote?: Note
}

export const generateRandomChord = (): Chord => {
  const roots = ["A", "B", "C", "D", "E", "F", "G"] as Root[]
  const qualities = ["Major", "Minor", "Augmented", "Diminished"] as ChordQuality[]
  const accidentals = [FLAT, SHARP, undefined] as Accidental[]
  const addedThirds = ["Major", "Minor", undefined]

  const root = roots[Math.floor(Math.random() * roots.length)]
  const quality = qualities[Math.floor(Math.random() * qualities.length)]
  const accidental = accidentals[Math.floor(Math.random() * accidentals.length)]
  let seventh = undefined
  if (quality !== "Augmented") {
    seventh = addedThirds[Math.floor(Math.random() * addedThirds.length)]
  }

  return {root, quality, accidental, seventh} as Chord
}

export const chordToSymbol = (c: Chord) => {
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

export const symbolToChord = (symbol: string): Chord => {
  const validExpressions = [
    // Triad
    /^[a-gA-G][#\u266D]?(?:dim|m|aug)?$/g,

    // Seventh
    /^[a-gA-G][#\u266D]?[mMo\u00f8]?7$/g,
  ]

  if (!validExpressions.find((e) => e.test(symbol))) throw new Error(`invalid chord symbol format ${symbol}`)

  const root = symbol.charAt(0) as Root
  let accidental: Accidental | undefined
  if (hasAccidental(symbol)) {
    if (symbol.charAt(1) === "\u266d") accidental = FLAT
    else accidental = SHARP
  }

  // Seventh
  let seventh: "Major" | "Minor" | undefined
  let quality: ChordQuality = "Major"
  if (symbol.charAt(symbol.length - 1) === "7") {
    if (/[mMo\u00f8]/g.test(symbol)) {
      const a = symbol.charAt(symbol.length - 2)
      if (a === "\u00f8") {
        seventh = "Major"
        quality = "Diminished"
      } else if (a === "M") {
        seventh = "Major"
        quality = "Major"
      } else if (a === "o") {
        seventh = "Minor"
        quality = "Diminished"
      } else if (a === "m") {
        seventh = "Minor"
        quality = "Minor"
      }
    } else {
      seventh = "Minor"
      quality = "Major"
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

  return {root, quality, accidental, seventh}
}

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

  // TODO find some way to 'change back' the format of the chord
  const requiredNotes: Note[] = [standardizeNote({root: c.root, accidental: c.accidental})]
  semitones.forEach((s) => {
    const previousNoteIndex = KEYBOARD.findIndex((k) => {
      const previousNote = requiredNotes[requiredNotes.length - 1]
      return _.isEqual(k.root, previousNote.root) && _.isEqual(k.accidental, previousNote.accidental)
    })
    if (previousNoteIndex !== -1) requiredNotes.push({...KEYBOARD[previousNoteIndex + s], octave: undefined})
  })

  return requiredNotes
}

export const isValidVoicing = (chord: Chord, nonNormalizedActiveNotes: Array<Note>): boolean => {
  if (nonNormalizedActiveNotes.length < 3) return false
  if (chord.seventh && nonNormalizedActiveNotes.length < 4) return false

  const activeNotes = nonNormalizedActiveNotes.map(standardizeNote)

  const rootNotes = activeNotes.filter((n) => n.root === chord.root && _.isEqual(n.accidental, chord.accidental))
  if (rootNotes.length === 0) return false

  // For every required note, we must find a matching (sans octave) note in the activeNotes parameter
  return requiredNotesForChord(chord).every((requiredNote) => activeNotes.some((activeNote) => {
      return requiredNote.root === activeNote.root && _.isEqual(requiredNote.accidental, activeNote.accidental)
    })
  )
}
