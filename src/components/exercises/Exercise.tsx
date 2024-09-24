import {styled} from "@mui/system";
import React, {useContext, useEffect, useState} from "react";
import {useWindowSize} from "@/lib/react/hooks";
import {MidiInputContext} from "@/lib/react/contexts";
import MidiPiano, {NoteEvent, NoteSubscriber} from "@/lib/music/MidiPiano";
import _ from "lodash";
import {Note} from "@/lib/music/Note";
import {MusicKey} from "@/lib/music/Circle";
import {renderVex} from "@/lib/vexRenderer";

const VexflowOutput = styled('div')`
    overflow: hidden;
`

interface Props {
  // The key this exercise will be in
  musicKey: MusicKey,
  bassVoice: string,
  trebleVoice: string,
}

/**
 * Generic exercise that will complete when players have played all provided notes
 *
 * @param props
 * @constructor
 */
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
    const renderConfig = {width: windowWidth, trebleVoice: props.trebleVoice, bassVoice: props.bassVoice}
    renderVex('exercise-vexflow-output', renderConfig)
  }, [windowWidth, props]);

  const noteSubscriber: NoteSubscriber = (event: NoteEvent, currentActiveNotes: Note[], history: NoteEvent[]) => {
    const {note, velocity, flag, time} = event
  }

  return <VexflowOutput>
    <div id={'exercise-vexflow-output'}/>
  </VexflowOutput>
}
