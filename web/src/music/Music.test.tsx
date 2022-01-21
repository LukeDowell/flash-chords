import {
  Chord,
  chordToSymbol,
  FLAT,
  isValidVoicing,
  lowerNote,
  Note,
  SHARP,
  sortNotes,
  symbolToChord,
  toNote
} from './Music'

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
    [["G#1", "C1", "D#2", "G2"], {root: "G", accidental: SHARP, quality: "Major", seventh: "Major"} as Chord],
  ])(
    '%s should be a valid voicing of %s',
    (keys, chord) => expect(isValidVoicing(chord, keys.map(toNote))).toBe(true)
  )

  test.each([
    [["C1", "E1", "G1"], {root: "C", quality: "Major", seventh: "Minor"} as Chord],
  ])(
    '%s should NOT be a valid voicing of %s',
    (keys, chord) => expect(isValidVoicing(chord, keys.map(toNote))).toBe(false)
  )
})

describe("Music Note Utilities", () => {
  test.each([
    ["A0", 'C#3'].map(toNote),
    ["G#1", 'G#7'].map(toNote),
    ["E4", 'F4'].map(toNote),
    ["C1", 'C2'].map(toNote),
    ["C1", 'C1'].map(toNote),
  ])(
    `%s should be lower than %s`,
    (lower: Note, higher: Note) => expect(lowerNote(lower, higher)).toBe(lower)
  )

  test.each([
    [["C3", "C2"].map(toNote), ["C2", "C3"].map(toNote)],
    [["F#5", "G#4", "G6"].map(toNote), ["G#4", "F#5", "G6"].map(toNote)],
    [["G4", "C4", "A#4"].map(toNote), ["A#4", "C4", "G4"].map(toNote)],
    [["G4", "C4", "A#4", "A4"].map(toNote), ["A4", "A#4", "C4", "G4"].map(toNote)],
  ])(
    `%s should be sorted to %s`,
    (unsorted: Note[], expected: Note[]) => expect(sortNotes(unsorted)).toStrictEqual(expected)
  )

  test.each([
    ["C", { root: "C", quality: "Major"} as Chord],
    ["F#m", { root: "F", accidental: SHARP,  quality: "Minor"} as Chord],
    ["F#7", { root: "F", accidental: SHARP, quality: "Major", seventh: "Minor"} as Chord]
  ])(
    `%s should be parsed to %s`,
    (symbol: string, expectedChord: Chord) => expect(symbolToChord(symbol)).toStrictEqual(expectedChord)
  )

  test.each([
    [{ root: "C", quality: "Major"} as Chord, "C",],
    [{ root: "F", accidental: SHARP,  quality: "Minor"} as Chord, "F#m"],
    [{ root: "B", accidental: FLAT, quality: "Diminished", seventh: "Minor"} as Chord, "B\u266do7"],
    [{ root: "F", accidental: SHARP, quality: "Major", seventh: "Minor"} as Chord, "F#7"],
    [{ root: "A", accidental: SHARP, quality: "Major", seventh: "Major"} as Chord, "A#M7"],
  ])(
    `%s should be written as %s`,
    (chord, expectedString) => expect(chordToSymbol(chord)).toStrictEqual(expectedString)
  )

  test.each([
    ["C", { root: "C", quality: "Minor"} as Chord],
    ["", { root: "F", accidental: SHARP, quality: "Minor"} as Chord],
    ["lelelel", { root: "F", accidental: SHARP, quality: "Minor"} as Chord],
    [":^)", { root: "F", accidental: SHARP, quality: "Minor"} as Chord],
    ["Fm#7", { root: "F", accidental: SHARP, quality: "Major", seventh: "Minor"} as Chord]
  ])(
    `%s should NOT be parsed to %s`,
    (symbol: string, expectedChord: Chord) => expect(symbolToChord(symbol)).not.toStrictEqual(expectedChord)
  )
})
