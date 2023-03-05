import React, {useState} from 'react'
import {styled} from "@mui/material/styles";
import _ from "lodash";
import NotesExercise, {ExerciseResult} from "@/components/exercises/NotesExercise";
import {MAJOR_SCALE, SCALES_FOR_ALL_NOTES} from "@/lib/music/Scale";
import {findNoteOnKeyboard, KEYBOARD, Note, placeOnOctave} from "@/lib/music/Note";
import {notesToStaveNote} from "@/lib/vexMusic";
import {StaveNote} from "vexflow";
import {Autocomplete, TextField} from "@mui/material";


const StyledRoot = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;

  .scale-settings {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 2rem;
    margin-top: 1.15rem;
  }

  .scale-autocomplete {
    width: 40vw;
    min-width: 200px;
  }
`

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
    const noteAndScale = _.sample(SCALES_FOR_ALL_NOTES)!
    setScale(noteAndScale.scale)
    setRootNote(noteAndScale.note)
  }

  return <StyledRoot>
    <div className={'scale-settings'}>
      <Autocomplete
        id={'scale-autocomplete'}
        className={'scale-autocomplete'}
        options={SCALES_FOR_ALL_NOTES}
        getOptionLabel={(o) => `${o.note.toString()} ${o.scale.name}`}
        renderInput={(params) => <TextField {...params} label={"Scale"}/>}
        value={SCALES_FOR_ALL_NOTES.find(ns => _.isEqual(rootNote, ns.note) && _.isEqual(scale, ns.scale))!}
        onChange={(e, value) => {
          if (value) {
            setScale(value.scale)
            setRootNote(value.note)
          }
        }}
      />
    </div>
    <NotesExercise key={`${rootNote}-${scale.name}`} inputMeasures={measures} options={{bpm}} onEnd={reset}/>
  </StyledRoot>
}
