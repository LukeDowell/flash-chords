import {requiredNotesForChord, toChord} from "./Chord";
import {toNote} from "./Note";
import {formatNotesInKey, MAJOR_KEYS} from "./Keys";

describe('Keys', () => {
  test.each([
    ['Dbmaj7', 'Db', ['Db', 'F', 'Ab', 'C']],
    ['Ebm7', 'Db', ['Eb', 'Gb', 'Bb', 'Db']],
    ['Fm7', 'Db', ['F', 'Ab', 'C', 'Eb']],
    ['Gbmaj7', 'Db', ['Gb', 'Bb', 'Db', 'F']],
    ['Ab7', 'Db', ['Ab', 'C', 'Eb', 'Gb']],
    ['Bbm7', 'Db', ['Bb', 'Db', 'F', 'Ab']],
    ['Cm7b5', 'Db', ['C', 'Eb', 'Gb', 'Bb']],
  ])(
    `%s required notes in key of %s should be %s`,
    (symbol: string, key: string, expectedNotes: string[]) => {
      const normalizedNotes = requiredNotesForChord(toChord(symbol))
      const formattedNotes = formatNotesInKey(normalizedNotes, MAJOR_KEYS[key])
      expect(formattedNotes).toStrictEqual(expectedNotes.map(toNote))
    }
  )
})
