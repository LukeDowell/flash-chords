import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import {CssBaseline} from "@mui/material";
import createEmotionCache from "@/lib/createEmotionCache";
import {EmotionCache} from "@emotion/cache";
import {CacheProvider} from "@emotion/react";
import React, {createContext, useEffect, useState} from "react";
import MIDIPiano from "@/lib/music/MIDIPiano";

const clientSideEmotionCache = createEmotionCache()
export const MIDIPianoContext = createContext(new MIDIPiano())

export default function App({
                              Component,
                              emotionCache = clientSideEmotionCache,
                              pageProps
                            }: AppProps & { emotionCache: EmotionCache }) {

  const [hasLoadedMidi, setHasLoadedMidi] = useState(false)
  const [midiPiano, setMidiPiano] = useState<MIDIPiano>(new MIDIPiano())
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

  return <>
    <CacheProvider value={emotionCache}>
      <CssBaseline/>
      {errorMessage.length > 0 &&
        <h3>{errorMessage}</h3>
      }
      <MIDIPianoContext.Provider value={midiPiano}>
        <Component {...pageProps} />
      </MIDIPianoContext.Provider>
    </CacheProvider>
  </>
}
