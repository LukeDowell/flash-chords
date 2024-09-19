import {
  DOUBLE_FLAT,
  DOUBLE_SHARP,
  FLAT,
  genericInterval,
  NATURAL,
  Note,
  placeOnOctave,
  SHARP,
  sortNotes,
  standardizeNote,
  stepsBetween,
  toNote
} from "@/lib/music/Note";

describe('Musical Notes', () => {
  test.each([
    ["A0", 'C#3'],
    ["G#1", 'G#7'],
    ["E4", 'F4'],
    ["C1", 'C2'],
    ["C1", 'C1'],
    ['D#4', 'E4'],
    ['C#4', 'D#4'],
    ['B3', 'C#4'],
    ['C3', 'A3'],
    ['F##3', 'G#3'],
    ['C#5', 'C##5']
  ])(
    `%s should be lower than %s`,
    (lower: string, higher: string) => expect(toNote(lower).isLowerThan(toNote(higher))).toBeTruthy()
  )

  test.each([
    [["C4", "C4"], 1],
    [["C4", "D4"], 2],
    [["C4", "E4"], 3],
    [["C4", "B4"], 7],
    [["D4", "D5"], 8],
    [["D4", "F5"], 10],
    [["C4", "F5"], 11],
  ])(
    `%s should have a generic interval of %d`,
    (noteStrings: string[], interval: number) => {
      const notes = noteStrings.map(toNote)
      expect(genericInterval(notes[0], notes[1])).toEqual(interval)
    }
  )

  it('should throw an error when trying to compare two notes without an octave', () => {
    expect(() => {
      genericInterval(toNote('C'), toNote('G'))
    }).toThrow()
  })

  test.each([
    [["C3", "C2"], ["C2", "C3"]],
    [["F#5", "G#4", "G6"], ["G#4", "F#5", "G6"]],
    [["G4", "C4", "A#4"], ["C4", "G4", "A#4"]],
    [["G4", "C4", "A#4", "A4"], ["C4", "G4", "A4", "A#4"]],
    [['B3', 'C#4', 'D#4', 'E4'], ['B3', 'C#4', 'D#4', 'E4']]
  ])(
    `%s should be sorted to %s`,
    (unsorted: string[], expected: string[]) => {
      const unsortedNotes = unsorted.map(toNote)
      const expectedNotes = expected.map(toNote)
      expect(sortNotes(unsortedNotes)).toEqual(expectedNotes)
    }
  )

  test.each([
    ["Fb", "E"],
    ["Cb", "B"],
    ["C#", "C#"],
    ["Db", "C#"],
    ["C##", "D"],
    ["Fbb", "D#"],
    ["G#3", "G#3"],
  ])(
    `%s should be standardized to %s`,
    (unstandard, standard) => expect(standardizeNote(toNote(unstandard))).toEqual(toNote(standard))
  )

  test.each([
    ["C2", new Note("C", undefined, 2)],
    ["Cb2", new Note("C", FLAT, 2)],
    ["Cbb2", new Note("C", DOUBLE_FLAT, 2)],
    ["F#5", new Note("F", SHARP, 5)],
    ["F##5", new Note("F", DOUBLE_SHARP, 5)],
    ["B\u266E5", new Note("B", NATURAL, 5)],
  ])(
    `%s should be parsed to %s`,
    (input: string, expectedNote: Note) => expect(toNote(input)).toEqual(expectedNote)
  )

  test.each([
    [""],
    ["        "],
    ["Cb2, G2, C#"],
    ["F#53"],
  ])(
    `%s should be unable to be parsed`,
    (input: string) => expect(() => toNote(input)).toThrow()
  )

  test.each([
    [['C', 'E', 'G', 'C'], ['C4', 'E4', 'G4', 'C5']],
    [['G', 'B', 'D'], ['G4', 'B4', 'D5']],
    [['D', 'F', 'A', 'C'], ['D4', 'F4', 'A4', 'C5']],
    [['D', 'D'], ['D4', 'D5']],
  ])(
    '%s when placed on an octave should be %s',
    (notes: string[], expected: string[]) => {
      expect(placeOnOctave(4, notes.map(toNote))).toStrictEqual(expected.map(toNote))
    }
  )

  test.each([
    [['F', 'Ab', 'C', 'Eb'], 4, ['F4', 'Ab4', 'C5', 'Eb5']],
  ])(
    `%s notes placed on octave %s should be %s`,
    (notes: string[], octave: number, expectedNotes: string[]) => {
      const placedNotes = placeOnOctave(octave, notes.map(toNote))
      expect(placedNotes).toStrictEqual(expectedNotes.map(toNote))
    }
  )

  it('should be equivalent', () => {
    expect(Note.of('B#').isEquivalent(Note.of('C'))).toBe(true)
    expect(Note.of('C#').isEquivalent(Note.of('Db'))).toBe(true)
    expect(Note.of('E#').isEquivalent(Note.of('F'))).toBe(true)
    expect(Note.of('Gb').isEquivalent(Note.of('F#'))).toBe(true)
    expect(Note.of('C').isEquivalent(Note.of('C'))).toBe(true)
    expect(Note.of('C4').isEquivalent(Note.of('C4'))).toBe(true)
    expect(Note.of('G#4').isEquivalent(Note.of('Ab4'))).toBe(true)
  })

  it('should not be equivalent', () => {
    expect(Note.of('B#').isEquivalent(Note.of('B'))).toBe(false)
    expect(Note.of('C#').isEquivalent(Note.of('Gb'))).toBe(false)
    expect(Note.of('C4').isEquivalent(Note.of('C5'))).toBe(false)
    expect(Note.of('Ab').isEquivalent(Note.of('Bb'))).toBe(false)
  })

  it('should count the steps between notes', () => {
    expect(stepsBetween(Note.of('C1'), Note.of('D1'))).toBe(2)
    expect(stepsBetween(Note.of('C1'), Note.of('C2'))).toBe(12)
    expect(stepsBetween(Note.of('E'), Note.of('G'))).toBe(3)
    expect(stepsBetween(Note.of('C'), Note.of('E'))).toBe(4)
    expect(stepsBetween(Note.of('Cb'), Note.of('B'))).toBe(0)
    expect(stepsBetween(Note.of('E#'), Note.of('F'))).toBe(0)
  })
})
