import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import {CssBaseline} from "@mui/material";
import createEmotionCache from "@/lib/createEmotionCache";
import {EmotionCache} from "@emotion/cache";
import {CacheProvider} from "@emotion/react";
import React, {createContext, useEffect, useState} from "react";
import MidiPiano from "@/lib/music/MidiPiano";
import {useAudio} from "@/lib/hooks";

const clientSideEmotionCache = createEmotionCache()
export const MidiPianoContext = createContext(new MidiPiano())
export const MidiInputContext = createContext<WebMidi.MIDIInput | undefined>(undefined)
export const WebAudioContext = createContext<AudioContext | undefined>(undefined)

export default function App({
                              Component,
                              emotionCache = clientSideEmotionCache,
                              pageProps
                            }: AppProps & { emotionCache: EmotionCache }) {

  const [hasLoadedMidi, setHasLoadedMidi] = useState(false)
  const [midiPiano, setMidiPiano] = useState<MidiPiano>(new MidiPiano())
  const [midiContext, setMidiContext] = useState<WebMidi.MIDIInput | undefined>(undefined)
  const [midiAccess, setMidiAccess] = useState<WebMidi.MIDIAccess | undefined>(undefined)
  const [isCompatibleBrowser, setIsCompatibleBrowser] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
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
      <CssBaseline/>
      {errorMessage.length > 0 &&
        <h3>{errorMessage}</h3>
      }
      <MidiPianoContext.Provider value={midiPiano}>
        <MidiInputContext.Provider value={midiContext}>
          <WebAudioContext.Provider value={audioContext}>
            <Component {...pageProps} />
          </WebAudioContext.Provider>
        </MidiInputContext.Provider>
      </MidiPianoContext.Provider>
    </CacheProvider>
  </>
}
