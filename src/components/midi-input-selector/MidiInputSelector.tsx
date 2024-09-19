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
import MIDIConnectionEvent = WebMidi.MIDIConnectionEvent;
import MIDIInput = WebMidi.MIDIInput;

interface Props {
  onInputSelected?: (id: string, input: MIDIInput) => any
}

export const MidiInputSelector = ({onInputSelected}: Props) => {
  const [inputs, setInputs] = useState<MIDIInput[]>([])
  const [selectedInput, setSelectedInput] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const inputIds = inputs.map(i => i.id).sort() // MIDIInputs are complex objects, and the useEffect equality check gets messed up

  useEffect(() => {
    const abortController = new AbortController()
    navigator.requestMIDIAccess().then((midiAccess) => {
      midiAccess.addEventListener(
        'statechange',
        (connectionEvent: MIDIConnectionEvent) => {
          console.log('connectionEvent', connectionEvent)
          setSelectedInput('')
          setInputs([])
        },
        {signal: abortController.signal}
      )
    })
    return () => abortController.abort('cleanup')
  })

  useEffect(() => {
    navigator.requestMIDIAccess().then((midiAccess) => {
      const tempInputs: MIDIInput[] = []
      for (let [id, input] of midiAccess.inputs) {
        tempInputs.push(input)
      }

      setInputs(tempInputs)
      setErrorMessage('')
      if (selectedInput === '' && tempInputs.length > 0) {
        handleInputSelected(tempInputs[0].name || tempInputs[0].id)
      }
    })
  }, [inputIds, selectedInput])

  const handleInputSelected = (selectedName: string) => {
    let inputProbably = Array.from(inputs).find((input) => input.name === selectedName)
    if (inputProbably === undefined) {
      inputProbably = Array.from(inputs).find((input) => input.id === selectedName)
    }
    if (inputProbably === undefined) {
      setErrorMessage('Selected ID that does not exist!')
      return
    }
    setSelectedInput(selectedName)
    setErrorMessage('')
    onInputSelected?.call(onInputSelected, selectedName, inputProbably)
  }

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
    {errorMessage !== '' && <FormHelperText>Error</FormHelperText>}
  </FormControl>
}
