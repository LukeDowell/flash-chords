import {styled} from "@mui/system";
import React, {useContext, useEffect, useState} from "react";
import {useWindowSize} from "@/lib/react/hooks";
import {MidiInputContext} from "@/lib/react/contexts";
import MidiPiano, {NoteEvent, NoteSubscriber} from "@/lib/music/MidiPiano";
import _ from "lodash";
import {Note} from "@/lib/music/Note";
import {Vex, Voice} from "vexflow";
import {MusicKey} from "@/lib/music/Circle";

const VexflowOutput = styled('div')`
    overflow: hidden;
`

interface Props {
  musicKey: MusicKey,
  bassNotes: string,
  trebleNotes: string
}

export default function Exercise(props: Props) {
  // const [context, [contextWidth, contextHeight]] = useVexflowContext('exercise-vexflow-output')
  const midiInput = useContext(MidiInputContext)
  const [midiPiano, setMidiPiano] = useState<MidiPiano | undefined>(undefined)
  const [windowWidth, windowHeight] = useWindowSize()

  useEffect(() => {
    const piano = new MidiPiano(midiInput)
    setMidiPiano(piano)
    const subscriberId = _.uniqueId('exercise')
    piano.addSubscriber(subscriberId, noteSubscriber)
    return () => piano.removeSubscriber(subscriberId)
  }, [midiInput])

  useEffect(() => {
    const outputDiv = document.getElementById('exercise-vexflow-output') as HTMLDivElement
    if (outputDiv) outputDiv.innerHTML = ''

    const vf = new Vex.Flow.Factory({renderer: {elementId: 'exercise-vexflow-output', width: windowWidth, height: 300}})
    const score = vf.EasyScore()
    const system = vf.System()

    let trebleVoice: Voice[] = []
    if (props.trebleNotes.length > 0) {
      const easyScoreNotes = score.notes(props.trebleNotes, {clef: 'treble'})
      trebleVoice = [score.voice(easyScoreNotes)]
    }

    let bassVoice: Voice[] = []
    if (props.bassNotes.length > 0) {
      const easyScoreNotes = score.notes(props.bassNotes, {clef: 'bass'})
      bassVoice = [score.voice(easyScoreNotes)]
    }

    // TODO doesn't seem to automatically add more measures, we will have to slice it ourselves
    system.addStave({voices: trebleVoice})
      .addClef('treble')
      .addTimeSignature('4/4')

    system.addStave({voices: bassVoice})
      .addClef('bass')
      .addTimeSignature('4/4')

    system.addConnector()
    vf.draw()
  }, [windowWidth]);

  const noteSubscriber: NoteSubscriber = (event: NoteEvent, currentActiveNotes: Note[], history: NoteEvent[]) => {
    const {note, velocity, flag, time} = event
  }

  return <VexflowOutput>
    <div id={'exercise-vexflow-output'}/>
  </VexflowOutput>
}
