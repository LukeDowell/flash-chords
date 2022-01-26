import {Chord, chordToSymbol, symbolToChord} from "./Chord";
import {FLAT, SHARP} from "./Note";

describe('musical chords', () => {
  test.each([
    ["C", {root: "C", quality: "Major"} as Chord],
    ["F#m", {root: "F", accidental: SHARP, quality: "Minor"} as Chord],
    ["F#7", {root: "F", accidental: SHARP, quality: "Major", seventh: "Minor"} as Chord]
  ])(
    `%s should be parsed to %s`,
    (symbol: string, expectedChord: Chord) => expect(symbolToChord(symbol)).toEqual(expectedChord)
  )

  test.each([
    [{root: "C", quality: "Major"} as Chord, "C",],
    [{root: "F", accidental: SHARP, quality: "Minor"} as Chord, "F#m"],
    [{root: "B", accidental: FLAT, quality: "Diminished", seventh: "Minor"} as Chord, "B\u266do7"],
    [{root: "F", accidental: SHARP, quality: "Major", seventh: "Minor"} as Chord, "F#7"],
    [{root: "A", accidental: SHARP, quality: "Major", seventh: "Major"} as Chord, "A#M7"],
  ])(
    `%s should be written as %s`,
    (chord, expectedString) => expect(chordToSymbol(chord)).toStrictEqual(expectedString)
  )

  test.each([
    ["C", {root: "C", quality: "Minor"} as Chord],
    ["", {root: "F", accidental: SHARP, quality: "Minor"} as Chord],
    ["lelelel", {root: "F", accidental: SHARP, quality: "Minor"} as Chord],
    [":^)", {root: "F", accidental: SHARP, quality: "Minor"} as Chord],
    ["Fm#7", {root: "F", accidental: SHARP, quality: "Major", seventh: "Minor"} as Chord]
  ])(
    `%s should NOT be parsed to %s`,
    (symbol: string, expectedChord: Chord) => expect(symbolToChord(symbol)).not.toStrictEqual(expectedChord)
  )
})
