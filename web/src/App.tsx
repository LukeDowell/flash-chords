import React, {useEffect, useState} from 'react';
import './App.css';
import MIDIPiano from "./music/MIDIPiano";
import PracticePage from "./practice/PracticePage";
import {styled} from "@mui/material";

const StyledRoot = styled('div')({
  display: "flex",
  flexDirection: "column",
  textAlign: "center",
  justifyContent: "space-between"
})

function App() {
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
        } else throw new Error(`${firstInputKey} not a valid MIDI input id!`)
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
    <PracticePage piano={midiPiano || new MIDIPiano()}/>
    {errorMessage.length > 0 &&
    <h3>{errorMessage}</h3>
    }
  </StyledRoot>
}

export default App;
