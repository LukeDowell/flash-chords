import {requiredNotesForChord, symbolToChord} from "./Chord";
import {toNote} from "./Note";
import {formatNotesInKey, MAJOR_KEYS} from "./Keys";

describe('Keys', () => {
  test.each([
    ['D♭maj7', 'D♭', ['D♭', 'F', 'A♭', 'C']],
  ])(
    `%s required notes in key of %s should be %s`,
    (symbol: string, key: string, expectedNotes: string[]) => {
      const normalizedNotes = requiredNotesForChord(symbolToChord(symbol))
      const formattedNotes = formatNotesInKey(normalizedNotes, MAJOR_KEYS[key])
      expect(formattedNotes).toEqual(expectedNotes.map(toNote))
    }
  )
})
