import React, {useContext, useEffect} from 'react'
import {Note} from "@/lib/music/Note";
import {MIDI, MIDI_KEYBOARD_OFFSET} from "@/lib/music/MidiPiano";
import {midiRender} from "../../jest.setup";
import {MidiPianoContext} from "@/pages/_app.page";
import _ from "lodash";
import {waitFor} from "@testing-library/react";

describe("a midi piano", () => {
  it('should notify listeners exactly once', async () => {
    const mockCallbacks: jest.Mock<(a: Note[]) => void>[] = []

    function TestComponent({}) {
      const piano = useContext(MidiPianoContext)
      useEffect(() => {
        const callback = jest.fn()
        const id = _.uniqueId('test-component-')
        mockCallbacks.push(callback)
        piano.setListener(id, callback)
        return () => piano.removeListener(id)
      }, [piano])
      return <></>
    }

    _.range(0, 10).forEach(() => {
      const [_, emitter] = midiRender(<TestComponent/>)
      const event = {data: Uint8Array.of(MIDI.KEY_DOWN, MIDI_KEYBOARD_OFFSET + 1, 100)}
      emitter.call(event, event as WebMidi.MIDIMessageEvent)
    })

    await waitFor(() => mockCallbacks.every(c => expect(c).toHaveBeenCalledTimes(1)))
  })
})
