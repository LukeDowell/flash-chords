import { Chord, isValidVoicing } from './Music'

describe("Chord Voicings", () => {
  test.each([
    [["C1", "E1", "G1"], { root: "C", quality: "Major" } as Chord],
    [["C2", "E2", "G2", "C3"], { root: "C", quality: "Major" } as Chord],
    [["C1", "E5", "F5", "G5", "E6"], { root: "C", quality: "Major" } as Chord],
    [["C1", "D#1", "G1"], { root: "C", quality: "Minor" } as Chord],
    [["C1", "D#1", "G1", "C2"], { root: "C", quality: "Minor" } as Chord],
  ])(
    '%s should be a valid voicing of %s',
    (keys: string[], chord: Chord) => expect(isValidVoicing(chord, keys)).toBe(true)
  )
})
