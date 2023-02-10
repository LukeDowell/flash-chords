import {FChord} from "@/lib/music/Circle";

export const chordToSymbol = (chord: FChord): string => {
  const root = `${chord.root.root}${chord.root.accidental?.symbol || ""}`
  const triadQuality = {
    "Major": "",
    "Minor": "m",
    "Augmented": "aug",
    "Diminished": "dim"
  }[chord.quality]

  return `${root}${triadQuality}`
}

export const symbolToChord = (symbol: string): FChord => {
  return new FChord('C', 'Major')
}
