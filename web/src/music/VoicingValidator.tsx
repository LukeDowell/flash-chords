import {FLAT, lowerNote, Note, SHARP, sortNotes, toNote} from "./Note";
import {Chord} from "./Chord";
import _ from "lodash";

/**
 * A physical representation of a keyboard
 */
export const KEYBOARD: Note[] = [
  "A0", "A#0", "B0",
  "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1", "A1", "A#1", "B1",
  "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2",
  "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3",
  "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
  "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5",
  "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6", "A6", "A#6", "B6",
  "C7", "C#7", "D7", "D#7", "E7", "F7", "F#7", "G7", "G#7", "A7", "A#7", "B7",
  "C8",
].map(toNote)

export const isValidVoicing = (chord: Chord, nonNormalizedActiveNotes: Array<Note>): boolean => {
  if (nonNormalizedActiveNotes.length < 3) return false
  if (chord.seventh && nonNormalizedActiveNotes.length < 4) return false

  // Standardize all notes onto the same notation that the keyboard uses
  const activeNotes = nonNormalizedActiveNotes.map((n) => {
    if (_.isEqual(n.accidental, FLAT)) {
      const newRoot = n.root === "A" ? String.fromCharCode(71) : String.fromCharCode(n.root.charCodeAt(0) - 1)
      const newOctave = n.root === "C" && n.octave ? n.octave - 1 : n.octave
      return {
        ...n,
        octave: newOctave,
        root: newRoot,
        accidental: SHARP,
      } as Note
    } else return n
  })

  const sortedActiveNotes = sortNotes(activeNotes);
  const rootNotes = activeNotes.filter((n) => n.root === chord.root && _.isEqual(n.accidental, chord.accidental))

  if (rootNotes.length === 0) return false

  const lowestRootNote: Note = rootNotes.length > 1 ? activeNotes[0] : rootNotes.reduce(lowerNote)
  const nonRootActiveNotes = sortedActiveNotes
    .filter((n) => !rootNotes.some((r) => r.root === n.root && r.accidental === n.accidental))
  const uniqueNonRootActiveNotes = Array.from(new Set(nonRootActiveNotes))
  const rootNoteKeyIndex = KEYBOARD.findIndex((k) => _.isEqual(k, lowestRootNote))
  const notesAboveRoot: Note[] = KEYBOARD.slice(rootNoteKeyIndex, KEYBOARD.length)

  // Transpose active notes to be in sequence following the lowest root note
  let transposedActiveNotes = uniqueNonRootActiveNotes.map(
    (active) => notesAboveRoot.find((n) => {
      return n.root === active.root && _.isEqual(n.accidental, active.accidental)
    }))
  transposedActiveNotes = [lowestRootNote, ...transposedActiveNotes]

  const semitones = Array<number>()
  switch (chord.quality) {
    case "Diminished":
      semitones.push(3, 3)
      break;
    case "Minor":
      semitones.push(3, 4)
      break;
    case "Major":
      semitones.push(4, 3)
      break;
    case "Augmented":
      semitones.push(4, 4)
      break;
  }

  switch (chord.seventh) {
    case "Major":
      semitones.push(4)
      break
    case "Minor":
      semitones.push(3)
      break
  }

  const requiredNotes: Note[] = [lowestRootNote]
  semitones.forEach((s) => {
    const nextThirdIndex = KEYBOARD.findIndex((k) => _.isEqual(k, requiredNotes[requiredNotes.length - 1])) + s
    requiredNotes.push(KEYBOARD[nextThirdIndex])
  })

  return requiredNotes.every((n) => transposedActiveNotes.some((an) => _.isEqual(n, an)))
}
