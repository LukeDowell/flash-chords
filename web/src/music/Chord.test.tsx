import {Chord, chordToSymbol, isValidVoicing, requiredNotesForChord, symbolToChord} from "./Chord";
import {FLAT, Note, SHARP, toNote} from "./Note";

describe('musical chords', () => {
  test.each([
    ["C", {root: "C", quality: "Major"} as Chord],
    ["F#m", {root: "F", accidental: SHARP, quality: "Minor"} as Chord],
    ["F#7", {root: "F", accidental: SHARP, quality: "Major", seventh: "Minor"} as Chord],
    ["A♭m7", {root: "A", accidental: FLAT, quality: "Minor", seventh: "Minor"} as Chord],
    ["D♭M7", {root: "D", accidental: FLAT, quality: "Major", seventh: "Major"} as Chord],
    ["D♭maj7", {root: "D", accidental: FLAT, quality: "Major", seventh: "Major"} as Chord],
  ])(
    `%s should be parsed to %s`,
    (symbol: string, expectedChord: Chord) => expect(symbolToChord(symbol)).toEqual(expectedChord)
  )

  test.each([
    [{root: "C", quality: "Major"} as Chord, "C",],
    [{root: "F", accidental: SHARP, quality: "Minor"} as Chord, "F#m"],
    [{root: "B", accidental: FLAT, quality: "Diminished", seventh: "Minor"} as Chord, "B♭o7"],
    [{root: "F", accidental: SHARP, quality: "Major", seventh: "Minor"} as Chord, "F#7"],
    [{root: "A", accidental: SHARP, quality: "Major", seventh: "Major"} as Chord, "A#M7"],
    [{root: "A", accidental: FLAT, quality: "Minor", seventh: "Minor"} as Chord, "A♭m7"]
  ])(
    `%s should be written as %s`,
    (chord, expectedString) => expect(chordToSymbol(chord)).toStrictEqual(expectedString)
  )

  test.each([
    [""],
    ["   C "],
    ["lelelel"],
    [":^)"],
    ["Fm#7"]
  ])(
    `%s should NOT be parsed`,
    (symbol: string) => expect(() => symbolToChord(symbol)).toThrow()
  )

  test.each([
    [["E", "G#", "B", "D"], "F♭7"], // Should actually be written as Fb, Ab, Cb, Ebb
    [["B", "D#", "F#", "A"], "B7"],
    [["C", "D#", "F#"], "B#dim"],
    [["C#", "F", "G#", "C"], "D♭M7"],
    [["G#", "B", "D#", "F#"], "A♭m7"],
    [["C", "D#", "F#", "A#"], "Cm7♭5"],
  ])(
    `%s should be the required notes for %s`,
    (notes: string[], chordSymbol: string) => {
      const requiredNotes: Note[] = requiredNotesForChord(symbolToChord(chordSymbol))
      const expectedNotes: Note[] = notes.map(toNote)
      expect(requiredNotes).toEqual(expectedNotes)
    }
  )

  test.each([
    [["B", "D"], "B7"],
    [["C#"], "B#dim"],
    [["C#", "F"], "D♭M7"]
  ])(
    `%s should NOT be the required notes for %s`,
    (notes: string[], chordSymbol: string) => {
      expect(requiredNotesForChord(symbolToChord(chordSymbol))).not.toEqual(notes.map(toNote))
    }
  )

  test.each([
    [["C", "E", "G", "A#"], {root: "C", quality: "Major", seventh: "Minor"} as Chord],
    [["F", "A", "C", "D#"], {root: "F", quality: "Major", seventh: "Minor"} as Chord],
    [["G", "A#", "D", "F"], {root: "G", quality: "Minor", seventh: "Minor"} as Chord],
  ])(
    '%s should be the required notes for %s',
    (keys: string[], chord: Chord) => expect(requiredNotesForChord(chord).sort()).toEqual(keys.map(toNote).sort())
  )

  test.each([
    [["C", "E", "G"], {root: "C", quality: "Major", seventh: "Minor"} as Chord],
    [["F1", "G#1"], {root: "F", quality: "Major", seventh: "Minor"} as Chord],
    [["G3", "A#3", "D4", "F#4"], {root: "G", quality: "Minor", seventh: "Minor"} as Chord],
  ])(
    '%s should NOT be the required notes for %s',
    (keys: string[], chord: Chord) => expect(requiredNotesForChord(chord).sort()).not.toBe(keys.map(toNote).sort())
  )
})

describe("Triad Chord Voicings", () => {
  test.each([
    [["C1", "E1", "G1"], {root: "C", quality: "Major"} as Chord],
    [["C2", "E2", "G2", "C3"], {root: "C", quality: "Major"} as Chord],
    [["C1", "E5", "F5", "G5", "E6"], {root: "C", quality: "Major"} as Chord],
    [["C1", "D#1", "G1"], {root: "C", quality: "Minor"} as Chord],
    [["C1", "D#1", "G1", "C2"], {root: "C", quality: "Minor"} as Chord],
    [["G1", "A#1", "D2"], {root: "G", quality: "Minor"} as Chord],
    [["F5", "A5", "C6"], {root: "F", quality: "Major"} as Chord],
    [["E5", "G#5", "B6"], {root: "E", quality: "Major"} as Chord],
    [["G5", "B5", "D#6"], {root: "G", quality: "Augmented"} as Chord],
    [["B2", "D2", "F2"], {root: "B", quality: "Diminished"} as Chord],
  ])(
    '%s should be a valid voicing of %s',
    (keys, chord) => expect(isValidVoicing(chord, keys.map(toNote))).toBe(true)
  )

  test.each([
    [[], {root: "C", quality: "Major"} as Chord],
    [["C1", "E1", "D1"], {root: "C", quality: "Major"} as Chord],
    [["G1", "A#1", "A2"], {root: "G", quality: "Minor"} as Chord],
    [["F5", "A5", "G6"], {root: "F", quality: "Major"} as Chord],
  ])(
    '%s should NOT be a valid voicing of %s',
    (keys, chord) => expect(isValidVoicing(chord, keys.map(toNote))).toBe(false)
  )
})

describe("Seventh Chord Voicings", () => {
  test.each([
    [["C1", "E1", "G1", "A#2"], {root: "C", quality: "Major", seventh: "Minor"} as Chord],
    [["C1", "E1", "G1", "B♭2"], {root: "C", quality: "Major", seventh: "Minor"} as Chord],
    [["G#1", "C1", "D#2", "G2"], {root: "G", accidental: SHARP, quality: "Major", seventh: "Major"} as Chord],
    [["A#1", "C#1", "F1", "G#1"], {root: "B", accidental: FLAT, quality: "Minor", seventh: "Minor"} as Chord]
  ])(
    '%s should be a valid voicing of %s',
    (keys, chord) => expect(isValidVoicing(chord, keys.map(toNote))).toBe(true)
  )

  test.each([
    [["C1", "E1", "G1", "A#2"], "C7"],
    [["C1", "E1", "G1", "B♭2"], "C7"],
    [["G#1", "C1", "D#2", "G2"], "G#M7"],
    [["G3", "A#3", "D4", "F4"], "Gm7"],
    [["G3", "B♭3", "D4", "F4"], "Gm7"],
  ])(
    '%s should be a valid voicing of %s',
    (keys, chord) => expect(isValidVoicing(symbolToChord(chord), keys.map(toNote))).toBe(true)
  )

  test.each([
    [["C1", "E1", "G1"], {root: "C", quality: "Major", seventh: "Minor"} as Chord],
    [["F1", "G#1"], {root: "F", quality: "Major", seventh: "Minor"} as Chord],
    [["G3", "A#3", "D4", "F#4"], symbolToChord("Gm7")],
    [["G3", "B♭3", "D4", "F#4"], symbolToChord("Gm7")],
  ])(
    '%s should NOT be a valid voicing of %s',
    (keys, chord) => expect(isValidVoicing(chord, keys.map(toNote))).toBe(false)
  )
})
