import _ from "lodash";

export type ScaleQuality = "Major" | "Natural Minor" | "Harmonic Minor" | "Blues" | "Pentatonic" | "Whole Tone"

export class Scale {
  readonly name: ScaleQuality
  readonly intervals: number[]
  readonly intervalsFromRoot: number[]
  readonly isDiatonic: boolean

  constructor(name: ScaleQuality, intervals: number[]) {
    this.name = name
    this.intervals = intervals
    this.intervalsFromRoot = intervals.map((interval, index, arr) => interval + _.sum(arr.slice(0, index)))
    this.isDiatonic = intervals.length === 7
      && intervals.filter((n) => n === 2).length === 5
      && intervals.filter((n) => n === 1).length === 2 // TODO the two half steps need to be separated by at -least- two whole steps
  }
}

export const WHOLE_TONE_SCALE = new Scale("Whole Tone", [2, 2, 2, 2, 2, 2])
export const MAJOR_SCALE = new Scale("Major", [2, 2, 1, 2, 2, 2, 1])
export const NATURAL_MINOR_SCALE = new Scale("Natural Minor", [2, 1, 2, 2, 1, 2, 2])
export const HARMONIC_MINOR_SCALE = new Scale("Harmonic Minor", [2, 1, 2, 2, 1, 3, 1])
export const PENTATONIC_SCALE = new Scale("Pentatonic", [2, 2, 3, 2, 3])
export const BLUES_SCALE = new Scale("Blues", [3, 2, 1, 1, 3, 2])

export const SCALES: Record<ScaleQuality, Scale> = {
  "Major": MAJOR_SCALE,
  "Natural Minor": NATURAL_MINOR_SCALE,
  "Harmonic Minor": HARMONIC_MINOR_SCALE,
  "Pentatonic": PENTATONIC_SCALE,
  "Blues": BLUES_SCALE,
  "Whole Tone": WHOLE_TONE_SCALE,
}
