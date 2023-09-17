import {KEYBOARD, Note} from "./Note";
import _ from "lodash";

export const MIDI = {
  KEY_DOWN: 144,
  KEY_UP: 128,
  HEARTBEAT: 254
}

export const MIDI_KEYBOARD_OFFSET = 21


export type NoteEvent = {
  note: Note,

  midiNote: number,

  velocity: number,

  flag: "keydown" | "keyup",

  time: number
}

export type NoteSubscriber = (event: NoteEvent, currentActiveNotes: Note[], history: NoteEvent[]) => any

export default class MidiPiano {
  private _currentActiveNotes: Note[] = []
  private readonly _noteHistory: NoteEvent[] = []
  private _subscribers: Map<string, NoteSubscriber> = new Map()

  constructor(midiInput?: WebMidi.MIDIInput) {
    midiInput?.addEventListener("midimessage", this._processMIDIEvent.bind(this))
  }

  private _processMIDIEvent(midiEvent: WebMidi.MIDIMessageEvent) {
    const midiNote = midiEvent.data[1]
    const note = KEYBOARD[midiNote - MIDI_KEYBOARD_OFFSET]
    const velocity = midiEvent.data[2]
    const midiFlag = midiEvent.data[0]

    if (midiFlag === MIDI.HEARTBEAT) return
    else if (midiFlag !== MIDI.KEY_DOWN && midiFlag !== MIDI.KEY_UP) return

    const keyFlag: "keyup" | "keydown" = midiFlag === MIDI.KEY_UP || (midiFlag === MIDI.KEY_DOWN && velocity === 0) ? "keyup" : "keydown"
    if (keyFlag === "keyup") {
      this._currentActiveNotes = this._currentActiveNotes.filter(n => !_.isEqual(n, note))
    } else if (keyFlag === "keydown") {
      this._currentActiveNotes.push(note)
    }

    const event = {
      note,
      midiNote,
      velocity,
      flag: keyFlag,
      time: new Date().getTime()
    }

    this._noteHistory.push(event)
    this._notifySubscribers(event)
  }

  addSubscriber(key: string, subscriber: NoteSubscriber) {
    this._subscribers.set(key, subscriber)
  }

  removeSubscriber(key: string) {
    this._subscribers.delete(key)
  }

  private _notifySubscribers(event: NoteEvent) {
    this._subscribers.forEach((v, k) => v.call(v, event, this._currentActiveNotes, this._noteHistory))
  }
}
