import React, {useContext, useEffect, useState} from 'react'
import {useAudio, useInterval, useVexflowContext} from "@/lib/hooks";
import {css, keyframes, styled} from "@mui/system";
import {Beam, ChordSymbol, ModifierContext, Stave, StaveNote, TickContext} from "vexflow";
import {Note} from "@/lib/music/Note";
import {MidiPianoContext} from "@/pages/_app.page";
import MidiPiano from "@/lib/music/MidiPiano";
import _ from "lodash";
import {staveNoteToNotes} from "@/lib/vexMusic";
import {instrument, Player} from "soundfont-player";

export interface ExerciseResult {
}

interface ExerciseOptions {
  bpm?: number,
  staveWidth?: number
}

type Measures = StaveNote[][] // measure x notes on that measure, evenly divided

interface Props {
  inputMeasures: Measures
  options?: ExerciseOptions
  onEnd?: (r: ExerciseResult) => any
}

type Measure = {
  staveNotes: StaveNote[], // beat index
  voicing: Note[][], // beat index x voicing
}

const beatAnimation = keyframes`
  from {
    transform: scale(1, 1);
  }

  to {
    transform: scale(1, .8);
  }
`

const VexflowOutput = styled('div')`
  overflow: hidden;
  ${beatAnimation};
  #vf-beat-indicator {
    transform-origin: center center;
  }
`

export default function NotesExercise({inputMeasures, onEnd, options}: Props) {
  const [context, [contextWidth, contextHeight]] = useVexflowContext('notes-exercise-vexflow-output')
  const piano: MidiPiano = useContext(MidiPianoContext)
  const [startTime, setStartTime] = useState<number | undefined>(undefined)
  const [endTime, setEndTime] = useState<number | undefined>(undefined)
  const [staveGroup, setStaveGroup] = useState<SVGElement | undefined>(undefined)
  const [measures, setMeasures] = useState<Measure[]>([])
  const [clicker, setClicker] = useState<Player | undefined>(undefined)
  const audioContext = useAudio()

  const STAVE_WIDTH = options?.staveWidth || 300
  const STAVE_MARGIN = STAVE_WIDTH / 10
  const BPM = options?.bpm || 160
  const BEAT_DELAY_MS = 60_000 / BPM

  // Set up stave and render SVGs
  useEffect(() => {
    if (context === undefined || startTime) return

    const group: SVGElement = context.openGroup(undefined, 'notes-exercise-group')

    const measures = inputMeasures.map((staveNotes, i) => {
      const staveX = (contextWidth / 2) + (STAVE_WIDTH * i)
      const stave = new Stave(staveX, 25, STAVE_WIDTH)
      stave.setContext(context).draw()

      const formattedNotes = staveNotes.map((staveNote, i) => {
        const tickContext = new TickContext()
        const modifierContext = new ModifierContext()
        const adjustedWidth = STAVE_WIDTH - (STAVE_MARGIN)
        // TODO adjust the position of the note based on the duration of all previous notes as a ratio of the measure width
        const durationAdjustedPosition = adjustedWidth / staveNotes.length * i
        const staveNotePosition = durationAdjustedPosition - (parseInt(staveNote.fontSize) * 2.5)
        tickContext.addTickable(staveNote)
        tickContext.preFormat().setX(staveNotePosition + STAVE_MARGIN)
        staveNote.getModifiersByType('ChordSymbol')
          .filter((cs): cs is ChordSymbol => true)
          .forEach(modifierContext.addModifier)
        modifierContext.preFormat()
        return staveNote
      })

      const beams = Beam.generateBeams(staveNotes)
      formattedNotes.forEach(n => n.setContext(context).setStave(stave).draw())
      beams.forEach(b => b.setContext(context).draw())
      return {staveNotes: formattedNotes, voicing: _.fill([], [], 0, formattedNotes.length)}
    })

    setMeasures(measures)
    context.closeGroup()
    setStaveGroup(group)

    // Current beat indicator
    const indicatorWidth = 20
    context.save()
    context.openGroup(undefined, 'beat-indicator')
    context.setLineWidth(20)
    context.setFillStyle('rgba(75, 150, 150, 0.5)')
    context.fillRect(contextWidth / 2, 0, indicatorWidth, contextHeight)
    context.restore()
    context.closeGroup()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]) // We only ever want to do our redraw when the context changes, nothing else matters

  // Feedback rendering
  useInterval(() => {
    if (!startTime || !staveGroup || endTime) return

    const currentMeasure = getCurrentMeasure(staveGroup, STAVE_WIDTH)
    const currentMeasureBeatWidth = STAVE_WIDTH / (measures[currentMeasure]?.staveNotes.length || 4)
    const currentBeatInMeasure = getCurrentBeatInMeasure(staveGroup, STAVE_WIDTH, currentMeasureBeatWidth)
    measures.forEach((measure, measureIndex) => {
      measure.staveNotes.forEach((staveNote, beatIndex) => {
        if (measure.voicing[beatIndex]?.length > 0) staveNote.getSVGElement()!.style.fill = 'green'
        const element = staveNote.getSVGElement()
        if (!element) return
        if (measureIndex < currentMeasure) element.style.fill = 'red'
        else if (measureIndex <= currentMeasure && currentBeatInMeasure > beatIndex) element.style.fill = 'red'
      })
    })
  }, 100)

  // Set up piano note listener
  useEffect(() => {
    if (!staveGroup) return

    function midiPianoCallback(activeNotes: Note[]) {
      if (!staveGroup) return

      const currentMeasure = getCurrentMeasure(staveGroup, STAVE_WIDTH)
      const currentMeasureBeatWidth = STAVE_WIDTH / (measures[currentMeasure]?.staveNotes.length || 4)
      const currentBeatInMeasure = getCurrentBeatInMeasure(staveGroup, STAVE_WIDTH, currentMeasureBeatWidth)

      const currentStaveNote: StaveNote | undefined = measures[currentMeasure].staveNotes[currentBeatInMeasure]
      if (!currentStaveNote) return

      const requiredNotes = currentStaveNote ? staveNoteToNotes(currentStaveNote) : []
      const isValidVoicing = requiredNotes.every(rn => activeNotes.some(an => an.withOctave(undefined).isEquivalent(rn)))
      if (isValidVoicing) {
        const newMeasures = measures.splice(0)
        newMeasures[currentMeasure].voicing[currentBeatInMeasure] = activeNotes
        setMeasures(newMeasures)
      }
    }

    const id = _.uniqueId('key-exercise-')
    piano.setListener(id, midiPianoCallback)
    return () => piano.removeListener(id)
  }, [STAVE_WIDTH, measures, piano, staveGroup])

  const start = async () => {
    if (staveGroup === undefined) return

    let click = clicker
    if (!click && audioContext) {
      click = await instrument(audioContext, 'woodblock', {soundfont: 'FluidR3_GM'})
      setClicker(click)
    }

    let clickerIntervalId: NodeJS.Timer
    staveGroup.addEventListener('transitionstart', (e) => {
      setStartTime(new Date().getTime())
      const playClick = () => click?.play('C6', undefined, {duration: 250})
      playClick()
      clickerIntervalId = setInterval(playClick, BEAT_DELAY_MS)
    })
    staveGroup.addEventListener('transitionend', (e) => {
      setEndTime(new Date().getTime())
      clearInterval(clickerIntervalId)
      onEnd?.call(onEnd, {})
      click?.stop()
    })

    const beatIndicator = document.getElementById('vf-beat-indicator')
    if (beatIndicator) {
      beatIndicator.style.animation = css`${beatAnimation} ${BEAT_DELAY_MS / 2}ms alternate infinite`.styles
    }

    // TODO Variable transition time to cross stave margin, beats don't exactly align ATM
    const measureSeconds = 4 * BEAT_DELAY_MS / 1000 // 4/4 feel
    const transitionTime = measureSeconds * (measures.length);
    const translationX = STAVE_WIDTH * (measures.length)
    staveGroup.style.transition = css`transform ${transitionTime}s linear`.styles
    staveGroup.style.transform = css`translate(-${translationX}px, 0)`.styles
  }

  return <VexflowOutput onClick={start}>
    <div id={'notes-exercise-vexflow-output'}/>
  </VexflowOutput>
}

const getCurrentTranslationValue = (staveGroup: SVGElement): number => {
  const matrix = new WebKitCSSMatrix(window.getComputedStyle(staveGroup).transform)
  return matrix.m41 * -1
}

const getCurrentBeatInMeasure = (staveGroup: SVGElement, measureWidth: number, beatWidth: number): number => {
  return Math.floor(getCurrentTranslationValue(staveGroup) % measureWidth / beatWidth)
}

const getCurrentMeasure = (staveGroup: SVGElement, measureWidth: number): number => {
  const matrix = new WebKitCSSMatrix(window.getComputedStyle(staveGroup).transform)
  return Math.floor(matrix.m41 * -1 / measureWidth)
}

const queueAnimationsOnElement = (element: Element, animations: Array<[string, number]>): Promise<any> => {
  return new Promise((resolve, reject) => {

  })
}
