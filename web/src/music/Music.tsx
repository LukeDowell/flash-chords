export type Note = "A0" | "A#0" | "B0" |
  "C1" | "C#1" | "D1" | "D#1" | "E1" | "F1" | "F#1" | "G1" | "G#1" | "A1" | "A#1" | "B1" |
  "C2" | "C#2" | "D2" | "D#2" | "E2" | "F2" | "F#2" | "G2" | "G#2" | "A2" | "A#2" | "B2" |
  "C3" | "C#3" | "D3" | "D#3" | "E3" | "F3" | "F#3" | "G3" | "G#3" | "A3" | "A#3" | "B3" |
  "C4" | "C#4" | "D4" | "D#4" | "E4" | "F4" | "F#4" | "G4" | "G#4" | "A4" | "A#4" | "B4" |
  "C5" | "C#5" | "D5" | "D#5" | "E5" | "F5" | "F#5" | "G5" | "G#5" | "A5" | "A#5" | "B5" |
  "C6" | "C#6" | "D6" | "D#6" | "E6" | "F6" | "F#6" | "G6" | "G#6" | "A6" | "A#6" | "B6" |
  "C7" | "C#7" | "D7" | "D#7" | "E7" | "F7" | "F#7" | "G7" | "G#7" | "A7" | "A#7" | "B7" |
  "C8"

export const KEYBOARD: Note[] = [
  "A0", "A#0", "B0",
  "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1", "A1", "A#1", "B1",
  "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2",
  "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3",
  "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
  "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5",
  "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6", "A6", "A#6", "B6",
  "C7", "C#7", "D7", "D#7", "E7", "F7", "F#7", "G7", "G#7", "A7", "A#7", "B7",
  "C8",
]

export type RootNote = "A" | "B" | "C" | "D" | "E" | "F" | "G"

export type Accidental = {
  symbol: "#" | "\u266d",

  /**
   * Semitone modifier. This is the amount of half steps
   * from the base note.
   */
  mod: -1 | 1
}

export type Accidentals = {
  FLAT: {
    symbol: "#",
    mod: "1"
  },
  SHARP: {
    symbol: "\u266d",
    mod: "-1"
  }
}

export type ChordQuality = "Major" | "Minor" | "Augmented" | "Diminished"

export interface Chord {
  root: RootNote
  quality: ChordQuality
  seventh?: "Major" | "Minor"
  bassNote?: RootNote
}

export const toChordSymbol = (c: Chord) => {
  let quality;
  switch (c.quality) {
    case "Diminished":
      quality = "dim"
      break;
    case "Minor":
      quality = "m"
      break;
    case "Major":
      quality = ""
      break;
    case "Augmented":
      quality = "aug"
      break;
  }
  return `${c.root}` + `${quality}`
}

export const generateRandomChord = (): Chord => {
  const roots = ["A", "B", "C", "D", "E", "F", "G"] as RootNote[]
  const qualities = ["Major", "Minor", "Augmented", "Diminished"] as ChordQuality[]
  return {
    root: roots[Math.floor(Math.random() * roots.length)],
    quality: qualities[Math.floor(Math.random() * qualities.length)],
  }
}

export const hasAccidental = (s: string): boolean => s.includes("#") || s.includes("\u266D")
export const symbolToChord = (symbol: string): Chord | undefined => {
  const validExpressions = [
    // Triad
    /^[a-gA-G][#\u266D]?(?:dim|m|aug)?$/g,

    // Seventh TODO unicode characters for delta (major major) and the weird o?
    /^[a-gA-G][#\u266D]?(?:dim|m|aug|maj)?7$/g,
  ]

  if (!validExpressions.find((e) => e.test(symbol))) return

  return undefined
}

export const chordToSymbol = (chord: Chord): string => {
  return ""
}

export const MIDI = {
  KEY_DOWN: 144,
  KEY_UP: 128,
  HEARTBEAT: 254
}

export const lowerNote = (a: Note, b: Note) => {
  if (a === b) {
    return a
  }

  const aOctave = Number.parseInt(a.replace("#", "").charAt(1))
  const bOctave = Number.parseInt(b.replace("#", "").charAt(1))

  if (aOctave < bOctave) return a
  else if (bOctave < aOctave) return b
  else {
    const aNoteValue = a.charCodeAt(0)
    const bNoteValue = b.charCodeAt(0)

    if (aNoteValue < bNoteValue) return a
    else return b
  }
}

export const noteOctave = (n: Note): number => Number.parseInt(n.charAt(n.length - 1))

export const removeOctave = (n: Note): string => `${n.length === 3 ? n.substring(0, 2) : n.charAt(0)}`

export const sortNotes = (notes: Note[]): Note[] => notes.sort((a, b) => {
  // Sort by octave first
  if (noteOctave(a) < noteOctave(b)) return -1;
  else if (noteOctave(a) > noteOctave(b)) return 1;

  const baseA = removeOctave(a)
  const baseB = removeOctave(b)

  // Sort by note
  if (baseA.charCodeAt(0) < baseB.charCodeAt(0)) return -1
  else if (baseA.charCodeAt(0) > baseB.charCodeAt(0)) return 1

  // If notes are the same, then sort by sharp if it exists
  if (baseA.includes("#") && !baseB.includes("#")) return 1
  else if (baseB.includes("#") && !baseA.includes("#")) return -1

  return 1
})

export const isValidVoicing = (chord: Chord, activeNotes: Array<Note>): boolean => {
  if (activeNotes.length < 3) return false
  if (chord.seventh && activeNotes.length < 4) return false

  const semitones = Array<number>()
  switch (chord.quality) {
    case "Diminished":
      semitones.push(3, 3)
      break;
    case "Minor":
      semitones.push(3, 4)
      break;
    case "Major":
      semitones.push(4, 3)
      break;
    case "Augmented":
      semitones.push(4, 4)
      break;
  }

  switch (chord.seventh) {
    case "Major":
      semitones.push(4)
      break
    case "Minor":
      semitones.push(3)
      break
  }

  const sortedActiveNotes = sortNotes(activeNotes);
  const rootNotes = activeNotes.filter((note) => note.includes(chord.root))

  if (rootNotes.length === 0) return false

  const lowestRootNote = rootNotes.length > 1 ? activeNotes[0] : rootNotes.reduce(lowerNote)
  const activeNotesWithoutOctave = sortedActiveNotes.filter((n) => !rootNotes.includes(n)).map(removeOctave)
  const dedupedNotesWithoutOctave = Array.from(new Set(activeNotesWithoutOctave))
  const transposedActiveNotes: Note[] = [lowestRootNote]
  const notesAboveRoot: Note[] = KEYBOARD.slice(KEYBOARD.indexOf(lowestRootNote), KEYBOARD.length)

  dedupedNotesWithoutOctave.forEach((nextRequiredNote) => {
    const closestNoteToRoot = notesAboveRoot.find((n) => n.includes(nextRequiredNote))
    transposedActiveNotes.push(closestNoteToRoot!!)
  })

  const requiredNotes: Note[] = [lowestRootNote]

  semitones.forEach((s) => {
    const nextThirdIndex = KEYBOARD.indexOf(requiredNotes[requiredNotes.length - 1]) + s
    requiredNotes.push(KEYBOARD[nextThirdIndex])
  })

  return requiredNotes.every((n) => transposedActiveNotes.includes(n))
}
