import {findNoteOnKeyboard, FLAT, KEYBOARD, Note, Root, SHARP, standardizeNote} from "@/lib/music/Note";
import _ from "lodash";
import {MAJOR_SCALE, Scale, ScaleType} from "@/lib/music/Scale";
import {Chord} from "@/lib/music/Chord";


export interface MusicKey {
  root: Note
  scale: Scale
  notes: Note[]
}

const ROOT_NOTES: Root[] = ["A", "B", "C", "D", "E", "F", "G"]

/**
 * Steps away from a given note. 4 steps up from C is G, for an interval of 5
 * Wraps around the array when reaching the end or when reaching the beginning if stepping downward
 */
export const stepFromItemInArray = <T>(n: T, steps: number, array: T[]): T => {
  const i = array.indexOf(n)
  const j = steps + i
  if (j > array.length - 1) return stepFromItemInArray(array[0], j % array.length, array)
  if (j < 0) return stepFromItemInArray(array[array.length - 1], steps + i + 1, array)
  return array[j]
}

export const stepFrom = (r: Root, steps: number): Root => stepFromItemInArray(r, steps, ROOT_NOTES)

/**
 * Creates an array of the keys found on the circle of fifths based
 * on the number of accidentals that key has. The number of accidentals
 * could be considered the index of the circle, with -7 and 7 being
 * Cb and C# respectively
 */
export const circleKeys = (numAccidentals: number): MusicKey => {
  let accidentals: Root[] = []
  if (numAccidentals !== 0) {
    accidentals = numAccidentals > 0
      ? _.range(0, numAccidentals).map(a => stepFrom('F', 4 * a))
      : _.range(0, numAccidentals, -1).map(a => stepFrom('B', 4 * a))
  }

  const accidental = numAccidentals > 0 ? SHARP : FLAT
  const root = stepFrom("C", numAccidentals * 4)
  const keyCenter = accidentals.includes(root)
    ? new Note(root, accidental)
    : new Note(root)

  const keyCenterIndex = findNoteOnKeyboard(keyCenter)
  const keyNotes = MAJOR_SCALE.semitonesFromRoot.map(i => KEYBOARD[keyCenterIndex + i])
    .map(n => new Note(n.root, n.accidental, undefined))
    .map(n => {
      if ((accidentals.includes(n.root) && n.accidental !== accidental) // Natural that should be sharp
        || (!accidentals.includes(n.root) && n.accidental)) { // Sharp that should be flat
        const noteIndex = findNoteOnKeyboard(n)
        const newNoteIndex = noteIndex + (accidental.mod * -1)
        return new Note(KEYBOARD[newNoteIndex].root, accidental)
      } else return n
    })

  keyNotes.unshift(keyNotes.pop()!!)

  return {
    root: keyCenter,
    scale: MAJOR_SCALE,
    notes: keyNotes
  }
}

export const CIRCLE_OF_FIFTHS = _.chain(_.range(-7, 7))
  .map(circleKeys)
  .value()

export const getKey = (root: string, scale: ScaleType = "Major"): MusicKey => {
  const key = CIRCLE_OF_FIFTHS.find((k) => root === k.root.toString() && k.scale.name === scale);
  if (!key) throw Error(`Unable to find key: ${root.concat(scale)}`)
  return key!!
}

export const diatonicChords = (key: MusicKey, seventh: boolean = false): Chord[] => {
  return key.notes.map((n, index, arr) => {
    let notes: Note[] = [
      n,
      stepFromItemInArray(n, 2, arr),
      stepFromItemInArray(n, 4, arr),
    ]

    if (seventh) notes = notes.concat(stepFromItemInArray(n, 6, arr))

    return Chord.fromNotes(notes)
  })
}

/**
 * Tries to format the notes based on a key. Doesn't handle naturals yet, beware
 * of non-diatonic format attempts
 */
export function notesInKey(notes: Note[], key: MusicKey): Note[] {
  return notes.map(standardizeNote)
    .map(sn => {
      const match = key.notes.find(kn => sn.withOctave(undefined).isEquivalent(kn)) || sn
      let newOctave = sn.octave
      if (newOctave && sn.root === "B" && match.root === "C") newOctave++
      return match.withOctave(newOctave)
    })
}

export function isValidVoicingForChord(voicing: Note[], chord: Chord): boolean {
  return chord.notes().every(cn => voicing.some((vn) => {
    return vn.equalsWithoutOctave(cn)
  }))
}
