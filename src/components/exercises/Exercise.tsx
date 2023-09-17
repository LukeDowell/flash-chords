import {styled} from "@mui/system";
import React, {useContext, useEffect, useState} from "react";
import {useVexflowContext} from "@/lib/hooks";
import {MidiInputContext} from "@/pages/_app.page";
import {MusicKey} from "@/lib/music/Circle";
import MidiPiano, {NoteEvent, NoteSubscriber} from "@/lib/music/MidiPiano";
import _ from "lodash";
import {Note} from "@/lib/music/Note";

type ExerciseConfiguration = {
  treble: string[][],
  bass: string[][],
  timeSignature: string,
  key: MusicKey
}

interface Props {
  config: ExerciseConfiguration,
  onEnd: () => any,

}

const VexflowOutput = styled('div')`
  overflow: hidden;
`

export default function Exercise({
                                   config: {
                                     treble,
                                     bass,
                                     timeSignature,
                                     key
                                   },
                                   onEnd
                                 }: Props) {
  const [context, [contextWidth, contextHeight]] = useVexflowContext('exercise-vexflow-output')
  const midiInput = useContext(MidiInputContext)
  const [midiPiano, setMidiPiano] = useState<MidiPiano | undefined>(undefined)

  useEffect(() => {
    const piano = new MidiPiano(midiInput)
    setMidiPiano(piano)
    const subscriberId = _.uniqueId('exercise')
    piano.addSubscriber(subscriberId, noteSubscriber)
    return () => piano.removeSubscriber(subscriberId)
  }, [midiInput])

  const noteSubscriber: NoteSubscriber = (event: NoteEvent, currentActiveNotes: Note[], history: NoteEvent[]) => {
    const {note, velocity, flag, time} = event
  }

  return <VexflowOutput>
    <div id={'exercise-vexflow-output'}/>
  </VexflowOutput>
}
