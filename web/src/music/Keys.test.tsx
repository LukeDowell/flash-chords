import {requiredNotesForChord, symbolToChord} from "./Chord";
import {toNote} from "./Note";
import {formatNotesInKey, MAJOR_KEYS} from "./Keys";

describe('Keys', () => {
  test.each([
    ['Dbmaj7', 'Db', ['Db', 'F', 'Ab', 'C']],
    ['Cm7b5', 'Db', ['C', 'Eb', 'Gb', 'Bb']],
  ])(
    `%s required notes in key of %s should be %s`,
    (symbol: string, key: string, expectedNotes: string[]) => {
      const normalizedNotes = requiredNotesForChord(symbolToChord(symbol))
      const formattedNotes = formatNotesInKey(normalizedNotes, MAJOR_KEYS[key])
      expect(formattedNotes).toEqual(expectedNotes.map(toNote))
    }
  )
})
