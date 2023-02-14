import MidiPianoV2 from './MidiPianoV2'
import {MIDI, MIDI_KEYBOARD_OFFSET} from "@/lib/music/MIDIPiano";

describe('a midi piano', () => {
  it('should receive a key down event', () => {
    const events = [13, 16, 20, 23].map((n): Partial<WebMidi.MIDIMessageEvent> => {
      return {data: Uint8Array.of(MIDI.KEY_DOWN, n + MIDI_KEYBOARD_OFFSET, 100)}
    })

    const piano = new MidiPianoV2()
  })

  it('should receive a key down event', () => {

  })

  it('should receive a key pressed event', () => {

  })
})
