import {useContext, useEffect, useLayoutEffect, useRef, useState} from 'react'
import {Renderer, SVGContext} from "vexflow";
import {Soundfont} from 'smplr'
import _ from "lodash";
import {MidiPianoContext, WebAudioContext} from "@/lib/react/contexts";

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)

  // Remember the latest callback if it changes.
  useEffect(() => savedCallback.current = callback, [callback])

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (!delay && delay !== 0) {
      return
    }
    const id = setInterval(() => savedCallback.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}

// https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85?permalink_comment_id=3570933#gistcomment-3570933
export const useSSRLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : () => {
}

export function useWindowSize() {
  const [size, setSize] = useState([600, 800]);
  useSSRLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

export function useVexflowContext(outputId: string, width?: number, height?: number): [SVGContext | undefined, [number, number]] {
  const [context, setContext] = useState<SVGContext | undefined>(undefined)
  const [size, setSize] = useState<[number, number]>([0, 0])
  const [windowWidth, windowHeight] = useWindowSize()

  useEffect(() => {
    const outputDiv = document.getElementById(outputId) as HTMLDivElement
    if (outputDiv === null) throw new Error(`Unable to find context output element with id=${outputId}`)
    outputDiv.innerHTML = ''

    const renderer = new Renderer(outputDiv, Renderer.Backends.SVG)
    const contextWidth = width ? width : windowWidth
    const contextHeight = height ? height : 165

    renderer.resize(contextWidth, contextHeight)
    const ctx = renderer.getContext()

    setContext(ctx as SVGContext)
    setSize([contextWidth, contextHeight])
  }, [windowWidth, windowHeight, outputId, width, height])

  return [context, size]
}

// https://github.com/joshwcomeau/use-sound/issues/22#issuecomment-737727148
const events = ['mousedown', 'touchstart', 'keydown', 'mousemove'];

export function useInteraction() {
  const [ready, setReady] = useState(false)
  const listener = useRef(() => {
    if (!ready) setReady(true)
  })

  useEffect(() => {
    if (!ready) events.forEach((event) => document.addEventListener(event, listener.current))
    else events.forEach((event) => document.removeEventListener(event, listener.current))
  }, [ready]);

  return ready;
}

export function useAudio(): AudioContext | undefined {
  const [audio, setAudio] = useState<AudioContext>()
  const interacted = useInteraction()

  useSSRLayoutEffect(() => {
    const create = async () => new AudioContext()
    if (interacted) create().then(setAudio)
  }, [interacted])

  return audio
}

export function useInstrument(sample = 'electric_grand_piano', listenToMidi?: boolean) {
  const [instrument, setInstrument] = useState<Soundfont | undefined>(undefined)
  const audioContext = useContext(WebAudioContext)
  const piano = useContext(MidiPianoContext)

  useSSRLayoutEffect(() => {
    if (!audioContext) return
    const player = new Soundfont(audioContext, {instrument: sample})
    const listenerId = _.uniqueId(`instrument-${sample}`)

    if (listenToMidi) {
      piano.addSubscriber(listenerId, (noteEvent) => {
        const {note, midiNote, velocity, flag, time} = noteEvent
        switch (flag) {
          case "keydown":
            audioContext.resume().then(() => player.start({note: midiNote, velocity}))
            break
          case "keyup":
            player.stop({stopId: midiNote})
            break
        }
      })
    }

    setInstrument(player)
    return () => {
      piano.removeSubscriber(listenerId)
      setInstrument(undefined)
    }
  }, [sample, audioContext])

  return instrument
}
