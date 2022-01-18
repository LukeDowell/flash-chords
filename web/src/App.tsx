import React, {useEffect, useState} from 'react';
import './App.css';
import {AppBar, Box, IconButton, Paper, Toolbar, Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import {Chord, MIDIPiano, Note} from "./music/Music";
import PracticePage from "./music/PracticePage";

function App() {
  const [hasLoadedMidi, setHasLoadedMidi] = useState(false)
  const [midiPiano, setMidiPiano] = useState<MIDIPiano | undefined>(undefined)
  const [midiAccess, setMidiAccess] = useState<WebMidi.MIDIAccess | undefined>(undefined)
  const [isCompatibleBrowser, setIsCompatibleBrowser] = useState(false)

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
          setMidiPiano(new MIDIPiano(firstInput))
          setHasLoadedMidi(true)
        } else throw new Error(`${firstInputKey} not a valid MIDI input id!`)
      })
    } catch (e) {
      console.error(e)
    }
  }, [hasLoadedMidi, midiPiano])

  const onValidVoicing = (activeNotes: Note[], chord: Chord) => {
    console.log(`Correctly voiced ${chord} with notes ${activeNotes}`)
  }

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
      <PracticePage piano={midiPiano} onValidVoicing={onValidVoicing}/>
      }
    </div>
  </>;
}

export default App;
