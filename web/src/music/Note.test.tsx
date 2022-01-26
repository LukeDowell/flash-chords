import {lowerNote, Note, sortNotes, toNote} from "./Note";

describe('Musical Notes', () => {
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
})
