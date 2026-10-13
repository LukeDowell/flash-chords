import {KEYBOARD, Note, standardizeNote, stepsBetween} from "@/lib/music/Note";
import _ from "lodash";

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

export class Chord {
  /**
   * The root of a given chord, eg. C or Db or
   */
  readonly rootNote: Note

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
    this.rootNote = Note.of(rootNote)
    this.quality = quality
    this.seventhQuality = seventhQuality
    this.extensions = extensions
  }

  static fromNotes(notes: Note[]): Chord {
    const intervals: number[] = _.chain(notes).map(standardizeNote)
      .flatMap((n, i, array) => i === array.length - 1 ? [] : stepsBetween(n, array[i + 1]))
      .value()

    const thirds: Third[] = intervals.filter((n): n is Third => n >= 3 && n <= 4)
    if (thirds.length !== intervals.length || thirds.length < 2) {
      throw new Error(`notes do not stack in thirds: ${notes.join(", ")}`)
    }

    const quality = _.invert(FChordQualities)[thirds.slice(0, 2).toString()] as ChordQuality | undefined
    if (!quality) throw new Error(`unknown triad quality for notes: ${notes.join(", ")}`)

    let seventhQuality: SeventhQuality | null = null
    if (thirds.length > 2) {
      if (quality === "Diminished") seventhQuality = thirds[2] === MAJOR_THIRD ? "Half-Diminished" : "Fully-Diminished"
      else seventhQuality = thirds[2] === MAJOR_THIRD ? "Major" : "Minor"
    }

    return new Chord(notes[0].withOctave(0).toString(), quality, seventhQuality)
  }

  static fromSymbol(s: string): Chord {
    const match = s.match(/^([A-G](?:#{1,2}|b{1,2})?)(.*)$/)
    if (!match) throw new Error(`unparseable chord symbol: ${s}`)
    const [, root, suffix] = match

    const qualities: Record<string, [ChordQuality, SeventhQuality | null]> = {
      "": ["Major", null],
      "m": ["Minor", null],
      "aug": ["Augmented", null],
      "dim": ["Diminished", null],
      "maj7": ["Major", "Major"],
      "7": ["Major", "Minor"],
      "m7": ["Minor", "Minor"],
      "m(maj7)": ["Minor", "Major"],
      "augmaj7": ["Augmented", "Major"],
      "aug7": ["Augmented", "Minor"],
      "ø7": ["Diminished", "Half-Diminished"],
      "°7": ["Diminished", "Fully-Diminished"],
    }

    const quality = qualities[suffix]
    if (!quality) throw new Error(`unparseable chord symbol: ${s}`)
    return new Chord(root, quality[0], quality[1])
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
    const index = KEYBOARD.findIndex((n) => n.equalsWithoutOctave(standardizeNote(this.rootNote)))
    if (index === -1) throw new Error("Unable to find note on keyboard!")
    const semitonesFromRoot = this.intervals().map((interval, i) => {
      const previousTotal = _.sum(this.intervals().slice(0, i))
      return previousTotal + interval
    })

    return [KEYBOARD[index]].concat(semitonesFromRoot.map(s => KEYBOARD[index + s]))
      .map(n => new Note(n.root, n.accidental, this.rootNote.octave ? n.octave : undefined))
  }

  toString(): string {
    const root = `${this.rootNote.root}${this.rootNote.accidental?.symbol || ""}`
    const triadQuality: string = {
      "Major": "",
      "Minor": "m",
      "Augmented": "aug",
      "Diminished": "dim"
    }[this.quality]

    if (!this.seventhQuality) return `${root}${triadQuality}`

    const seventhSuffix: string = {
      "Major": {"Major": "maj7", "Minor": "m(maj7)", "Augmented": "augmaj7", "Diminished": "ø7"}[this.quality],
      "Minor": {"Major": "7", "Minor": "m7", "Augmented": "aug7", "Diminished": "°7"}[this.quality],
      "Half-Diminished": "ø7",
      "Fully-Diminished": "°7",
    }[this.seventhQuality]

    return `${root}${seventhSuffix}`
  }
}
