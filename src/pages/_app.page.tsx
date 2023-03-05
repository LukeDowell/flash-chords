import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import {Button, CssBaseline, Stack, SwipeableDrawer} from "@mui/material";
import createEmotionCache from "@/lib/createEmotionCache";
import {EmotionCache} from "@emotion/cache";
import {CacheProvider} from "@emotion/react";
import React, {createContext, useEffect, useState} from "react";
import MidiPiano from "@/lib/music/MidiPiano";
import {useAudio} from "@/lib/hooks";
import {styled, ThemeProvider} from "@mui/system";
import LogoSvg from "@/components/images/Icon";
import {Menu} from "@mui/icons-material";
import theme from "@/styles/theme";
import Link from "next/link";


const AppHeader = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 0 1rem 0 1rem;
  position: absolute;

  .header-image {
    margin-top: 8px;
    width: 3.5rem;
    height: 3.5rem;
  }

  .header-image:hover {
    transition: transform .25s;
    transform: scale(1.1, 1.1);
  }
`

const NavDrawer = styled(SwipeableDrawer)`
  text-align: center;
  width: 35vw;
`

const NavButton = styled(Button)`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 1rem 1rem 0 1rem;
  width: 30vw;
`

const clientSideEmotionCache = createEmotionCache()
export const MidiPianoContext = createContext(new MidiPiano())
export const MidiInputContext = createContext<WebMidi.MIDIInput | undefined>(undefined)
export const WebAudioContext = createContext<AudioContext | undefined>(undefined)

type AppPropsWithEmotionCache = AppProps & { emotionCache?: EmotionCache }
export default function App({
                              Component,
                              pageProps,
                              emotionCache = clientSideEmotionCache,
                            }: AppPropsWithEmotionCache) {

  const [hasLoadedMidi, setHasLoadedMidi] = useState(false)
  const [midiPiano, setMidiPiano] = useState<MidiPiano>(new MidiPiano())
  const [midiContext, setMidiContext] = useState<WebMidi.MIDIInput | undefined>(undefined)
  const [midiAccess, setMidiAccess] = useState<WebMidi.MIDIAccess | undefined>(undefined)
  const [isCompatibleBrowser, setIsCompatibleBrowser] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const audioContext = useAudio()

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
          const piano = new MidiPiano(firstInput)
          setMidiContext(firstInput)
          setMidiPiano(piano)
          setHasLoadedMidi(true)
          setErrorMessage("")
        } else throw new Error(`${firstInputKey} not a valid MIDI input id!`)
      })
    } catch (e: any) {
      if (e instanceof TypeError) setIsCompatibleBrowser(false)
    }
  }, [hasLoadedMidi])

  useEffect(() => {
    if (!midiAccess && !isCompatibleBrowser) {
      setErrorMessage("Your browser does not provide MIDI access, please use Chrome, Safari or Edge on a desktop or android device")
    } else if (!midiPiano && midiAccess && isCompatibleBrowser) {
      setErrorMessage("Your browser supports MIDI access, but a MIDI device could not be found")
    }
  }, [isCompatibleBrowser, midiAccess, midiPiano])

  return <>
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme={true}/>
        {errorMessage.length > 0 &&
          <h3>{errorMessage}</h3>
        }
        <AppHeader>
          <Button
            aria-label={'open-drawer'}
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
            <Menu sx={{width: '3.5rem', height: '3.5rem'}}/>
          </Button>
          <LogoSvg className={'header-image'}/>
        </AppHeader>
        <MidiPianoContext.Provider value={midiPiano}>
          <MidiInputContext.Provider value={midiContext}>
            <WebAudioContext.Provider value={audioContext}>
              <Component {...pageProps} />
            </WebAudioContext.Provider>
          </MidiInputContext.Provider>
        </MidiPianoContext.Provider>
        <NavDrawer
          data-testid={'SettingsDrawer'}
          anchor={'left'}
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onOpen={() => setIsDrawerOpen(true)}>
          <Stack direction={'column'}>
            <Link href={'/'} onClick={() => setIsDrawerOpen(false)}>
              <NavButton variant={'contained'}>Home</NavButton>
            </Link>
            <Link href={'/progression'} onClick={() => setIsDrawerOpen(false)}>
              <NavButton variant={'contained'}>Progression</NavButton>
            </Link>
            <Link href={'/scale'} onClick={() => setIsDrawerOpen(false)}>
              <NavButton variant={'contained'}>Scale</NavButton>
            </Link>
          </Stack>
        </NavDrawer>
      </ThemeProvider>
    </CacheProvider>
  </>
}
