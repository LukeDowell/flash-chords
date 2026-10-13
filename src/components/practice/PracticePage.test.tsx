import React from 'react';
import {act, screen, waitFor} from "@testing-library/react";
import PracticePage, {generateChordFromSettings, STAFF_HISTORY_LIMIT, staffHistory} from "@/components/practice/PracticePage";
import {Note} from "@/lib/music/Note";
import {DEFAULT_PRACTICE_SETTINGS} from "@/components/settings/Settings";
import _ from "lodash";
import {findNoteOnKeyboard, toNote} from "@/lib/music/Note";
import {midiRender} from "../../jest.setup";
import {getKey} from "@/lib/music/Circle";
import {Chord} from "@/lib/music/Chord";
import {NoteEmitter} from "../../note-emitter";
import {MIDI, MIDI_KEYBOARD_OFFSET} from "@/lib/music/MidiPiano";
import userEvent from "@testing-library/user-event";
import {MidiInputContext} from "@/lib/react/contexts";


describe("the practice page", () => {
  it('should render', () => {
    midiRender(<PracticePage/>)
  })

  it('should display feedback when the user correctly voices a chord', async () => {
    const [midiPiano, midiCallback, screen] = midiRender(<PracticePage initialChord={new Chord('C', 'Major')}
                                                                       initialKey={getKey('C', 'Major')}/>)

    await act(async () => {
      await new NoteEmitter(midiCallback)
        .keyDown(['C4', 'E4', 'G4'])
        .play()
    })

    await waitFor(() => expect(screen.getByTestId('CheckIcon')).toBeInTheDocument())
  })

  it('should show the correct notes for a chord if the user fails to enter a valid voicing in time', async () => {
    const initialChord = new Chord('C', 'Major')
    const settings = {
      timerEnabled: true,
      timerMilliseconds: 100
    }
    const [p, i, screen] = midiRender(<PracticePage initialChord={initialChord} initialKey={getKey('C', 'Major')}
                                                    initialSettings={settings}/>)

    await waitFor(() => {
      expect(screen.getByText("C, E, G")).toBeInTheDocument()
    })
  })

  it('should fail a chord voicing after the timer ends', async () => {
    const settings = {
      timerEnabled: true,
      timerMilliseconds: 1
    }

    midiRender(<PracticePage initialChord={new Chord('B#', 'Diminished')} initialSettings={settings}/>)

    await waitFor(() => expect(screen.getByTestId("B#dim-invalid-voicing")).toBeInTheDocument())
  })

  it('should be able to successfully play a chord via a midi piano', async () => {
    const events = ['B', 'D', 'F'].map(toNote).map(findNoteOnKeyboard).map((n): Partial<WebMidi.MIDIMessageEvent> => {
      return {
        data: Uint8Array.of(MIDI.KEY_DOWN, n + MIDI_KEYBOARD_OFFSET, 100)
      }
    })

    const [_, pianoEmitter, screen] = midiRender(<PracticePage initialChord={new Chord('B', 'Diminished')}
                                                               initialKey={getKey('C', 'Major')}/>)

    await act(() => events.forEach((e) => pianoEmitter.call(e, e as WebMidi.MIDIMessageEvent)))
    await waitFor(() => expect(screen.getByTestId('CheckIcon')).toBeInTheDocument())
  })

  it('should show which chord tones are held, which are missing, and which held notes are wrong', async () => {
    const [piano, midiCallback, screen] = midiRender(<PracticePage initialChord={new Chord('C', 'Major')}
                                                                   initialKey={getKey('C', 'Major')}/>)

    await act(async () => {
      await new NoteEmitter(midiCallback)
        .keyDown(['C4', 'D4'])
        .play()
    })

    await waitFor(() => {
      expect(screen.getByTestId('note-feedback-C-held')).toBeInTheDocument()
      expect(screen.getByTestId('note-feedback-E-missing')).toBeInTheDocument()
      expect(screen.getByTestId('note-feedback-G-missing')).toBeInTheDocument()
      expect(screen.getByTestId('note-feedback-D-wrong')).toBeInTheDocument()
    })
  })

  it('should prompt the user to connect a midi keyboard when no input is selected', () => {
    midiRender(<PracticePage/>)
    expect(screen.getByText(/connect a midi keyboard/i)).toBeInTheDocument()
  })

  it('should not prompt for a midi keyboard once an input is connected', () => {
    midiRender(
      <MidiInputContext.Provider value={{} as WebMidi.MIDIInput}>
        <PracticePage/>
      </MidiInputContext.Provider>
    )
    expect(screen.queryByText(/connect a midi keyboard/i)).not.toBeInTheDocument()
  })

  it('should let the user open and change the practice settings', async () => {
    midiRender(<PracticePage/>)
    const user = userEvent.setup()

    await user.click(screen.getByLabelText('open-settings'))
    expect(screen.getByText('Chord Settings')).toBeInTheDocument()

    const majorCheckbox = screen.getByRole('checkbox', {name: 'Major'})
    expect(majorCheckbox).toBeChecked()
    await user.click(majorCheckbox)
    expect(majorCheckbox).not.toBeChecked()
  })
})

describe('staff history', () => {
  it('should cap the rendered history at the most recent results, newest first', () => {
    const results = _.range(20).map(i => ({
      chord: new Chord('C', 'Major'),
      key: getKey('C', 'Major'),
      validNotes: [new Note('C', undefined, i)]
    }))

    const recent = staffHistory(results)

    expect(recent).toHaveLength(STAFF_HISTORY_LIMIT)
    expect(recent[0].validNotes[0].octave).toBe(19)
    expect(recent[recent.length - 1].validNotes[0].octave).toBe(20 - STAFF_HISTORY_LIMIT)
  })

  it('should leave shorter histories intact', () => {
    const results = _.range(3).map(i => ({
      chord: new Chord('C', 'Major'),
      key: getKey('C', 'Major'),
      validNotes: [new Note('C', undefined, i)]
    }))

    expect(staffHistory(results).map(r => r.validNotes[0].octave)).toEqual([2, 1, 0])
  })
})

describe('generating chords from settings', () => {
  it('should only generate major triads when every other quality is disabled', () => {
    const settings = {
      ...DEFAULT_PRACTICE_SETTINGS,
      seventhsEnabled: false,
      minorEnabled: false,
      augmentedEnabled: false,
      diminishedEnabled: false,
      halfDiminishedEnabled: false,
      dominantEnabled: false,
    }

    _.range(50).forEach(() => {
      const [chord] = generateChordFromSettings(settings)
      expect(chord.quality).toBe('Major')
      expect(chord.seventhQuality).toBeNull()
    })
  })

  it('should only generate dominant seventh chords when every other quality is disabled', () => {
    const settings = {
      ...DEFAULT_PRACTICE_SETTINGS,
      triadsEnabled: false,
      minorEnabled: false,
      majorEnabled: false,
      augmentedEnabled: false,
      diminishedEnabled: false,
      halfDiminishedEnabled: false,
    }

    _.range(50).forEach(() => {
      const [chord] = generateChordFromSettings(settings)
      expect(chord.quality).toBe('Major')
      expect(chord.seventhQuality).toBe('Minor')
    })
  })

  it('should not generate chords with flat or sharp roots when disabled', () => {
    const settings = {
      ...DEFAULT_PRACTICE_SETTINGS,
      flatRootsEnabled: false,
      sharpRootsEnabled: false,
    }

    _.range(50).forEach(() => {
      const [chord] = generateChordFromSettings(settings)
      expect(chord.rootNote.accidental).toBeUndefined()
    })
  })
})
