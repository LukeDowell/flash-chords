import React, {useEffect, useState} from 'react';
import './App.css';
import {AppBar, Box, Container, IconButton, Paper, Toolbar, Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import {Note} from "./music/Music";
import MIDIPiano from "./music/MIDIPiano";
import PracticePage from "./music/PracticePage";
import {Keyboard} from "./music/Keyboard";

function App() {
  const [hasLoadedMidi, setHasLoadedMidi] = useState(false)
  const [midiPiano, setMidiPiano] = useState<MIDIPiano | undefined>(undefined)
  const [midiAccess, setMidiAccess] = useState<WebMidi.MIDIAccess | undefined>(undefined)
  const [isCompatibleBrowser, setIsCompatibleBrowser] = useState(false)
  const [activeNotes, setActiveNotes] = useState<Note[]>([])

  useEffect(() => {
    if (hasLoadedMidi) return
    try {
      navigator.requestMIDIAccess().then((m) => {
        console.log("Successfully retrieved MIDIAccess")
        setIsCompatibleBrowser(true)
        setMidiAccess(m)
        if (m.inputs.size === 0) return
        else setMidiAccess(m) // Update our access to store new inputs
        const firstInputKey = m.inputs.keys().next().value
        const firstInput = m.inputs.get(firstInputKey)
        if (firstInput) {
          const piano = new MIDIPiano(firstInput)
          piano.setListener("App", setActiveNotes)
          setMidiPiano(piano)
          setHasLoadedMidi(true)
        } else throw new Error(`${firstInputKey} not a valid MIDI input id!`)
      })
    } catch (e) {
      console.error(e)
    }
  }, [hasLoadedMidi, midiPiano])

  return <>
    <Box sx={{flexGrow: 1}}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{mr: 2}}
          >
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
            Flash Chords
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
    <div className="app-content">
      {!midiAccess && !isCompatibleBrowser &&
      <Paper>
        <h1>Your browser does not provide MIDI access, please use Chrome, Safari or Edge on a desktop or android
          device</h1>
      </Paper>
      || (!midiPiano && midiAccess && isCompatibleBrowser) &&
      <Paper>
        <h1>Your browser supports MIDI access, but a MIDI device could not be found</h1>
      </Paper>
      || (midiPiano && isCompatibleBrowser) &&
      <PracticePage piano={midiPiano}/>
      }
    </div>
    <Container style={{minWidth: "fit-content"}}>
      <Keyboard activeNotes={activeNotes}/>
    </Container>
  </>;
}

export default App;
