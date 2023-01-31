import React, {useEffect} from "react"
import {Formatter, Renderer, Stave, StaveNote, Voice} from "vexflow";
import {Chord, generateRandomChord, requiredNotesForChord} from "@/lib/music/Chord";
import {NATURAL, placeOnOctave} from "@/lib/music/Note";
import {symanticFormat} from "@/lib/music/Keys";

interface Props {
  chord: Chord
}

export function Staff({chord = generateRandomChord()}: Props) {
  const requiredNotes = symanticFormat(requiredNotesForChord(chord), chord)
  const laidOnKeyboard = placeOnOctave(4, requiredNotes)
  const vexNotes = laidOnKeyboard
    .filter(n => n.accidental !== NATURAL)
    .map(n => `${n.root}${n.accidental?.symbol || ""}/${n.octave || ""}`)

  useEffect(() => {
    if (vexNotes.length === 0) return

    const element = document.getElementById('vexflow-output') as HTMLDivElement
    element.innerHTML = ""

    const renderer = new Renderer(element, Renderer.Backends.SVG)
    const context = renderer.getContext()
    renderer.resize(500, 500)

    const stave = new Stave(10, 40, 400)
    try {
      stave.addClef('treble').addTimeSignature('4/4').addKeySignature(`${chord.root}${chord.accidental?.symbol || ""}`)
      stave.setContext(context).draw()
    } catch (e) {
      console.log(`Error in staff! Probably a bad key signature, womp womp. ${e}`)
      return
    }

    const notes = [
      new StaveNote({keys: vexNotes, duration: "w"})
    ]

    const voice = new Voice({num_beats: 4, beat_value: 4})
    voice.addTickables(notes)

    new Formatter().joinVoices([voice]).format([voice], 350)
    voice.draw(context, stave)
  }, [chord])

  return <div id={'vexflow-output'}/>
}
