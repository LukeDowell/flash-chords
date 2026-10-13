'use client'

import React, {useEffect, useState} from 'react';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent
} from "@mui/material";
import {getMidiAccess} from "@/lib/midi/midi-access";
import MIDIConnectionEvent = WebMidi.MIDIConnectionEvent;
import MIDIInput = WebMidi.MIDIInput;

interface Props {
  onInputSelected?: (id: string, input: MIDIInput) => any
}

const MIDI_UNAVAILABLE_MESSAGE = 'Unable to access MIDI devices. Web MIDI requires a Chromium browser such as Chrome or Edge.'

export const MidiInputSelector = ({onInputSelected}: Props) => {
  const [inputs, setInputs] = useState<MIDIInput[]>([])
  const [selectedInput, setSelectedInput] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  // MIDIInputs are complex objects, and the useEffect equality check gets messed up;
  // a joined string of ids is stable across renders with the same devices
  const inputIds = inputs.map(i => i.id).sort().join(',')

  const handleInputSelected = (selectedName: string, availableInputs: MIDIInput[] = inputs) => {
    let inputProbably = Array.from(availableInputs).find((input) => input.name === selectedName)
    if (inputProbably === undefined) {
      inputProbably = Array.from(availableInputs).find((input) => input.id === selectedName)
    }
    if (inputProbably === undefined) {
      setErrorMessage('Selected ID that does not exist!')
      return
    }
    setSelectedInput(selectedName)
    setErrorMessage('')
    onInputSelected?.call(onInputSelected, selectedName, inputProbably)
  }

  useEffect(() => {
    const abortController = new AbortController()
    getMidiAccess().then((midiAccess) => {
      midiAccess.addEventListener(
        'statechange',
        (connectionEvent: MIDIConnectionEvent) => {
          setSelectedInput('')
          setInputs([])
        },
        {signal: abortController.signal}
      )
    }).catch(() => setErrorMessage(MIDI_UNAVAILABLE_MESSAGE))
    return () => abortController.abort('cleanup')
  }, [])

  useEffect(() => {
    getMidiAccess().then((midiAccess) => {
      const tempInputs: MIDIInput[] = []
      for (let [id, input] of midiAccess.inputs) {
        tempInputs.push(input)
      }

      setInputs(tempInputs)
      setErrorMessage('')
      if (selectedInput === '' && tempInputs.length > 0) {
        // Pass tempInputs rather than relying on the inputs state, which is
        // still the pre-refresh (possibly empty) list in this render's closure
        handleInputSelected(tempInputs[0].name || tempInputs[0].id, tempInputs)
      }
    }).catch(() => setErrorMessage(MIDI_UNAVAILABLE_MESSAGE))
  }, [inputIds, selectedInput])

  return <FormControl error={errorMessage !== ''}>
    <InputLabel id="midi-input-label">MIDI Input</InputLabel>
    <Select
      defaultValue={""}
      value={selectedInput}
      onChange={(e: SelectChangeEvent) => handleInputSelected(e.target.value)}
      input={<OutlinedInput label="MIDI Input"/>}
      variant={"filled"}>
      {
        inputs.map((input) => (
          <MenuItem key={input.name || input.id} value={input.name || input.id}>
            {input.name || input.id}
          </MenuItem>
        ))
      }
    </Select>
    {errorMessage !== '' && <FormHelperText>{errorMessage}</FormHelperText>}
  </FormControl>
}
