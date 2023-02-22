import React, {useEffect, useState} from 'react'
import {diatonicChords, MusicKey, notesInKey} from "@/lib/music/Circle";
import {useInterval, useVexflowContext} from "@/lib/utility";
import {styled} from "@mui/system";
import {notesToStaveNote} from "@/lib/musicToVex";
import {ChordSymbol, ModifierContext, Stave, TickContext} from "vexflow";
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
  const [endTime, setEndTime] = useState<number | undefined>(undefined)
  const [staveGroup, setStaveGroup] = useState<SVGElement | undefined>(undefined)
  const [currentBeat, setCurrentBeat] = useState<number>(0)

  const STAVE_WIDTH = 200
  const BPM = options?.bpm || 120
  const BPS = 60 / BPM

  useInterval(() => {
    if (!startTime) return
    const time = new Date().getTime()
    const secondsSinceStart = (time - startTime) / 1000
    const beatsSinceStart = Math.round(secondsSinceStart * BPS * 4) + 1
    setCurrentBeat(beatsSinceStart)
  }, 100)

  useEffect(() => {
    const numMeasures = diatonicChords(musicKey).length
    const measure = Math.round(currentBeat / numMeasures)
    const beat = currentBeat % numMeasures
  }, [staveGroup, currentBeat, musicKey])

  useEffect(() => {
    if (context === undefined || startTime !== undefined) return
    const group: SVGElement = context.openGroup(undefined, 'key-exercise-group')

    diatonicChords(musicKey).forEach((chord, i) => {
      const staveX = (width / 2) + (STAVE_WIDTH * i)
      const stave = new Stave(staveX, 25, STAVE_WIDTH)
      stave.setContext(context).draw()

      const notes = placeOnOctave(4, notesInKey(chord.notes(), musicKey));
      const staveNote = notesToStaveNote(notes, {chord})

      const tickContext = new TickContext()
      tickContext.addTickable(staveNote)
      tickContext.preFormat().setX((STAVE_WIDTH / 4) - (parseInt(staveNote.fontSize) * 2.5))

      const modifierContext = new ModifierContext()
      modifierContext.addModifier(staveNote.getModifiersByType('ChordSymbol').pop() as ChordSymbol)
      modifierContext.preFormat()

      staveNote.setContext(context).setStave(stave)
      staveNote.draw()
    })

    context.closeGroup()
    setStaveGroup(group)

    // Current beat indicator
    context.setLineWidth(20)
    context.setFillStyle('rgba(75, 150, 150, 0.5)')
    context.fillRect(width / 2, 0, 20, height)
  }, [context, height, musicKey, startTime, width])

  function start() {
    if (staveGroup === undefined) return

    const chords = diatonicChords(musicKey)

    staveGroup.addEventListener('transitionend', (e) => {
      onEnd?.call(onEnd, {
        musicKey
      })
    })

    staveGroup.addEventListener('transitionstart', (e) => setStartTime(new Date().getTime()))

    const SECONDS_PER_MEASURE = 4 * BPS
    const transitionTime = SECONDS_PER_MEASURE * (chords.length);
    const translationX = STAVE_WIDTH * (chords.length)
    staveGroup.style.transition = `transform ${transitionTime}s linear`
    staveGroup.style.transform = `translate(-${translationX}px, 0)`
  }

  return <>
    <p>Current Beat: {currentBeat}</p>
    <VexflowOutput onClick={() => start()}>
      <div id={'key-exercise-vexflow-output'}/>
    </VexflowOutput>
  </>
}

const VexflowOutput = styled('div')({
  overflow: 'hidden',
})
