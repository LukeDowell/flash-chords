import React, {useContext, useEffect, useState} from 'react'
import {diatonicChords, isValidVoicingForChord, MusicKey, notesInKey} from "@/lib/music/Circle";
import {useInterval, useVexflowContext} from "@/lib/hooks";
import {styled} from "@mui/system";
import {notesToStaveNote} from "@/lib/vexMusic";
import {ChordSymbol, ModifierContext, Stave, TickContext} from "vexflow";
import {Note, placeOnOctave} from "@/lib/music/Note";
import {MidiPianoContext} from "@/pages/_app.page";
import _ from "lodash";
import MidiPiano, {NoteEvent} from "@/lib/music/MidiPiano";

export interface KeyExerciseResult {
  musicKey: MusicKey,
}

interface KeyExerciseOptions {
  bpm?: number
}

interface Props {
  musicKey: MusicKey,
  options?: KeyExerciseOptions
  onEnd?: (r: KeyExerciseResult) => any
}

export default function DiatonicChordExercise({musicKey, onEnd, options}: Props) {
  const [context, [width, height]] = useVexflowContext('key-exercise-vexflow-output')
  const piano: MidiPiano = useContext(MidiPianoContext)
  const [startTime, setStartTime] = useState<number | undefined>(undefined)
  const [endTime, setEndTime] = useState<number | undefined>(undefined)
  const [staveGroup, setStaveGroup] = useState<SVGElement | undefined>(undefined)
  const [measureVoicings, setMeasureVoicings] = useState<Array<[number, Note[]]>>([])

  const STAVE_WIDTH = 200
  const NUM_BEATS_PER_MEASURE = 4
  const BEAT_WIDTH = STAVE_WIDTH / NUM_BEATS_PER_MEASURE
  const BPM = options?.bpm || 120
  const BEAT_DELAY_MS = 60_000 / BPM
  const SECONDS_PER_MEASURE = NUM_BEATS_PER_MEASURE * BEAT_DELAY_MS / 1000

  // Set up piano note listener
  useEffect(() => {
    if (!staveGroup) return
    const id = _.uniqueId('key-exercise-')
    piano.addSubscriber(id, (noteEvent: NoteEvent, activeNotes: Note[]) => {
      const matrix = new WebKitCSSMatrix(window.getComputedStyle(staveGroup).transform)
      const currentMeasureIndex = Math.floor(matrix.m41 * -1 / STAVE_WIDTH)
      if (diatonicChords(musicKey).some(c => isValidVoicingForChord(activeNotes, c))) {
        setMeasureVoicings([[currentMeasureIndex, activeNotes], ...measureVoicings])
      }
    })
    return () => piano.removeSubscriber(id)
  }, [measureVoicings, musicKey, piano, staveGroup])

  // Set up stave and render SVGs
  useEffect(() => {
    if (context === undefined || startTime) return

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
    const indicatorWidth = 20
    context.setLineWidth(20)
    context.setFillStyle('rgba(75, 150, 150, 0.5)')
    context.fillRect(width / 2 - indicatorWidth + BEAT_WIDTH, 0, indicatorWidth, height)
  }, [BEAT_WIDTH, context, endTime, height, musicKey, startTime, width])

  // Feedback rendering
  useInterval(() => {
    if (!startTime || !staveGroup || endTime) return

    const matrix = new WebKitCSSMatrix(window.getComputedStyle(staveGroup).transform)
    const currentMeasureIndex = Math.floor(matrix.m41 * -1 / STAVE_WIDTH) // Why on earth is it .m41 for X, I don't know anything about matrices
    const currentBeatIndex = Math.floor((matrix.m41 * -1 % STAVE_WIDTH) / BEAT_WIDTH)

    const noteElements = staveGroup.getElementsByClassName("vf-stavenote")
    for (let i = 0; i < noteElements.length; i++) {
      if (i > currentMeasureIndex) continue
      const notes = noteElements.item(i) as SVGElement
      if (notes && measureVoicings.some(([vi, vn]) => i === vi)) notes.style.fill = 'green'
      else if (notes && i < currentMeasureIndex) notes.style.fill = 'red'
      else if (notes && i === currentMeasureIndex && currentBeatIndex > 0) notes.style.fill = 'red'
    }
  }, 100)

  function start() {
    if (staveGroup === undefined) return
    const chords = diatonicChords(musicKey)

    staveGroup.addEventListener('transitionstart', (e) => setStartTime(new Date().getTime()))
    staveGroup.addEventListener('transitionend', (e) => {
      setEndTime(new Date().getTime())
      onEnd?.call(onEnd, {musicKey})
    })

    const transitionTime = SECONDS_PER_MEASURE * (chords.length);
    const translationX = STAVE_WIDTH * (chords.length)
    staveGroup.style.transition = `transform ${transitionTime}s linear`
    staveGroup.style.transform = `translate(-${translationX}px, 0)`
  }

  return <VexflowOutput onClick={() => start()}>
    <div id={'key-exercise-vexflow-output'}/>
  </VexflowOutput>
}

const VexflowOutput = styled('div')`
  overflow: hidden;
`
