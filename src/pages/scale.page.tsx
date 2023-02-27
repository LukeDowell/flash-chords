import React, {useContext, useState} from 'react'
import {styled} from "@mui/material/styles";
import _ from "lodash";
import NotesExercise, {ExerciseResult} from "@/components/exercises/NotesExercise";
import {MAJOR_SCALE, SCALES} from "@/lib/music/Scale";
import {findNoteOnKeyboard, KEYBOARD, Note, placeOnOctave, ROOTS} from "@/lib/music/Note";
import {notesToStaveNote} from "@/lib/vexMusic";
import {MidiPianoContext} from "@/pages/_app.page";
import {useInstrument} from "@/lib/hooks";
import {StaveNote} from "vexflow";

const NUM_NOTES_EQUAL_DURATION: Record<number, string> = {
  1: 'w',
  2: 'h',
  4: 'q',
  8: '8',
  16: '16',
  32: '32'
}

interface Props {
  numOctaves?: number
  numNotesPerMeasure?: number
  bpm?: number
}

export default function ScalePage({numOctaves, numNotesPerMeasure, bpm}: Props) {
  const instrument = useInstrument('electric_grand_piano', true)
  const [scale, setScale] = useState(MAJOR_SCALE)
  const [rootNote, setRootNote] = useState(Note.of('C'))

  const rootIndex = findNoteOnKeyboard(rootNote.withOctave(1))
  const scaleNotesWithoutOctave = _.range(0, numOctaves || 3)
    .flatMap(_ => scale.semitonesFromRoot.map(semi => KEYBOARD[rootIndex + semi]))
    .map(n => n.withOctave(undefined))

  const scaleNotes = placeOnOctave(3, [rootNote, ...scaleNotesWithoutOctave])
  const scaleNotesGoingDown = _.reverse(placeOnOctave(3, [rootNote, ...scaleNotesWithoutOctave]))
  scaleNotes.push(...scaleNotesGoingDown)

  const measureSize = numNotesPerMeasure || 8;
  const measures = _.chain(scaleNotes)
    .map(note => notesToStaveNote([note], {duration: NUM_NOTES_EQUAL_DURATION[measureSize]}))
    .chunk(measureSize)
    .map(notesInMeasure => {
      if (notesInMeasure.length !== numNotesPerMeasure) {
        const numNotes = notesInMeasure.length
        const remainingNotes = measureSize - numNotes
        const addRest = (duration: string) => notesInMeasure.push(new StaveNote({keys: ["b/4"], duration}))
        if (numNotes === remainingNotes) addRest('hr')
        else if (remainingNotes === measureSize / 4) addRest('qr')
        else if (remainingNotes === measureSize / 8) addRest('8r')
        else if (remainingNotes === measureSize / 16) addRest('16r')
        else if (remainingNotes === measureSize / 32) addRest('32r')
      }
      return notesInMeasure
    })
    .value()

  function reset(r: ExerciseResult) {
    setScale(_.sample(SCALES)!)
    setRootNote(Note.of(`${_.sample(ROOTS)}`))
  }

  return <StyledRoot>
    <h1>Scale Page</h1>
    <p>Current Scale: {`${rootNote} ${scale.name} Scale`}</p>
    <div className={'buttons'}>

    </div>

    <NotesExercise key={`${rootNote}-${scale.name}`} inputMeasures={measures} options={{bpm}} onEnd={reset}/>
  </StyledRoot>
}

const StyledRoot = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100vw',
  height: '100vh',

  '.buttons': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
})
