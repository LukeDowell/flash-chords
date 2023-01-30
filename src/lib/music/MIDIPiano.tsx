import {KEYBOARD, Note} from "./Note";

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
    // this.listeners.set(key, callback)
    this.listeners = new Map([
      ...this.listeners,
      [key, callback]
    ])
  }
}
