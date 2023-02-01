import React, {useEffect} from "react"
import {Formatter, Renderer, RuntimeError, Stave, StaveNote, TextNote, Voice} from "vexflow";
import {Chord, generateRandomChord, requiredNotesForChord, toSymbol} from "@/lib/music/Chord";
import {NATURAL, Note, placeOnOctave} from "@/lib/music/Note";
import {symanticFormat} from "@/lib/music/Keys";

interface Props {
  chord: Chord
}

export function Staff({chord = generateRandomChord()}: Props) {
  const requiredNotes = symanticFormat(requiredNotesForChord(chord), chord)
  const laidOnKeyboard = placeOnOctave(4, requiredNotes)
  const vexNotes = laidOnKeyboard
    .map(n => n.accidental === NATURAL ? new Note(n.root, undefined, n.octave) : n)
    .map(n => `${n.root}${n.accidental?.symbol || ""}/${n.octave || ""}`)

  useEffect(() => {
    if (vexNotes.length === 0) return

    const element = document.getElementById('vexflow-output') as HTMLDivElement
    element.innerHTML = ""

    const renderer = new Renderer(element, Renderer.Backends.SVG)
    const context = renderer.getContext()
    renderer.resize(400, 150)

    let stave = new Stave(10, 40, 350)
    try {
      stave.addClef('treble')
        .addTimeSignature('4/4')
        .addKeySignature(`${chord.root}${chord.accidental?.symbol || ""}`)
      stave.setContext(context).draw()
    } catch (e) {
      if (e instanceof RuntimeError && e.message.includes('BadKeySignature')) {
        stave = new Stave(10, 40, 400)
        stave.addClef('treble')
          .addTimeSignature('4/4')
          .addKeySignature('C')
        stave.setContext(context).draw()
      } else {
        console.log(e)
        return
      }
    }

    const voice = new Voice("4/4")
    voice.addTickables([new StaveNote({keys: vexNotes, duration: "w"}),])

    new Formatter()
      .joinVoices([voice])
      .format([voice])

    voice.draw(context, stave)
  }, [chord])

  return <div id={'vexflow-output'}/>
}
