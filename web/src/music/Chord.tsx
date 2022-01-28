import {Accidental, FLAT, hasAccidental, Note, Root, SHARP} from "./Note";

export type ChordQuality = "Major" | "Minor" | "Augmented" | "Diminished"
export type SeventhQuality = "Major" | "Minor"

export interface Chord {
  root: Root
  quality: ChordQuality
  accidental?: Accidental
  seventh?: SeventhQuality
  bassNote?: Note
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

export const symbolToChord = (symbol: string): Chord | undefined => {
  const validExpressions = [
    // Triad
    /^[a-gA-G][#\u266D]?(?:dim|m|aug)?$/g,

    // Seventh
    /^[a-gA-G][#\u266D]?[mMo\u00f8]?7$/g,
  ]

  if (!validExpressions.find((e) => e.test(symbol))) return undefined

  const root = symbol.charAt(0) as Root
  let accidental: Accidental | undefined = undefined
  if (hasAccidental(symbol)) {
    if (symbol.charAt(1) === "\u266d") accidental = FLAT
    else accidental = SHARP
  }

  // Seventh
  let seventh: "Major" | "Minor" | undefined = undefined
  let quality: ChordQuality;
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

  // @ts-ignore
  return {root, quality, accidental, seventh}
}
