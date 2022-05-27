import {requiredNotesForChord, symbolToChord} from "./Chord";
import {Note, toNote} from "./Note";
import {Key, MAJOR_KEYS, transposeNotesToKey} from "./Keys";

describe('Keys', () => {
  test.each([
    ['D♭maj7', MAJOR_KEYS['D♭'], ['D♭', 'F', 'A♭', 'C'].map(toNote)],
  ])(
    `%s required notes should be %s`,
    (symbol: string, key: Key, expectedNotes: Note[]) => {
      const normalizedNotes = requiredNotesForChord(symbolToChord(symbol))
      const requiredNotes = transposeNotesToKey(normalizedNotes, key)
      expect(requiredNotes).toEqual(expectedNotes)
    }
  )
})
