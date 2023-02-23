import React, {useContext, useEffect, useState} from 'react'
import {useInterval, useVexflowContext} from "@/lib/utility";
import {styled} from "@mui/system";
import {ChordSymbol, ModifierContext, Stave, StaveNote, TickContext} from "vexflow";
import {Note} from "@/lib/music/Note";
import {MIDIPianoContext} from "@/pages/_app.page";
import MIDIPiano from "@/lib/music/MIDIPiano";
import _ from "lodash";
import {staveNoteToNotes} from "@/lib/musicToVex";

export interface ExerciseResult {
}

interface ExerciseOptions {
  bpm?: number
}

type Measures = StaveNote[][] // measure x notes on that measure, evenly divided

interface Props {
  measures: Measures
  options?: ExerciseOptions
  onEnd?: (r: ExerciseResult) => any
}

export default function NotesExercise({measures, onEnd, options}: Props) {
  const [context, [width, height]] = useVexflowContext('notes-exercise-vexflow-output')
  const piano: MIDIPiano = useContext(MIDIPianoContext)
  const [startTime, setStartTime] = useState<number | undefined>(undefined)
  const [endTime, setEndTime] = useState<number | undefined>(undefined)
  const [staveGroup, setStaveGroup] = useState<SVGElement | undefined>(undefined)
  const [measureVoicings, setMeasureVoicings] = useState<Note[][][]>(_.fill([[[]]], [[]], 0, measures.length)) // measure x beat x voicing

  const STAVE_WIDTH = 200
  const NUM_BEATS_PER_MEASURE = 4
  const BEAT_WIDTH = STAVE_WIDTH / NUM_BEATS_PER_MEASURE
  const BPM = options?.bpm || 120
  const BEAT_DELAY_MS = 60_000 / BPM
  const SECONDS_PER_MEASURE = NUM_BEATS_PER_MEASURE * BEAT_DELAY_MS / 1000

  // Set up stave and render SVGs
  useEffect(() => {
    if (context === undefined || startTime) return

    const group: SVGElement = context.openGroup(undefined, 'notes-exercise-group')

    measures.forEach((staveNotes, i) => {
      const staveX = (width / 2) + (STAVE_WIDTH * i)
      const stave = new Stave(staveX, 25, STAVE_WIDTH)
      stave.setContext(context).draw()

      staveNotes.forEach((staveNote, i) => {
        const tickContext = new TickContext()
        const modifierContext = new ModifierContext()

        tickContext.addTickable(staveNote)
        tickContext.preFormat().setX((STAVE_WIDTH / NUM_BEATS_PER_MEASURE * i) - (parseInt(staveNote.fontSize) * 2.5))

        staveNote.getModifiersByType('ChordSymbol').filter((cs): cs is ChordSymbol => true)
          .forEach(modifierContext.addModifier)

        modifierContext.preFormat()

        staveNote.setContext(context).setStave(stave)
        staveNote.draw()
      })
    })

    context.closeGroup()
    setStaveGroup(group)

    // Current beat indicator
    const indicatorWidth = 20
    context.setLineWidth(20)
    context.setFillStyle('rgba(75, 150, 150, 0.5)')
    context.fillRect(width / 2 - indicatorWidth + BEAT_WIDTH, 0, indicatorWidth, height)
  }, [BEAT_WIDTH, context, endTime, height, measures, startTime, width])

  // Feedback rendering
  useInterval(() => {
    if (!startTime || !staveGroup || endTime) return

    const currentBeat = getCurrentBeat(staveGroup, BEAT_WIDTH)
    const currentMeasure = Math.floor(currentBeat / NUM_BEATS_PER_MEASURE)
    const beatInsideMeasure = currentBeat % NUM_BEATS_PER_MEASURE
    const measureVoicing = measureVoicings[currentMeasure][beatInsideMeasure] || []

    staveNoteElements(staveGroup).forEach((element, i) => {
      if (i > currentMeasure) return
      else if (measureVoicing.length > 0) element.style.fill = 'green'
      else if (i < currentMeasure) element.style.fill = 'red'
      else if (i === currentMeasure && beatInsideMeasure > (i % NUM_BEATS_PER_MEASURE)) element.style.fill = 'red'
    })
  }, 100)

  // Set up piano note listener
  useEffect(() => {
    if (!staveGroup) return

    function midiPianoCallback(activeNotes: Note[]) {
      if (!staveGroup) return
      const currentBeat = getCurrentBeat(staveGroup, BEAT_WIDTH)
      const currentMeasure = Math.floor(currentBeat / NUM_BEATS_PER_MEASURE)
      const beatInsideMeasure = currentBeat % NUM_BEATS_PER_MEASURE
      const staveNotesInMeasure = measures[currentMeasure]
      const currentStaveNote = staveNotesInMeasure[beatInsideMeasure]
        ? staveNotesInMeasure[beatInsideMeasure]
        : _.last(staveNotesInMeasure)
      const requiredNotes = currentStaveNote ? staveNoteToNotes(currentStaveNote) : []
      const isValidVoicing = requiredNotes.every(rn => activeNotes.some(an => an.withOctave(undefined).isEquivalent(rn)))
      if (isValidVoicing) {
        const newVoicings = measureVoicings.splice(0)
        newVoicings[currentMeasure][beatInsideMeasure] = activeNotes
        setMeasureVoicings(newVoicings)
      }
    }

    const id = _.uniqueId('key-exercise-')
    piano.setListener(id, midiPianoCallback)
    return () => piano.removeListener(id)
  }, [BEAT_WIDTH, measureVoicings, measures, piano, staveGroup])

  const start = () => {
    if (staveGroup === undefined) return

    staveGroup.addEventListener('transitionstart', (e) => setStartTime(new Date().getTime()))
    staveGroup.addEventListener('transitionend', (e) => {
      setEndTime(new Date().getTime())
      onEnd?.call(onEnd, {})
    })

    const transitionTime = SECONDS_PER_MEASURE * (measures.length);
    const translationX = STAVE_WIDTH * (measures.length)
    staveGroup.style.transition = `transform ${transitionTime}s linear`
    staveGroup.style.transform = `translate(-${translationX}px, 0)`
  }

  return <VexflowOutput onClick={start}>
    <div id={'notes-exercise-vexflow-output'}/>
  </VexflowOutput>
}

const VexflowOutput = styled('div')({
  overflow: 'hidden',
})

const staveNoteElements = (staveGroup: SVGElement): SVGElement[] => {
  const elementsCollection = staveGroup.getElementsByClassName("vf-stavenote")
  const elements = []
  for (let i = 0; i < elementsCollection.length; i++) {
    elements.push(elementsCollection.item(i) as SVGElement)
  }
  return elements
}

const getCurrentBeat = (staveGroup: SVGElement, beatWidth: number): number => {
  const matrix = new WebKitCSSMatrix(window.getComputedStyle(staveGroup).transform)
  return Math.floor(matrix.m41 * -1 / beatWidth)
}
