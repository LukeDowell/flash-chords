import { Chord } from './Music'
import {isValidChord} from "./ChordValidator";

test('should correctly validate a C major chord', () => {
  const chord: Chord = { root: "C", quality: "Major" } // Something odd here, why do I have to explicity define the type?
  const activeKeys = ["C", "E", "G"]
  expect(isValidChord(chord, activeKeys)).toBeTruthy()
});
