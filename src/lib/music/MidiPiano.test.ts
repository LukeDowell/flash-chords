import MidiPiano, {MIDI, NoteSubscriber} from './MidiPiano'
import {NoteEmitter} from "../../note-emitter";
import _ from "lodash";


describe('a midi piano', () => {
  it('should receive key down events', async () => {
    let midiCallback = (e: WebMidi.MIDIMessageEvent) => {
    }
    const mockedMidiInput: Partial<WebMidi.MIDIInput> = {
      addEventListener: jest.fn().mockImplementation((key: string, callback: (e: WebMidi.MIDIMessageEvent) => void) => {
        midiCallback = callback
      })
    }

    const midiPiano = new MidiPiano(mockedMidiInput as WebMidi.MIDIInput)
    const noteEmitter = new NoteEmitter(midiCallback)
    const listener: jest.Mock<NoteSubscriber> = jest.fn()
    midiPiano.addSubscriber(_.uniqueId('midi-piano-test'), listener)

    await noteEmitter.keyDown(['C4', 'D5']).play()

    expect(listener).toHaveBeenCalledTimes(2)
    expect(listener.mock.calls[0][0].note.toString()).toEqual('C4')
    expect(listener.mock.calls[0][0].flag).toEqual('keydown')
    expect(listener.mock.calls[1][0].note.toString()).toEqual('D5')
    expect(listener.mock.calls[1][0].flag).toEqual('keydown')
  })

  it('should receive key up events', async () => {
    let midiCallback = (e: WebMidi.MIDIMessageEvent) => {
    }
    const mockedMidiInput: Partial<WebMidi.MIDIInput> = {
      addEventListener: jest.fn().mockImplementation((key: string, callback: (e: WebMidi.MIDIMessageEvent) => void) => {
        midiCallback = callback
      })
    }

    const midiPiano = new MidiPiano(mockedMidiInput as WebMidi.MIDIInput)
    const noteEmitter = new NoteEmitter(midiCallback)
    const listener: jest.Mock<NoteSubscriber> = jest.fn()
    midiPiano.addSubscriber(_.uniqueId('midi-piano-test'), listener)

    await noteEmitter.keyUp(['A#3', 'G#6']).play()

    expect(listener).toHaveBeenCalledTimes(2)
    expect(listener.mock.calls[0][0].note.toString()).toEqual('A#3')
    expect(listener.mock.calls[0][0].flag).toEqual('keyup')
    expect(listener.mock.calls[1][0].note.toString()).toEqual('G#6')
    expect(listener.mock.calls[1][0].flag).toEqual('keyup')
  })

  it('should ignore note events outside the range of the keyboard', async () => {
    let midiCallback = (e: WebMidi.MIDIMessageEvent) => {
    }
    const mockedMidiInput: Partial<WebMidi.MIDIInput> = {
      addEventListener: jest.fn().mockImplementation((key: string, callback: (e: WebMidi.MIDIMessageEvent) => void) => {
        midiCallback = callback
      })
    }

    const midiPiano = new MidiPiano(mockedMidiInput as WebMidi.MIDIInput)
    const listener: jest.Mock<NoteSubscriber> = jest.fn()
    midiPiano.addSubscriber(_.uniqueId('midi-piano-test'), listener)

    midiCallback({data: Uint8Array.of(MIDI.KEY_DOWN, 5, 100)} as WebMidi.MIDIMessageEvent)
    midiCallback({data: Uint8Array.of(MIDI.KEY_DOWN, 120, 100)} as WebMidi.MIDIMessageEvent)

    expect(listener).not.toHaveBeenCalled()
  })

  it('should stop listening to its midi input when destroyed', async () => {
    let midiCallback = (e: WebMidi.MIDIMessageEvent) => {
    }
    const mockedMidiInput: Partial<WebMidi.MIDIInput> = {
      addEventListener: jest.fn().mockImplementation((key: string, callback: (e: WebMidi.MIDIMessageEvent) => void) => {
        midiCallback = callback
      }),
      removeEventListener: jest.fn()
    }

    const midiPiano = new MidiPiano(mockedMidiInput as WebMidi.MIDIInput)
    midiPiano.destroy()

    const registeredHandler = (mockedMidiInput.addEventListener as jest.Mock).mock.calls[0][1]
    expect(mockedMidiInput.removeEventListener).toHaveBeenCalledWith('midimessage', registeredHandler)
  })
})
