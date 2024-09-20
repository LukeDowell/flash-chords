import _ from "lodash";
import {Note, ROOTS} from "@/lib/music/Note";

export type ScaleType = "Major" | "Natural Minor" | "Harmonic Minor" | "Blues" | "Pentatonic" | "Whole Tone"

export class Scale {
  readonly name: ScaleType
  readonly intervals: number[]
  readonly semitonesFromRoot: number[]
  readonly isDiatonic: boolean

  constructor(name: ScaleType, intervals: number[]) {
    this.name = name
    this.intervals = intervals
    this.semitonesFromRoot = intervals.map((interval, index, arr) => interval + _.sum(arr.slice(0, index)))
    this.isDiatonic = intervals.length === 7
      && intervals.filter((n) => n === 2).length === 5
      && intervals.filter((n) => n === 1).length === 2
      && true // TODO the two half steps need to be separated by at -least- two whole steps
  }
}

export const WHOLE_TONE_SCALE = new Scale("Whole Tone", [2, 2, 2, 2, 2, 2])
export const MAJOR_SCALE = new Scale("Major", [2, 2, 1, 2, 2, 2, 1])
export const NATURAL_MINOR_SCALE = new Scale("Natural Minor", [2, 1, 2, 2, 1, 2, 2])
export const HARMONIC_MINOR_SCALE = new Scale("Harmonic Minor", [2, 1, 2, 2, 1, 3, 1])
export const PENTATONIC_SCALE = new Scale("Pentatonic", [2, 2, 3, 2, 3])
export const BLUES_SCALE = new Scale("Blues", [3, 2, 1, 1, 3, 2])

export const SCALES = [
  MAJOR_SCALE, NATURAL_MINOR_SCALE, HARMONIC_MINOR_SCALE,
  PENTATONIC_SCALE, BLUES_SCALE, WHOLE_TONE_SCALE
]

export const SCALES_FOR_ALL_NOTES: Array<{
  note: Note,
  scale: Scale
}> = ROOTS.flatMap(root => ['#', 'b', ''].map(accidental => `${root}${accidental}`))
  .map(Note.of)
  .flatMap(note => SCALES.map(scale => {
    return {note, scale}
  }))
