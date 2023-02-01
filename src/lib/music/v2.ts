import {KEYBOARD, Note, standardizeNote} from "@/lib/music/Note";
import {ChordQuality} from "@/lib/music/Chord";
import _ from "lodash";
import {Scale} from "@/lib/music/Scale";

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

export interface PianoKey {
  /** The index of the key if you were looking straight on at a piano keyboard, with A0 being 0 and C8 being 87*/
  index: number,
  note: Note
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
   * Any kind of extensions the chord may have. Sevenths, 9ths, #11th, b13, etc
   * These extensions will be considered when calculating the "required" notes
   * for a given chord.
   */
  readonly extensions: Array<[ChordDegree, Third]>

  constructor(root: Note,
              quality: ChordQuality = "Major",
              extensions: Array<[ChordDegree, Third]> = []) {
    this.root = root
    this.quality = quality
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

export class FKey {
  readonly root: Note
  readonly scale: Scale

  constructor(root: Note, scale: Scale) {
    this.root = root
    this.scale = scale
  }
}
