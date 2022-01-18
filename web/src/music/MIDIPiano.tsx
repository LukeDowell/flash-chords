import {KEYBOARD, MIDI, Note} from "./Music";

export default class MIDIPiano {
  private activeNotes: Note[] = []
  private listeners: Map<string, (activeNotes: Note[]) => any> = new Map()

  constructor(midiInput: WebMidi.MIDIInput) {
    midiInput.addEventListener(
      "midimessage",
      (e: WebMidi.MIDIMessageEvent) => {
        const note = KEYBOARD[e.data[1] - 21]
        const flag = e.data[0];
        if (flag === MIDI.KEY_DOWN && e.data[2] !== 0) {
          this.activeNotes.push(note)
        } else if (flag === MIDI.KEY_UP || (flag === MIDI.KEY_DOWN && e.data[2] === 0)) {
          this.activeNotes = Array.from(new Set(this.activeNotes.filter((i) => i !== note)))
        }
        if (flag !== MIDI.HEARTBEAT) this.notifyListeners()
      }
    )
  }

  notifyListeners() {
    this.listeners.forEach((v, k) => v.call(v, this.activeNotes))
  }

  setListener(key: string, callback: (activeNotes: Note[]) => any) {
    this.listeners = new Map([
      ...this.listeners,
      [key, callback]
    ])
  }
}
