import React, {useContext, useEffect} from "react"
import {FChord, FKey, getKey} from "@/lib/music/Circle";
import {ChordSymbol, Formatter, Renderer, Stave, StaveNote, Voice} from "vexflow";
import {Note, placeOnOctave} from "@/lib/music/Note";
import {MIDIPianoContext} from "@/pages/_app.page";
import _ from "lodash";
import {chordToSymbol} from "@/lib/music/ChordSymbol";
import {useWindowSize} from "@/lib/utility";
import {styled} from "@mui/material/styles";


type Result = {

  /** Instant that the game started */
  gameStartTime: number,

  /** Array of Note + instant-note-was-played tuples */
  notesPlayed: Array<[Note, number]>,


}

interface Props {
  musicKey?: FKey,
  chords?: FChord[],
  callback?: (r: Result) => any,
}

export function InteractiveStaff({
                                   musicKey = getKey('C', 'Major'),
                                   chords = []
                                 }: Props) {
  const piano = useContext(MIDIPianoContext)
  const [windowWidth, windowHeight] = useWindowSize()

  useEffect(() => {
    const callback = (activeNotes: Note[]) => {

    }

    const id = _.uniqueId('practice-page-')
    piano.setListener(id, callback)
    return () => piano.removeListener(id)
  }, [piano])

  useEffect(() => {
    // Grab div and wipe it
    const renderDiv: HTMLDivElement = document.getElementById('vexflow-output') as HTMLDivElement
    renderDiv.innerHTML = ''

    // Set up renderer and drawing context
    const renderer = new Renderer(renderDiv, Renderer.Backends.SVG)
    const context = renderer.getContext()
    context.resize(windowWidth - (windowWidth / 18), windowWidth / 4)
    context.scale(1.5, 1.5)

    // Build a stave
    const keySignatureStaveSize = windowWidth / 8
    const keySignatureStave = new Stave(0, 0, keySignatureStaveSize)
    keySignatureStave.addClef('treble').addTimeSignature('4/4')
      .addKeySignature(musicKey.root.withOctave(undefined).toString())
    keySignatureStave.setContext(context).draw()

    // Additional stave per chord
    chords?.forEach((c, i) => {
      const staveWidth = keySignatureStaveSize * (i + 1)
      const chordStave = new Stave(staveWidth, 0, windowWidth / 8)
      chordStave.setContext(context).draw()

      const notes = c.notesInKey(musicKey)
      const symbol = new ChordSymbol().setFontSize(14).addGlyphOrText(chordToSymbol(c))
      const formattedNotes = placeOnOctave(4, notes).map(n => `${n.root.concat(n.accidental?.symbol || "")}/${n.octave}`)
      const staveNote = new StaveNote({keys: formattedNotes, duration: 'w', auto_stem: true});
      staveNote.addModifier(symbol)

      const voice = new Voice({num_beats: 4, beat_value: 4})
      voice.addTickables([staveNote])

      new Formatter().joinVoices([voice]).format([voice], staveWidth)
      voice.draw(context, chordStave)
    })


  }, [musicKey, chords, windowHeight, windowWidth])

  return <VexflowOutput id={'vexflow-output'} />
}

const VexflowOutput = styled('div')({
  border: '1px solid black'
})
