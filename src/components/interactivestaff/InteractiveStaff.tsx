'use client'

import React, {useEffect, useState} from "react"
import {getKey, MusicKey, notesInKey} from "@/lib/music/Circle";
import {Formatter, Renderer, Stave, Voice} from "vexflow";
import {Note, placeOnOctave} from "@/lib/music/Note";
import {useWindowSize} from "@/lib/react/hooks";
import {Chord} from "@/lib/music/Chord";
import {notesToStaveNote} from "@/lib/vexMusic";


type Result = {

  /** Instant that the game started */
  gameStartTime: number,

  /** Array of Note + instant-note-was-played tuples */
  notesPlayed: Array<[Note, number]>,
}

type Config = {
  beatsPerMinute?: number
}

interface Props {
  musicKey?: MusicKey,
  chords?: Chord[],
  chordVoicings?: Array<Note[]>
  callback?: (r: Result) => any,
  config?: Config
}

export function InteractiveStaff(props: Props) {
  const {
    musicKey = getKey('C', 'Major'),
    chords = [],
    chordVoicings = [],
    config = {
      beatsPerMinute: props?.config?.beatsPerMinute || 60,
    }
  } = props

  const [windowWidth, windowHeight] = useWindowSize()
  const [gameStartTime, setGameStartTime] = useState<number | undefined>(undefined)

  useEffect(() => {
    // Grab div and wipe it
    const renderDiv: HTMLDivElement = document.getElementById('vexflow-output') as HTMLDivElement
    renderDiv.innerHTML = ''

    // Set up renderer and drawing context
    const renderer = new Renderer(renderDiv, Renderer.Backends.SVG)
    const context = renderer.getContext()
    context.resize(windowWidth - (windowWidth / 18), windowHeight / 4)
    context.scale(1.3, 1.3)

    // Build a stave
    const keySignatureStaveSize = windowWidth / 8
    const staveMarginTop = 75
    const keySignatureStave = new Stave(0, staveMarginTop, keySignatureStaveSize)
    keySignatureStave.addClef('treble').addTimeSignature('4/4')
      .addKeySignature(musicKey.root.withOctave(undefined).toString())
    keySignatureStave.setContext(context).draw()

    // Additional stave per chord
    chords?.forEach((c: Chord, i) => {
      const staveWidth = keySignatureStaveSize * (i + 1)
      const chordStave = new Stave(staveWidth, staveMarginTop, windowWidth / 8)
      chordStave.setContext(context).draw()

      const chordVoicing = chordVoicings[i - 1]
      const staveNotes = (chordVoicing && chordVoicing.length > 0)
        ? notesToStaveNote(chordVoicing, {fillStyle: 'green', chord: c})
        : notesToStaveNote(placeOnOctave(4, notesInKey(c.notes(), musicKey)), {chord: c})

      const voice = new Voice({numBeats: 4, beatValue: 4})
      voice.addTickables([staveNotes])

      new Formatter().joinVoices([voice]).format([voice], staveWidth)

      voice.draw(context, chordStave)
    })
  }, [musicKey, chords, windowWidth, windowHeight, chordVoicings])

  return <div id={'vexflow-output'}/>
}
