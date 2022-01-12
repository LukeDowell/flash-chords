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

export type ChordQuality = "Major" | "Minor" | "Augmented" | "Diminished"

export interface Chord {
  root: RootNote,
  quality: ChordQuality
}

export const generateRandomChord = (): Chord => {
  const roots = ["A","B","C","D","E","F","G"] as RootNote[]
  const qualities = ["Major","Minor","Augmented","Diminished"] as ChordQuality[]
  return {
    root: roots[Math.floor(Math.random() * roots.length - 1)],
    quality: qualities[Math.floor(Math.random() * qualities.length - 1)]
  }
}

export const MIDI_NOTE_FLAG = {
  KEY_DOWN: 144,
  KEY_UP: 128
}

export class MIDIPiano {
  private activeNotes: Array<string> = Array()
  private listeners: Array<(activeNotes: Array<string>, event: WebMidi.MIDIMessageEvent) => any> = Array()

  constructor(midiInput: WebMidi.MIDIInput) {
    midiInput.addEventListener(
      "midimessage",
      (e: WebMidi.MIDIMessageEvent) => {
        const note = KEYBOARD[e.data[1] - 21]
        if (e.data[0] === MIDI_NOTE_FLAG.KEY_DOWN) {
          this.activeNotes.push(note)
        } else if (e.data[0] === MIDI_NOTE_FLAG.KEY_UP) {
          this.activeNotes = this.activeNotes.filter((i) => i !== note)
        }
        this.listeners.forEach((c) => c.call(c, this.activeNotes, e))
      }
    )
  }

  addListener(callback: (activeNotes: Array<string>, event: WebMidi.MIDIMessageEvent) => any) {
    this.listeners.push(callback)
  }
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

// TODO
export const removeOctave = (n: Note): string => ""

export const isValidVoicing = (chord: Chord, activeNotes: Array<Note>): boolean => {
  const semitones = Array<number>()
  switch(chord.quality) {
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

  const rootNotes = activeNotes.filter((note) => note.includes(chord.root))
  const lowestRootNote = rootNotes.length > 1 ? rootNotes.reduce(lowerNote) : activeNotes[0]
  const transposedActiveNotesWithDuplicates =  activeNotes.map(
    (n) => `${n.length === 3 ? n.substring(0, 2) : n.charAt(0)}${noteOctave(lowestRootNote)}` as Note
  )
  const transposedActiveNotes: Array<Note> = Array.from(new Set<Note>(transposedActiveNotesWithDuplicates))

  // We have a bug!
  const requiredNotes = [lowestRootNote]
  semitones.forEach((s) => {
    requiredNotes.push(KEYBOARD[KEYBOARD.indexOf(requiredNotes[requiredNotes.length - 1]) + semitones[requiredNotes.length - 1]])
  })

  return requiredNotes.every((n) => transposedActiveNotes.includes(n))
}
