import React, {useEffect, useState} from 'react'
import {diatonicChords, MusicKey, notesInKey} from "@/lib/music/Circle";
import {useVexflowContext} from "@/lib/utility";
import {styled} from "@mui/system";
import {notesToStaveNote} from "@/lib/musicToVex";

export interface KeyExerciseResult {
  musicKey: MusicKey,
}

interface Props {
  musicKey: MusicKey,

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
export default function KeyExercise({musicKey, onEnd}: Props) {
  const [startTime, setStartTime] = useState<number | undefined>(undefined)
  const context = useVexflowContext('key-exercise-vexflow-output')

  useEffect(() => {
    diatonicChords(musicKey).forEach(chord => {

      const stavesNotes = notesToStaveNote(notesInKey(chord.notes(), musicKey), {chordSymbolText: chord.toString()})
    })

  }, [context])

  return <VexflowOutput id={'key-exercise-vexflow-output'}/>
}

const VexflowOutput = styled('div')({
  border: '1px solid black'
})
