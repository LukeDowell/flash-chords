import * as React from 'react'
import {styled} from "@mui/material"
import {Chord, chordToSymbol} from "../music/Chord";
import {Note} from "../music/Note";

const StyledRoot = styled('div')({
  display: "flex"
})

const StyledVoicing = styled('div')({
  display: "flex",
  flexDirection: "row"
})

export interface VoicingResult {
  chord: Chord,
  validNotes: Note[]
}

interface Props {
  voicingResults: VoicingResult[]
}

export const VoicingHistory = ({voicingResults}: Props) => {
  const toVoicingComponent = (voicingResult: VoicingResult) => <StyledVoicing>
    <span className="chord">{chordToSymbol(voicingResult.chord)}</span>
    <span className="notes">{String(voicingResult.validNotes)}</span>
  </StyledVoicing>

  return <StyledRoot>
    <div className="header">

    </div>
    <div className="voicings">
      {voicingResults.map(toVoicingComponent)}
    </div>
  </StyledRoot>
}
