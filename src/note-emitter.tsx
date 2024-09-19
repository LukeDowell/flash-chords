import {findNoteOnKeyboard, Note, standardizeNote} from "@/lib/music/Note";
import {MIDI, MIDI_KEYBOARD_OFFSET} from "@/lib/music/MidiPiano";

/**
 * For tests
 */
export class NoteEmitter {
  private readonly _midiHook: (e: WebMidi.MIDIMessageEvent) => any
  private readonly _queuedActions: Array<() => Promise<any>>

  constructor(midiHook: (e: WebMidi.MIDIMessageEvent) => any) {
    this._midiHook = midiHook
    this._queuedActions = []
  }

  keyDown(notes: Note[] | string[], velocity: number = 50) {
    const events = noteToMidiEvent(MIDI.KEY_DOWN, notes)
    events.forEach(e => {
      const deferred = () => Promise.resolve(this._midiHook(e))
      this._queuedActions.push(deferred)
    })
    return this
  }

  keyUp(notes: Note[] | string[]) {
    const events = noteToMidiEvent(MIDI.KEY_UP, notes)
    events.forEach(e => {
      const deferred = () => Promise.resolve(this._midiHook(e))
      this._queuedActions.push(deferred)
    })
    return this
  }

  keyPress(notes: Note[] | string[]) {
    this.keyDown(notes)
    this.keyUp(notes)
    return this
  }

  wait(delay: number) {
    const deferred = () => new Promise((resolve) => setTimeout(resolve, delay))
    this._queuedActions.push(deferred)
    return this
  }

  async play() {
    return this._queuedActions.reduce((p, c) => {
      return p.then(async () => await c())
    }, Promise.resolve())
  }
}

const noteToMidiEvent = (flag: number, notes: Note[] | string[], velocity: number = 50): WebMidi.MIDIMessageEvent[] => {
  const consolidateType = (n: Note | string): Note => {
    if (typeof n === 'string') return Note.of(n)
    return n
  }
  return notes.map(consolidateType)
    .map(standardizeNote)
    .map(findNoteOnKeyboard)
    .map((i) => MIDI_KEYBOARD_OFFSET + i)
    .map((i) => {
      const array = new Uint8Array(3)
      array[0] = flag // Flag
      array[1] = i    // Note
      array[2] = velocity   // Velocity
      return {
        ...new Event('midi'),
        receivedTime: new Date().getTime(),
        data: array
      } as WebMidi.MIDIMessageEvent
    })
}
