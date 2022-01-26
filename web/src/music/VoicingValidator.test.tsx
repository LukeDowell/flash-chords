import {SHARP, toNote} from "./Note";
import {Chord} from "./Chord";
import {isValidVoicing} from "./VoicingValidator";

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
    [["C1", "E1", "G1", "B\u266d2"], {root: "C", quality: "Major", seventh: "Minor"} as Chord],
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
