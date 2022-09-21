import {requiredNotesForChord, toChord} from "./Chord";
import {toNote} from "./Note";
import {formatNotesInKey, getDiatonicChords, formattedNotesForChord, KeyQuality, MAJOR_KEYS, KEYS, keyOf} from "./Keys";

describe('Keys', () => {
  test.each([
    // ['Dbmaj7', 'Db', ['Db', 'F', 'Ab', 'C']],
    // ['Ebm7', 'Db', ['Eb', 'Gb', 'Bb', 'Db']],
    // ['Fm7', 'Db', ['F', 'Ab', 'C', 'Eb']],
    // ['Gbmaj7', 'Db', ['Gb', 'Bb', 'Db', 'F']],
    // ['Ab7', 'Db', ['Ab', 'C', 'Eb', 'Gb']],
    // ['Bbm7', 'Db', ['Bb', 'Db', 'F', 'Ab']],
    // ['Cm7b5', 'Db', ['C', 'Eb', 'Gb', 'Bb']],
    // ['Ebmaj7', 'F', ['Eb', 'G', 'Bb', 'D']],
    ['B#dim', 'C#', ['B#', 'D#', 'F#']],
  ])(
    `%s required notes in key of %s should be %s`,
    (symbol: string, key: string, expectedNotes: string[]) => {
      const normalizedNotes = requiredNotesForChord(toChord(symbol))
      const formattedNotes = formatNotesInKey(normalizedNotes, MAJOR_KEYS[key])
      expect(formattedNotes).toStrictEqual(expectedNotes.map(toNote))
    }
  )

  test.each([
    ['D', 'Major', ['Dmaj7', 'Em7', 'F#m7', 'Gmaj7', 'A7', 'Bm7', 'C#m7b5']],
    ['Ab', 'Major', ['Abmaj7', 'Bbm7', 'Cm7', 'Dbmaj7', 'Eb7', 'Fm7', 'Gm7b5']]
  ])(
    `%s %s diatonic chords for major keys should be %s`,
    (keyRoot: string, keyQuality: string, expectedChords: string[]) => {
      const diatonicChords = keyOf(keyRoot, keyQuality as KeyQuality)?.diatonicChords || []
      expect(diatonicChords).toStrictEqual(expectedChords.map(toChord))
    }
  )

  test.each([
    [['C', 'D', 'Eb', 'F', 'G', 'A', 'B'], ['CmM7', 'Dm7', 'EbaugM7', 'F7', 'G7', 'Am7b5', 'Bm7b5']],
  ])(
    `%s diatonic chords for melodic minor keys should be %s`,
    (notes: string[], expectedChords: string[]) => {
      const diatonicChords = getDiatonicChords(notes.map(toNote), "Melodic Minor")
      expect(diatonicChords).toStrictEqual(expectedChords.map(toChord))
    }
  )

  test.each([
    // ['Cmaj7', ['C', 'E', 'G', 'B']],
    // ['C', ['C', 'E', 'G']],
    // ['Ebmaj7', ['Eb', 'G', 'Bb', 'D']],
    // ['Ebm7', ['Eb', 'Gb', 'Bb', 'Db']],
    // ['Gm', ['G', 'Bb', 'D']],
    ['B#dim', ['B#', 'D#', 'F#']]
  ])(
    `%s required notes formatted in key should be %s`,
    (chordSymbol: string, expectedNotes: string[]) => {
      const chord = toChord(chordSymbol)
      const notes = formattedNotesForChord(chord)
      expect(notes).toStrictEqual(expectedNotes.map(toNote))
    }
  )
})
