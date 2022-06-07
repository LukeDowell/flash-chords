import {requiredNotesForChord, symbolToChord} from "./Chord";
import {Note, toNote} from "./Note";
import {Key, MAJOR_KEYS, formatNotesInKey} from "./Keys";

describe('Keys', () => {
  test.each([
    ['D♭maj7', 'D♭', ['D♭', 'F', 'A♭', 'C']],
  ])(
    `%s required notes in key of %s should be %s`,
    (symbol: string, key: string, expectedNotes: string[]) => {
      const normalizedNotes = requiredNotesForChord(symbolToChord(symbol))
      // @ts-ignore
      const requiredNotes = formatNotesInKey(normalizedNotes, MAJOR_KEYS[key])
      expect(requiredNotes).toEqual(expectedNotes.map(toNote))
    }
  )
})
