import React, {useState} from 'react'
import {styled} from "@mui/material/styles";
import _ from "lodash";
import NotesExercise, {ExerciseResult} from "@/components/exercises/NotesExercise";
import {MAJOR_SCALE, SCALES} from "@/lib/music/Scale";
import {findNoteOnKeyboard, KEYBOARD, Note, placeOnOctave} from "@/lib/music/Note";
import {notesToStaveNote} from "@/lib/musicToVex";


interface Props {
  numOctaves?: number
  numNotesPerMeasure?: number
  bpm?: number
}

export default function ScalePage({numOctaves, numNotesPerMeasure, bpm}: Props) {
  const [timesPlayed, setTimesPlayed] = useState(0)
  const [scale, setScale] = useState(MAJOR_SCALE)
  const [rootNote, setRootNote] = useState(Note.of('C'))

  const rootIndex = findNoteOnKeyboard(rootNote.withOctave(1))
  const scaleNotesWithoutOctave = _.range(0, numOctaves || 3)
    .flatMap(_ => scale.semitonesFromRoot.map(semi => KEYBOARD[rootIndex + semi]))
    .map(n => n.withOctave(undefined))

  const measures = _.chain(placeOnOctave(3, scaleNotesWithoutOctave))
    .map(note => notesToStaveNote([note]))
    .chunk(numNotesPerMeasure || 8)
    .value()

  function reset(r: ExerciseResult) {
    setTimesPlayed(timesPlayed + 1)
    setScale(_.sample(SCALES)!)
  }

  return <StyledRoot>
    <h1>Scale Page</h1>
    <p>Times Played: {timesPlayed}</p>

    <div className={'buttons'}>

    </div>

    <NotesExercise key={`${rootNote}-${scale.name}`} measures={measures} options={{bpm}} onEnd={reset}/>
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
