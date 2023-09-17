import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import {Button, CssBaseline, Stack, SwipeableDrawer} from "@mui/material";
import createEmotionCache from "@/lib/createEmotionCache";
import {EmotionCache} from "@emotion/cache";
import {CacheProvider} from "@emotion/react";
import React, {createContext, useState} from "react";
import {useAudio} from "@/lib/hooks";
import {styled, ThemeProvider} from "@mui/system";
import LogoSvg from "@/components/images/Icon";
import {Menu} from "@mui/icons-material";
import theme from "@/styles/theme";
import Link from "next/link";
import {MidiInputSelector} from "@/components/midi-input-selector/MidiInputSelector";
import MidiPiano from "@/lib/music/MidiPiano";
import {MidiSoundSelector} from "@/components/midi-sound-selector/MidiSoundSelector";
import MIDIInput = WebMidi.MIDIInput;


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
  width: 30vw;
`

const clientSideEmotionCache = createEmotionCache()
export const MidiPianoContext = createContext(new MidiPiano())
export const MidiInputContext = createContext<WebMidi.MIDIInput | undefined>(undefined)
export const WebAudioContext = createContext<AudioContext | undefined>(undefined)
export const InstrumentContext = createContext<string>("electric_grand_piano")

type AppPropsWithEmotionCache = AppProps & { emotionCache?: EmotionCache }
export default function App({
                              Component,
                              pageProps,
                              emotionCache = clientSideEmotionCache,
                            }: AppPropsWithEmotionCache) {

  const [midiPiano, setMidiPiano] = useState<MidiPiano>(new MidiPiano())
  const [midiContext, setMidiContext] = useState<WebMidi.MIDIInput | undefined>(undefined)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [sample, setSample] = useState('electric_grand_piano')
  const audioContext = useAudio()

  function handleInputSelected(id: string, input: MIDIInput) {
    setMidiContext(input)
    setMidiPiano(new MidiPiano(input))
  }

  return <>
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme={true}/>
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
              <InstrumentContext.Provider value={sample}>
                <Component {...pageProps} />
              </InstrumentContext.Provider>
            </WebAudioContext.Provider>
          </MidiInputContext.Provider>
        </MidiPianoContext.Provider>
        <NavDrawer
          data-testid={'SettingsDrawer'}
          anchor={'left'}
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onOpen={() => setIsDrawerOpen(true)}>
          <Stack direction={'column'} spacing={2} padding={1}>
            <Link href={'/'} onClick={() => setIsDrawerOpen(false)}>
              <NavButton variant={'contained'}>Home</NavButton>
            </Link>
            <Link href={'/progression'} onClick={() => setIsDrawerOpen(false)}>
              <NavButton variant={'contained'}>Progression</NavButton>
            </Link>
            <Link href={'/scale'} onClick={() => setIsDrawerOpen(false)}>
              <NavButton variant={'contained'}>Scale</NavButton>
            </Link>
            <MidiInputSelector onInputSelected={handleInputSelected}/>
            <MidiSoundSelector onSampleSelected={setSample}/>
          </Stack>
        </NavDrawer>
      </ThemeProvider>
    </CacheProvider>
  </>
}
