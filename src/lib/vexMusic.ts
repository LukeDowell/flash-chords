import {Note} from "@/lib/music/Note";
import {Accidental, ChordSymbol, StaveNote} from "vexflow";
import {Chord} from "@/lib/music/Chord";

type NotesToStaveNoteOptions = {
  chord?: Chord,
  fillStyle?: string,
  duration?: string
}

export const notesToStaveNote = (notes: Note[], options?: NotesToStaveNoteOptions): StaveNote => {
  if (notes.some(n => n.octave === undefined)) throw new Error('Notes need an octave in order to be placed on the staff')
  const keys = notes.map(n => `${n.root.concat(n.accidental?.symbol || "")}/${n.octave}`)
  const staveNote = new StaveNote({keys, duration: options?.duration || "w"});
  notes.forEach((n, i) => {
    if (n?.accidental?.symbol) staveNote.addModifier(new Accidental(n.accidental.symbol), i)
  })

  if (options?.chord) staveNote.addModifier(chordToChordSymbol(options.chord))
  if (options?.fillStyle) staveNote.setStyle({fillStyle: options.fillStyle, strokeStyle: options.fillStyle})

  return staveNote
}

export const staveNoteToNotes = (staveNote: StaveNote): Note[] => {
  return staveNote.getKeys().map(pitchString => Note.of(pitchString.replace('/', '')))
}

export const chordToChordSymbol = (c: Chord): ChordSymbol => {
  return new ChordSymbol().addGlyphOrText(c.toString())
    .setFontSize(18)
    .setHorizontal('center')
}

// whole quarter half eighth sixteenth thirty-second
export type Duration = "w" | "h" | "q" | "8" | "16" | "32"
export type DurationFraction = 1 | .5 | .25 | .125 | .0625 | .03125

const DURATIONS: Duration[] = ["w", "h", "q", "8", "16", "32"]
const FRACTIONS: DurationFraction[] = [1, .5, .25, .125, .0625, .03125]

const durationToFraction: Map<Duration, DurationFraction> = new Map([["w", 1], ["h", .5], ["q", .25], ["8", .125], ["16", .0625], ["32", 0.03125]])
const fractionToDuration: Map<DurationFraction, Duration> = new Map(Array.from(durationToFraction, entry => [entry[1], entry[0]]))

export function getDuration(note: string): DurationFraction | undefined {
  const durationMaybe = DURATIONS.find((d: Duration) => {
    return note.includes(d)
  })

  if (!durationMaybe) return undefined
  else return durationToFraction.get(durationMaybe)
}

export function getRemainder(voice: string): DurationFraction | 0 {
  const notes = voice.split(", ")
  let previousDuration: DurationFraction = durationToFraction.get("q")!!
  let count = 0

  notes.forEach((note, i) => {
    const duration = getDuration(note) || previousDuration
    count += duration
  })

  if (count >= 1) {
    return 0
  }

  return 1 - count as DurationFraction
}

/**
 * @param measureVoice an easyscore measure ex. "C2/q, D2, E2, F2/8, F2#/8"
 */
export function fillWithRests(measureVoice: string): string {
  return measureVoice
}

export function splitIntoMeasures(voice: string): string[] {
  const measures: string[] = []
  const notes: string[] = voice.split(", ")
  let previousDuration: DurationFraction = durationToFraction.get("q")!!
  let count = 0
  let lastMeasureIndex = 0

  notes.forEach((note, i) => {
    const noteDuration = getDuration(note) || previousDuration
    count += noteDuration
    previousDuration = noteDuration

    if (count >= 1) {
      count = 0
      measures.push(notes.slice(lastMeasureIndex, i + 1).join(", "))
      lastMeasureIndex = i + 1
    }
  })

  if (count > 0) {
    const lastMeasure = notes.slice(lastMeasureIndex, notes.length)
    let lastMeasureRemainder = getRemainder(lastMeasure.join(", "))
    while (lastMeasureRemainder > 0) {
      const restSize = FRACTIONS.find((f) => f <= lastMeasureRemainder)
      if (restSize === undefined) throw new Error("wtf")
      const duration = fractionToDuration.get(restSize)
      lastMeasure.push(`C4/${duration}/r`)
      lastMeasureRemainder = lastMeasureRemainder - restSize
    }

    measures.push(lastMeasure.join(", "))
  }


  return measures
}

export const chordToEasyScore = (chord: Chord, duration?: Duration): string => `(${chord.notes().join(', ')})${duration ? '/' + duration : ''}`

export const noteToEasyScore = (note: Note, duration?: Duration): string => `${note.toString()}/${duration || ''}`

export const easyScoreToNote = (easyScore: string): Note[] => {
  return []
}
