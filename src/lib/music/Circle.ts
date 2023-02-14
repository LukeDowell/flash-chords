import {findNoteOnKeyboard, FLAT, KEYBOARD, Note, Root, SHARP, standardizeNote, stepsBetween} from "@/lib/music/Note";
import _ from "lodash";
import {MAJOR_SCALE, Scale, ScaleType} from "@/lib/music/Scale";


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

export type ChordQuality = "Major" | "Minor" | "Augmented" | "Diminished"

export const FChordQualities: Record<ChordQuality, Third[]> = {
  "Major": [4, 3],
  "Minor": [3, 4],
  "Augmented": [4, 4],
  "Diminished": [3, 3],
}

export type SeventhQuality = "Major" | "Minor" | "Half-Diminished" | "Fully-Diminished"

export const FChordSeventhQualities: Record<SeventhQuality, Third> = {
  "Major": 4,
  "Minor": 3,
  "Half-Diminished": 4,
  "Fully-Diminished": 3
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

  constructor(rootNote: string,
              quality: ChordQuality = "Major",
              seventhQuality: SeventhQuality | null = null,
              extensions: Array<[ChordDegree, Third]> = []) {
    this.root = Note.of(rootNote)
    this.quality = quality
    this.seventhQuality = seventhQuality
    this.extensions = extensions
  }

  static fromNotes(notes: Note[]): FChord {
    const intervals: number[] = _.chain(notes).map(standardizeNote)
      .flatMap((n, i, array) => i === array.length - 1 ? [] : stepsBetween(n, array[i + 1]))
      .value()

    const thirds: Third[] = intervals.slice(0, 2).filter((n): n is Third => n >= 3 || n <= 4)
    const quality = _.invert(FChordQualities)[thirds.toString()] as ChordQuality

    return new FChord(notes[0].withOctave(0).toString(), quality)
  }

  /**
   * The resultant intervals between each note following the root, as calculated
   * on all the provided properties above
   */
  intervals(): number[] {
    let size
    if (this.extensions.length > 0) size = _.max(this.extensions.map(([d, _]) => d))
    else size = FIFTH + (this.seventhQuality ? 1 : 0)
    const intervals = Array(size).fill(0)
    intervals[THIRD] = FChordQualities[this.quality][THIRD]
    intervals[FIFTH] = FChordQualities[this.quality][FIFTH]
    if (this.seventhQuality) intervals[SEVENTH] = FChordSeventhQualities[this.seventhQuality]
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
export const circleKeys = (numAccidentals: number): FKey => {
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

export const getKey = (root: string, scale: ScaleType = "Major"): FKey => {
  const key = CIRCLE_OF_FIFTHS.find((k) => root === k.root.toString() && k.scale.name === scale);
  if (!key) throw Error(`Unable to find key: ${root.concat(scale)}`)
  return key
}

export const diatonicChords = (key: FKey, seventh: boolean = false): FChord[] => {
  return key.notes.map((n, index, arr) => {
    let notes: Note[] = [
      n,
      stepFromItemInArray(n, 2, arr),
      stepFromItemInArray(n, 4, arr),
    ]

    if (seventh) notes = notes.concat(stepFromItemInArray(n, 6, arr))

    return FChord.fromNotes(notes)
  })
}

/**
 * Tries to format the notes based on a key. Doesn't handle naturals yet, beware
 * of non-diatonic format attempts
 */
export function notesInKey(notes: Note[], key: FKey): Note[] {
  return notes.map(standardizeNote).map(sn => key.notes.find(kn => sn.isEquivalent(kn)) || sn)
}

export function isValidVoicingForChord(voicing: Note[], chord: FChord): boolean {
  return chord.notes().every(cn => voicing.some((vn) => {
    return vn.equalsWithoutOctave(cn)
  }))
}
