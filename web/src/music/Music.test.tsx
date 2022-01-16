import {Chord, isValidVoicing, lowerNote, Note, sortNotes} from './Music'

describe("Triad Chord Voicings", () => {
  test.each([
    [["C1", "E1", "G1"] as Note[], { root: "C", quality: "Major" } as Chord],
    [["C2", "E2", "G2", "C3"] as Note[], { root: "C", quality: "Major" } as Chord],
    [["C1", "E5", "F5", "G5", "E6"] as Note[], { root: "C", quality: "Major" } as Chord],
    [["C1", "D#1", "G1"] as Note[], { root: "C", quality: "Minor" } as Chord],
    [["C1", "D#1", "G1", "C2"] as Note[], { root: "C", quality: "Minor" } as Chord],
    [["G1", "A#1", "D2"] as Note[], { root: "G", quality: "Minor" } as Chord],
    [["F5", "A5", "C6"] as Note[], { root: "F", quality: "Major" } as Chord],
    [["E5", "G5", "B6"] as Note[], { root: "E", quality: "Major" } as Chord],
  ])(
    '%s should be a valid voicing of %s',
    (keys: Note[], chord: Chord) => expect(isValidVoicing(chord, keys)).toBe(true)
  )

  test.each([
    [[] as Note[], { root: "C", quality: "Major" } as Chord],
    [["C1", "E1", "D1"] as Note[], { root: "C", quality: "Major" } as Chord],
    [["G1", "A#1", "A2"] as Note[], { root: "G", quality: "Minor" } as Chord],
    [["F5", "A5", "G6"] as Note[], { root: "F", quality: "Major" } as Chord],
  ])(
    '%s should NOT be a valid voicing of %s',
    (keys: Note[], chord: Chord) => expect(isValidVoicing(chord, keys)).toBe(false)
  )
})

describe("Seventh Chord Voicings", () => {
  test.each([
    [["C1", "E1", "G1", "B2"] as Note[], { root: "C", quality: "Major", seventh: true } as Chord],
  ])(
    '%s should be a valid voicing of %s',
    (keys: Note[], chord: Chord) => expect(isValidVoicing(chord, keys)).toBe(true)
  )
})

describe("Music Note Utilities", () => {
  test.each([
    ["A0", 'C#3'] as Note[],
    ["G#1", 'G#7'] as Note[],
    ["E4", 'F4'] as Note[],
    ["C1", 'C2'] as Note[],
    ["C1", 'C1'] as Note[],
  ])(
    `%s should be lower than %s`,
    (lower: Note, higher: Note) => expect(lowerNote(lower, higher)).toBe(lower)
  )

  test.each([
    [["C3", "C2"] as Note[], ["C2", "C3"] as Note[]],
    [["F#5", "G#4", "G6"] as Note[], ["G#4", "F#5", "G6"] as Note[]],
    [["G4", "C4", "A#4"] as Note[], ["A#4", "C4", "G4"] as Note[]],
    [["G4", "C4", "A#4", "A4"] as Note[], ["A4", "A#4", "C4", "G4"] as Note[]],
  ])(
    `%s should be sorted to %s`,
    (unsorted: Note[], expected: Note[]) => expect(sortNotes(unsorted)).toStrictEqual(expected)
  )
})
