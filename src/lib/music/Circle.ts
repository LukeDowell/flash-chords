import {findNoteOnKeyboard, FLAT, KEYBOARD, Note, Root, SHARP, standardizeNote} from "@/lib/music/Note";
import {ChordQuality, SeventhQuality} from "@/lib/music/Chord";
import _ from "lodash";
import {MAJOR_SCALE, Scale} from "@/lib/music/Scale";


export type ChordDegree = 0 | 1 | 2 | 3 | 4 | 5
export const THIRD = 0
export const FIFTH = 1
export const SEVENTH = 2
export const NINTH = 3
export const ELEVENTH = 4
export const THIRTEENTH = 5

export type Third = 4 | 3
export const MAJOR_THIRD: Third = 4
export const MINOR_THIRD: Third = 3

export const FChordQualities: Record<ChordQuality, Third[]> = {
  "Major": [4, 3],
  "Minor": [3, 4],
  "Augmented": [4, 4],
  "Diminished": [3, 3],
}

export interface FKey {
  root: Note
  scale: Scale
  notes: Note[]
}

export class FChord {
  /**
   * The root of a given chord, eg. C or Db or
   */
  readonly root: Note

  /**
   * The quality of the base triad of this chord. eg. "Major" or "Diminished"
   */
  readonly quality: ChordQuality

  /**
   * The quality of the seventh note of this chord. eg. "Dominant" or "Half-diminished"
   */
  readonly seventhQuality: SeventhQuality | null

  /**
   * Any kind of extensions the chord may have. Sevenths, 9ths, #11th, b13, etc
   * These extensions will be considered when calculating the "required" notes
   * for a given chord.
   */
  readonly extensions: Array<[ChordDegree, Third]>

  constructor(root: Note,
              quality: ChordQuality = "Major",
              seventhQuality: SeventhQuality | null = null,
              extensions: Array<[ChordDegree, Third]> = []) {
    this.root = root
    this.quality = quality
    this.seventhQuality = seventhQuality
    this.extensions = extensions
  }

  /**
   * The resultant intervals between each note following the root, as calculated
   * on all the provided properties above
   */
  intervals(): number[] {
    const size = _.max(this.extensions.map(([d, _]) => d)) || FIFTH
    const intervals = Array(size).fill(0)
    intervals[THIRD] = FChordQualities[this.quality][THIRD]
    intervals[FIFTH] = FChordQualities[this.quality][FIFTH]
    this.extensions.forEach(([d, s]) => intervals[d] = s)
    return intervals
  }

  notes(): Note[] {
    const index = KEYBOARD.findIndex((n) => n.equalsWithoutOctave(standardizeNote(this.root)))
    if (index === -1) throw new Error("Unable to find note on keyboard!")
    const semitonesFromRoot = this.intervals().map((interval, i) => {
      const previousTotal = _.sum(this.intervals().slice(0, i))
      return previousTotal + interval
    })

    return [KEYBOARD[index]].concat(semitonesFromRoot.map(s => KEYBOARD[index + s]))
      .map(n => new Note(n.root, n.accidental, this.root.octave ? n.octave : undefined))
  }
}

const ROOT_NOTES: Root[] = ["A", "B", "C", "D", "E", "F", "G"]

/** Steps away from a given note. 4 steps up from C is G, for an interval of 5 */
export const stepFrom = (n: Root, steps: number): Root => {
  const i = ROOT_NOTES.indexOf(n)
  const j = steps + i
  if (j > ROOT_NOTES.length - 1) return stepFrom(ROOT_NOTES[0], j % ROOT_NOTES.length)
  if (j < 0) return stepFrom(ROOT_NOTES[ROOT_NOTES.length - 1], steps + i + 1)
  return ROOT_NOTES[j]
}

/**
 * Creates an array of the keys found on the circle of fifths based
 * on the number of accidentals that key has. The number of accidentals
 * could be considered the index of the circle, with -7 and 7 being
 * Cb and C# respectively
 */
export const circleMajorKeys = (numAccidentals: number): FKey => {
  let accidentals: Root[] = []
  if (numAccidentals !== 0) {
    accidentals = numAccidentals > 0
      ? _.range(0, numAccidentals).map(a => stepFrom('F', 4 * a))
      : _.range(0, numAccidentals, -1).map(a => stepFrom('B', -4 * a))
  }

  const accidental = numAccidentals > 0 ? SHARP : FLAT
  const root = stepFrom("C" as Root, numAccidentals * 4)
  const keyCenter = accidentals.includes(root)
    ? new Note(root, accidental)
    : new Note(root)

  const keyCenterIndex = findNoteOnKeyboard(keyCenter)
  const keyNotes = MAJOR_SCALE.semitonesFromRoot.map(i => KEYBOARD[keyCenterIndex + i])
    .map(n => new Note(n.root, n.accidental, undefined))
    .map(n => {
      if ((accidentals.includes(n.root) && n.accidental !== accidental) // Natural that should be sharp
        // Natural that should be a flat (E but should be Fb)
        || (!accidentals.includes(n.root) && n.accidental)) { // Sharp that should be flat
        console.log(`Problem Note`, n)
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

// const CIRCLE_OF_FIFTHS: { [index: string]: FKey }  = _.chain(_.range(-7, 7))
//   .map(circleMajorKeys)
//   .groupBy(k => k.root.toString())
//   .value()
