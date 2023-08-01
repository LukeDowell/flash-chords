import {styled} from "@mui/system";
import React, {useContext} from "react";
import {useVexflowContext} from "@/lib/hooks";
import MidiPiano from "@/lib/music/MidiPiano";
import {MidiPianoContext} from "@/pages/_app.page";
import {MusicKey} from "@/lib/music/Circle";

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

export default function Exercise({config}: Props) {
  const [context, [contextWidth, contextHeight]] = useVexflowContext('exercise-vexflow-output')
  const piano: MidiPiano = useContext(MidiPianoContext)

  return <VexflowOutput>
    <div id={'exercise-vexflow-output'}/>
  </VexflowOutput>
}
