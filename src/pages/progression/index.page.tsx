import React, {useEffect, useState} from 'react'
import {styled} from "@mui/material/styles";
import {InteractiveStaff} from "@/components/interactivestaff/InteractiveStaff";
import MIDIPiano from "@/lib/music/MIDIPiano";
import {getKey} from "@/lib/music/Circle";

const StyledRoot = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100vw',
  height: '100vh',
})

const StaffContainer = styled('div')({
  width: '90vw',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid red'
})

const ErrorMessage = styled('div')({
  color: 'red',
  fontWeight: 500,
  fontSize: '2rem',
  fontFamily: ['Arial', "sans-serif"],
})

export default function ProgressionPage({}) {
  const [hasLoadedMidi, setHasLoadedMidi] = useState(false)
  const [midiPiano, setMidiPiano] = useState<MIDIPiano | undefined>(undefined)
  const [midiAccess, setMidiAccess] = useState<WebMidi.MIDIAccess | undefined>(undefined)
  const [isCompatibleBrowser, setIsCompatibleBrowser] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    if (hasLoadedMidi) return
    try {
      navigator.requestMIDIAccess().then((m) => {
        setIsCompatibleBrowser(true)
        setMidiAccess(m)
        if (m.inputs.size === 0) return
        else setMidiAccess(m) // Update our access to store new inputs
        const firstInputKey = m.inputs.keys().next().value
        const firstInput = m.inputs.get(firstInputKey)
        if (firstInput) {
          const piano = new MIDIPiano(firstInput)
          setMidiPiano(piano)
          setHasLoadedMidi(true)
          setErrorMessage("")
        } else throw Error(`${firstInputKey} not a valid MIDI input id!`)
      })
    } catch (e: any) {
      if (e instanceof TypeError) {
        setIsCompatibleBrowser(false)
      } else if (e?.message.includes(" not a valid MIDI input id!"))
        console.debug(e)
    }
  }, [hasLoadedMidi, midiPiano])

  useEffect(() => {
    if (!midiAccess && !isCompatibleBrowser) {
      setErrorMessage("Your browser does not provide MIDI access, please use Chrome, Safari or Edge on a desktop or android device")
    } else if (!midiPiano && midiAccess && isCompatibleBrowser) {
      setErrorMessage("Your browser supports MIDI access, but a MIDI device could not be found")
    }
  }, [isCompatibleBrowser, midiPiano, midiAccess])

  return <StyledRoot>
    <h1>Progression Page</h1>
    {errorMessage &&
      <ErrorMessage>{errorMessage}</ErrorMessage>
    }
    {!errorMessage &&
      <StaffContainer>
        {midiPiano && <InteractiveStaff midiPiano={midiPiano} musicKey={getKey('Gb', 'Major')}/>}
      </StaffContainer>
    }
  </StyledRoot>
}
