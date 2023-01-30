import * as React from 'react'
import styled from "styled-components"
import {Chord, requiredNotesForChord, toSymbol} from "@/lib/music/Chord";
import {NATURAL, Note} from "@/lib/music/Note";
import {symanticFormat} from "@/lib/music/Keys";

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
    fontSize: "2.5vmax"
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

const toVoicingComponent = (v: VoicingResult, i: number) => {
  const notes = v.validNotes.length !== 0 ? symanticFormat(v.validNotes, v.chord) : symanticFormat(requiredNotesForChord(v.chord), v.chord)
  const prettyNotes = notes.map(n => new Note(n.root, n.accidental))
    .map(n => n.toString().replace(NATURAL.symbol, ''))
    .join(', ')
  const isSuccess = v.validNotes.length > 0
  const chordSymbol = toSymbol(v.chord);

  const Styled = styled(StyledVoicingRoot)({
    backgroundColor: isSuccess ? "rgba(0, 255, 0, 0.2)" : "rgba(255, 0, 0, 0.2)"
  })

  return <Styled key={i} data-testid={isSuccess ? `${chordSymbol}-valid-voicing` : `${chordSymbol}-invalid-voicing`}>
    <span className="chord">{chordSymbol}</span>
    <span className="notes">{prettyNotes}</span>
  </Styled>
}

export const VoicingHistory = ({voicingResults}: Props) => {
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
