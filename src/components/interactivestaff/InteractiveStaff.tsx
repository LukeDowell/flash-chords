import React, {useEffect} from "react"
import MIDIPiano from "@/lib/music/MIDIPiano";
import {FChord, FKey, getKey} from "@/lib/music/Circle";
import {ChordSymbol, Formatter, Renderer, Stave, StaveNote, Voice} from "vexflow";
import {Note, placeOnOctave} from "@/lib/music/Note";

interface Props {
  midiPiano: MIDIPiano,
  musicKey?: FKey,
  chords?: FChord[]
}

export function InteractiveStaff(props: Props) {
  const {
    midiPiano,
    musicKey = getKey('C', 'Major'),
    chords = [
      new FChord(Note.of('Db'), 'Major'),
      new FChord(Note.of('Eb'), 'Minor'),
      new FChord(Note.of('Ab'), 'Major'),
      new FChord(Note.of('Db'), 'Major'),
    ]
  } = props

  useEffect(() => {
    // Grab div and wipe it
    const renderDiv: HTMLDivElement = document.getElementById('vexflow-output') as HTMLDivElement
    renderDiv.innerHTML = ''

    // Set up renderer and drawing context
    const renderer = new Renderer(renderDiv, Renderer.Backends.SVG)
    const context = renderer.getContext()
    context.resize(1000, 250)
    context.scale(1.5, 1.5)

    // Build a stave
    const stave = new Stave(10, 10, 500)
    stave.addClef('treble').addTimeSignature('4/4')
      .addKeySignature(musicKey.root.withOctave(undefined).toString())

    // Build notes
    const staveNotes = chords.map(chord => {
      const notes = chord.notesInKey(musicKey)
      const symbol = new ChordSymbol().setFontSize(14).addGlyphOrText(notes[0].withOctave(undefined).toString())
      const formattedNotes = placeOnOctave(4, notes).map(n => `${n.root.concat(n.accidental?.symbol || "")}/${n.octave}`)
      const staveNote = new StaveNote({keys: formattedNotes, duration: 'q'});
      staveNote.addModifier(symbol)
      return staveNote
    })

    const voice = new Voice({num_beats: 4, beat_value: 4})
    voice.addTickables(staveNotes)

    new Formatter().joinVoices([voice]).format([voice], 400)
    stave.setContext(context).draw()
    voice.draw(context, stave)
  }, [musicKey, chords])

  return <div id={'vexflow-output'} />
}
