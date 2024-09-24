'use client'

import React, {useEffect, useState} from 'react'
import {styled} from "@mui/material/styles";
import _ from "lodash";
import {MAJOR_SCALE, SCALES_FOR_ALL_NOTES} from "@/lib/music/Scale";
import {findNoteOnKeyboard, KEYBOARD, Note, placeOnOctave} from "@/lib/music/Note";
import {noteToEasyScore} from "@/lib/vexMusic";
import {Autocomplete, TextField} from "@mui/material";
import Exercise from "@/components/exercises/Exercise";
import {getKey} from "@/lib/music/Circle";


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

export default function AltScalePage() {
  const numOctaves = 3
  const [scale, setScale] = useState(MAJOR_SCALE)
  const [rootNote, setRootNote] = useState(Note.of('C'))
  const [bassVoice, setBassVoice] = useState('')
  const [trebleVoice, setTrebleVoice] = useState('')

  useEffect(() => {
    const rootIndex = findNoteOnKeyboard(rootNote.withOctave(1))
    const scaleNotesWithoutOctave = _.range(0, numOctaves)
      .flatMap(_ => scale.semitonesFromRoot.map(semi => KEYBOARD[rootIndex + semi]))
      .map(n => n.withOctave(undefined))

    const scaleNotes = placeOnOctave(3, [rootNote, ...scaleNotesWithoutOctave])
    const scaleNotesGoingDown = _.reverse(placeOnOctave(3, [rootNote, ...scaleNotesWithoutOctave]))
    scaleNotes.push(...scaleNotesGoingDown)

    setBassVoice(scaleNotes.map((n) => n.withOctave(n.octave! - 1)).map((n) => noteToEasyScore(n, "q")).join(', '))
    setTrebleVoice(scaleNotes.map((n) => noteToEasyScore(n, "8")).join(', '))
  }, [scale, rootNote])

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
    {(bassVoice.length > 0 || trebleVoice.length > 0) &&
      <Exercise musicKey={getKey('C')} bassVoice={bassVoice} trebleVoice={trebleVoice}/>
    }
  </StyledRoot>
}
