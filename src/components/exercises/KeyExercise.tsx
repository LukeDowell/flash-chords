import React, {useEffect, useState} from 'react'
import {diatonicChords, MusicKey, notesInKey} from "@/lib/music/Circle";
import {useVexflowContext} from "@/lib/utility";
import {styled} from "@mui/system";
import {notesToStaveNote} from "@/lib/musicToVex";
import {Formatter, Stave, Voice} from "vexflow";
import {placeOnOctave} from "@/lib/music/Note";

export interface KeyExerciseResult {
  musicKey: MusicKey,
}

interface KeyExerciseOptions {
  bpm?: number
}

interface Props {
  musicKey: MusicKey,
  options?: KeyExerciseOptions

  /** Callback when exercise is complete */
  onEnd?: (r: KeyExerciseResult) => any
}

/**
 * An exercise is a play-once interactive music game. It will contain
 * some kind of staff, listen to user input, and return a result when
 * the game is complete
 *
 * The key exercise has the user play a key up and down across some number of octaves
 */
export default function KeyExercise({musicKey, onEnd, options}: Props) {
  const [startTime, setStartTime] = useState<number | undefined>(undefined)
  const [context, [width, height]] = useVexflowContext('key-exercise-vexflow-output')

  useEffect(() => {
    if (context === undefined) return

    const staveWidth = 200
    diatonicChords(musicKey).forEach((chord, i) => {
      context.save()
      const staveX = (width / 2) + (staveWidth * i)
      const stave = new Stave(staveX, 25, staveWidth)
      stave.setContext(context).draw()

      const notes = placeOnOctave(4, notesInKey(chord.notes(), musicKey));
      const staveNote = notesToStaveNote(notes, {chordSymbolText: chord.toString()})
      const voice = new Voice({num_beats: 4, beat_value: 4})
      voice.addTickables([staveNote])
      new Formatter().joinVoices([voice]).format([voice])

      voice.draw(context, stave)
      context.restore()
    })

    // Sight-reading indicator
    context.save()
    context.setLineWidth(20)
    context.setFillStyle('rgba(100, 100, 100, 0.5)')
    context.fillRect(width / 2, 0, 20, height)
    context.restore()
  }, [context])

  return <VexflowOutput>
    <div id={'key-exercise-vexflow-output'}/>
  </VexflowOutput>
}

const VexflowOutput = styled('div')({})
