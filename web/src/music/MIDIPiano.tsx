import {Note, toNote} from "./Note";

/**
 * A physical representation of a keyboard
 */
export const KEYBOARD: Note[] = [
  "A0", "A#0", "B0", // 2
  "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1", "A1", "A#1", "B1", // 14
  "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", // 26
  "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", // 38
  "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
  "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5",
  "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6", "A6", "A#6", "B6",
  "C7", "C#7", "D7", "D#7", "E7", "F7", "F#7", "G7", "G#7", "A7", "A#7", "B7",
  "C8",
].map(toNote)

export const MIDI = {
  KEY_DOWN: 144,
  KEY_UP: 128,
  HEARTBEAT: 254
}

export const MIDI_KEYBOARD_OFFSET = 21

export default class MIDIPiano {
  private activeNotes: Note[] = []
  private listeners: Map<string, (activeNotes: Note[]) => any> = new Map()

  constructor(midiInput?: WebMidi.MIDIInput) {
    midiInput?.addEventListener(
      "midimessage",
      (e: WebMidi.MIDIMessageEvent) => {
        const note: Note = KEYBOARD[e.data[1] - MIDI_KEYBOARD_OFFSET]
        const flag = e.data[0];
        if (flag === MIDI.KEY_DOWN && e.data[2] !== 0) {
          this.activeNotes.push(note)
        } else if (flag === MIDI.KEY_UP || (flag === MIDI.KEY_DOWN && e.data[2] === 0)) {
          const arrayWithoutNote = this.activeNotes.filter((i) => i !== note)
          this.activeNotes = Array.from(new Set(arrayWithoutNote))
        }
        if (flag !== MIDI.HEARTBEAT) this.notifyListeners()
      }
    )
  }

  notifyListeners() {
    this.listeners.forEach((v, k) => v.call(v, this.activeNotes))
  }

  removeListener(key: string) {
    this.listeners.delete(key)
  }

  setListener(key: string, callback: (activeNotes: Note[]) => any) {
    this.listeners = new Map([
      ...this.listeners,
      [key, callback]
    ])
  }
}
