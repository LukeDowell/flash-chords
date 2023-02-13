import {KEYBOARD, Note} from "./Note";

const MIDI = {
  KEY_DOWN: 144,
  KEY_UP: 128,
  HEARTBEAT: 254
}

export const MIDI_KEYBOARD_OFFSET = 21

type NoteEvent = "keydown" | "keyup" | "keypressed"

type NoteHistory = {
  val: Note,

  event: NoteEvent,

  time: number
}

export default class MidiPianoV2 {
  private _currentActiveNotes: Note[] = []
  private _noteHistory: NoteHistory[] = []

  constructor(midiInput?: WebMidi.MIDIInput) {
    midiInput?.addEventListener("midimessage", (e: WebMidi.MIDIMessageEvent) => {
      const note = KEYBOARD[e.data[1] - MIDI_KEYBOARD_OFFSET]
      const velocity = e.data[2]
      const flag = e.data[0]
      this._processMIDIEvent(note, velocity, flag)
    })
  }

  private _processMIDIEvent(note: Note, velocity: number, flag: number) {
    if (flag === MIDI.HEARTBEAT) return

    if (flag === MIDI.KEY_DOWN && velocity !== 0) this._currentActiveNotes.push(note)
    else if (flag === MIDI.KEY_UP || (flag === MIDI.KEY_DOWN && velocity === 0))
    else throw new Error(`Unknown MIDI flag ${flag}`)
  }
}
