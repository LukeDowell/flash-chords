import {Chord} from "@/lib/music/Circle";

export const chordToSymbol = (chord: Chord): string => {
  const root = `${chord.root.root}${chord.root.accidental?.symbol || ""}`
  const triadQuality = {
    "Major": "",
    "Minor": "m",
    "Augmented": "aug",
    "Diminished": "dim"
  }[chord.quality]

  return `${root}${triadQuality}`
}

export const symbolToChord = (symbol: string): Chord => {
  return new Chord('C', 'Major')
}
