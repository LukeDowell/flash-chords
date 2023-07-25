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
import MIDIConnectionEvent = WebMidi.MIDIConnectionEvent;
import MIDIInput = WebMidi.MIDIInput;
import MIDIInputMap = WebMidi.MIDIInputMap;

interface Props {
  onInputSelected?: (id: string, input: MIDIInput) => any
}

export const MidiInputSelector = ({onInputSelected}: Props) => {
  const [inputs, setInputs] = useState<MIDIInputMap>(new Map())
  const [selectedInput, setSelectedInput] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    try {
      navigator.requestMIDIAccess().then((midiAccess) => {
        setErrorMessage('')
        midiAccess.addEventListener('statechange', (connectionEvent: MIDIConnectionEvent) => {
          setInputs(new Map())
        })
        setInputs(midiAccess.inputs)

        if (inputs.size > 0) {
          const id = Array.from(inputs.keys())[0]
          setSelectedInput(id)
        }
      })
    } catch (e) {
      setErrorMessage('Unable to get list of MIDI inputs')
    }
  }, [inputs])

  const handleInputSelected = (selectedId: string) => {
    const inputProbably = Array.from(inputs).find(([id]) => selectedId === id)?.[1]
    if (inputProbably === undefined) {
      setErrorMessage('Selected ID that does not exist!')
      return
    }
    setSelectedInput(selectedId)
    onInputSelected?.call(onInputSelected, selectedId, inputProbably)
  }

  return <FormControl error={errorMessage !== ''}>
    <InputLabel id="midi-input-label">MIDI Input</InputLabel>
    <Select
      value={selectedInput}
      onChange={(e: SelectChangeEvent) => handleInputSelected(e.target.value)}
      input={<OutlinedInput label="MIDI Input"/>}
    >
      {
        Array.from(inputs).map(([id]) => (
          <MenuItem key={id} value={id}>
            {id}
          </MenuItem>
        ))
      }
    </Select>
    {errorMessage !== '' && <FormHelperText>Error</FormHelperText>}
  </FormControl>
}
