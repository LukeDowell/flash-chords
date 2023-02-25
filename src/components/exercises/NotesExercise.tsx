import React, {useContext, useEffect, useState} from 'react'
import {useInstrument, useInterval, useVexflowContext} from "@/lib/hooks";
import {css, keyframes, styled} from "@mui/system";
import {Beam, ChordSymbol, ModifierContext, Stave, StaveNote, TickContext} from "vexflow";
import {Note} from "@/lib/music/Note";
import {MidiPianoContext} from "@/pages/_app.page";
import MidiPiano from "@/lib/music/MidiPiano";
import _ from "lodash";
import {staveNoteToNotes} from "@/lib/vexMusic";

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

const durationToFraction = (duration: string) => {
  if (duration.includes('32')) return 0.03125
  else if (duration.includes('16')) return 0.0625
  else if (duration.includes('8')) return 0.125
  else if (duration.includes('q')) return 0.25
  else if (duration.includes('h')) return 0.5
  else return 1
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
  const clicker = useInstrument('woodblock')
  const piano: MidiPiano = useContext(MidiPianoContext)
  const [startTime, setStartTime] = useState<number | undefined>(undefined)
  const [endTime, setEndTime] = useState<number | undefined>(undefined)
  const [staveGroup, setStaveGroup] = useState<SVGElement | undefined>(undefined)
  const [measures, setMeasures] = useState<Measure[]>([])

  const STAVE_WIDTH = options?.staveWidth || 300
  const STAVE_MARGIN = STAVE_WIDTH / 20
  const BPM = options?.bpm || 60
  const BEAT_DELAY_MS = 60_000 / BPM

  // Set up stave and render SVGs
  useEffect(() => {
    if (context === undefined || startTime) return

    const group: SVGElement = context.openGroup(undefined, 'notes-exercise-group')

    const measures = inputMeasures.map((staveNotes, measureIndex) => {
      const staveX = (contextWidth / 2) + (STAVE_WIDTH * measureIndex)
      const stave = new Stave(staveX, 25, STAVE_WIDTH)
      stave.setContext(context).draw()

      const formattedNotes = staveNotes.map((staveNote, i) => {
        const tickContext = new TickContext()
        const modifierContext = new ModifierContext()
        const measureWidth = STAVE_WIDTH - (STAVE_MARGIN * 2)
        const measureDuration = staveNotes.slice(0, i).reduce((c, n) => c + durationToFraction(n.getDuration()), 0)
        const notePositionInMeasure = measureWidth * measureDuration
        const staveNotePosition = STAVE_MARGIN + notePositionInMeasure
        tickContext.addTickable(staveNote)
        tickContext.preFormat().setX(staveNotePosition)
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
    if (startTime) return

    setStartTime(new Date().getTime())
    const playClick = () => clicker?.play('C6', undefined, {duration: 250})
    setInterval(playClick, BEAT_DELAY_MS)

    const getX = (measureIndex: number, beatIndex: number, duration: string) => {
      const adjustedWidth = STAVE_WIDTH - (STAVE_MARGIN * 2)
      const durationAdjustedPosition = adjustedWidth * durationToFraction(duration) * (beatIndex)
      return (STAVE_WIDTH * measureIndex) + STAVE_MARGIN + durationAdjustedPosition
    }

    measures.forEach((notes, measureIndex) => _.range(0, 4).forEach(beatIndex => {
      setTimeout(() => {
        staveGroup.style.transition = css`transform ${BEAT_DELAY_MS}ms linear`.styles
        staveGroup.style.transform = css`translate(-${getX(measureIndex, beatIndex, 'q')}px, 0)`.styles

        staveGroup.addEventListener('transitionend', () => {
          console.log(`M: ${measureIndex + 1} B: ${beatIndex + 1}`)
        })
      }, (BEAT_DELAY_MS * 4 * measureIndex) + (BEAT_DELAY_MS * beatIndex))
    }))

    const onExerciseEnd = () => {
      setEndTime(new Date().getTime())
      onEnd?.call(onEnd, {})
      clicker?.stop()
    }

    setTimeout(onExerciseEnd, (BEAT_DELAY_MS * 3) + (BEAT_DELAY_MS * 4 * measures.length))

    const beatIndicator = document.getElementById('vf-beat-indicator')
    if (beatIndicator) {
      beatIndicator.style.animation = css`${beatAnimation} ${BEAT_DELAY_MS / 2}ms alternate infinite`.styles
    }
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
