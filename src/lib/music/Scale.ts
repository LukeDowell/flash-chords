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

export const WHOLE_TONE_SCALE = {name: "Whole Tone", intervals: [2, 2, 2, 2, 2, 2]} as Scale
export const MAJOR_SCALE = {name: "Major", intervals: [2, 2, 1, 2, 2, 2, 1]} as Scale
export const NATURAL_MINOR_SCALE = {name: "Natural Minor", intervals: [2, 1, 2, 2, 1, 2, 2]} as Scale
export const HARMONIC_MINOR_SCALE = {name: "Harmonic Minor", intervals: [2, 1, 2, 2, 1, 3, 1]} as Scale
export const PENTATONIC_SCALE = {name: "Pentatonic", intervals: [2, 2, 3, 2, 3]} as Scale
export const BLUES_SCALE = {name: "Blues", intervals: [3, 2, 1, 1, 3, 2]} as Scale

export const SCALES: Record<ScaleQuality, Scale> = {
  "Major": MAJOR_SCALE,
  "Natural Minor": NATURAL_MINOR_SCALE,
  "Harmonic Minor": HARMONIC_MINOR_SCALE,
  "Pentatonic": PENTATONIC_SCALE,
  "Blues": BLUES_SCALE,
  "Whole Tone": WHOLE_TONE_SCALE,
}
