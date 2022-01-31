import * as React from 'react'
import {styled} from "@mui/material"
import {Chord, chordToSymbol, requiredNotesForChord} from "../music/Chord";
import {Note, notesToString} from "../music/Note";

const StyledRoot = styled('div')({
  display: "flex",
  flexDirection: "column",
  width: "80%",
  minWidth: "80%",

  ".header": {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    paddingBottom: ".5rem",
    paddingLeft: "1rem"
  },

  ".title": {
    textAlign: "left",
    flex: "1",
    fontSize: "3vmax",
  },

  ".voicings": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    fontSize: "2vmax"
  }
})

const StyledVoicingRoot = styled('div')({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  width: "100%",
  borderTop: "2px solid black",

  ".chord": {
    flex: "1",
    textAlign: "left",
    paddingLeft: "1rem",
  },

  ".notes": {
    flex: "1",
    textAlign: "left",
  }
})

export interface VoicingResult {
  chord: Chord,
  validNotes: Note[]
}

interface Props {
  voicingResults: VoicingResult[]
}

export const VoicingHistory = ({voicingResults}: Props) => {

  const toVoicingComponent = (v: VoicingResult, i: number) => {
    const notes = v.validNotes.length !== 0 ? v.validNotes : requiredNotesForChord(v.chord)
    const isSuccess = v.validNotes.length > 0
    const chordSymbol = chordToSymbol(v.chord);
    return <StyledVoicingRoot key={i}
                              data-testid={isSuccess ? `${chordSymbol}-valid-voicing` : `${chordSymbol}-invalid-voicing`}>
      <span className="chord">{chordSymbol}</span>
      <span className="notes">{notesToString(notes.map((n) => {
        return {...n, octave: undefined}
      }))}</span>
    </StyledVoicingRoot>
  }

  const newestOnTopResults = [...voicingResults].reverse()

  return <StyledRoot>
    <div className="header">
      <span className="title">Chord</span>
      <span className="title">Notes</span>
    </div>
    <div className="voicings">
      {newestOnTopResults.map(toVoicingComponent)}
    </div>
  </StyledRoot>
}
