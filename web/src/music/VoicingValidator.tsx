import {FLAT, Note, SHARP} from "./Note";
import {Chord, requiredNotesForChord} from "./Chord";
import _ from "lodash";

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

  const rootNotes = activeNotes.filter((n) => n.root === chord.root && _.isEqual(n.accidental, chord.accidental))
  if (rootNotes.length === 0) return false

  const requiredNotes = requiredNotesForChord(chord)

  // For every required note, we must find a matching (sans octive) note in the activeNotes parameter
  return requiredNotes.every((requiredNote) => activeNotes.some((activeNote) => {
      return requiredNote.root === activeNote.root && _.isEqual(requiredNote.accidental, activeNote.accidental)
    })
  )
}
