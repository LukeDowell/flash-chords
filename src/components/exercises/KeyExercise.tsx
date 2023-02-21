import React, {useEffect, useState} from 'react'
import {diatonicChords, MusicKey, notesInKey} from "@/lib/music/Circle";
import {useVexflowContext} from "@/lib/utility";
import {styled} from "@mui/system";
import {notesToStaveNote} from "@/lib/musicToVex";
import {Stave, TickContext} from "vexflow";
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
  const [context, [width, height]] = useVexflowContext('key-exercise-vexflow-output')
  const [startTime, setStartTime] = useState<number | undefined>(undefined)
  const [staveGroup, setStaveGroup] = useState<SVGElement | undefined>(undefined)
  const staveWidth = 200

  const BPM = 60
  const BPS = BPM / 60
  const SECONDS_PER_MEASURE = Math.round(BPS * 4)

  useEffect(() => {
    if (context === undefined || startTime !== undefined) return
    const group: SVGElement = context.openGroup(undefined, 'key-exercise-group')

    diatonicChords(musicKey).forEach((chord, i) => {
      const staveX = (width / 2) + (staveWidth * i)
      const stave = new Stave(staveX, 25, staveWidth)
      stave.setContext(context).draw()

      const notes = placeOnOctave(4, notesInKey(chord.notes(), musicKey));
      const staveNote = notesToStaveNote(notes, {chordSymbolText: chord.toString()})

      const tickContext = new TickContext()
      tickContext.addTickable(staveNote)
      tickContext.preFormat().setX((staveWidth / 4) - (parseInt(staveNote.fontSize) * 2.5))
      staveNote.setContext(context).setStave(stave)
      staveNote.draw()
    })

    // Set animation
    context.closeGroup()
    setStaveGroup(group)

    context.setLineWidth(20)
    context.setFillStyle('rgba(75, 150, 150, 0.5)')
    context.fillRect(width / 2, 0, 20, height)
  }, [SECONDS_PER_MEASURE, context, height, musicKey, startTime, width])

  useEffect(() => {
    if (staveGroup === undefined) return

    staveGroup.style.transition = `transform ${SECONDS_PER_MEASURE}s linear`
    staveGroup.style.transform = `translate(-${staveWidth}px, 0)`
  }, [SECONDS_PER_MEASURE, staveGroup])

  return <VexflowOutput>
    <div id={'key-exercise-vexflow-output'}/>
  </VexflowOutput>
}

const VexflowOutput = styled('div')({
  overflow: 'hidden',
})
