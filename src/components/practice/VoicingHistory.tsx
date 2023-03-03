import * as React from 'react'
import {styled} from "@mui/material/styles"
import {NATURAL, Note} from "@/lib/music/Note";
import {MusicKey, notesInKey} from "@/lib/music/Circle";
import {Chord} from "@/lib/music/Chord";

const StyledRoot = styled('div')`
  display: flex;
  flex-direction: column;
  width: 80%;
  min-width: 80%;

  .header {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding-bottom: .5rem;
    padding-left: 1rem
  }

  .title {
    text-align: left;
    flex: 1;
    font-size: 3vmax;
  }

  .voicings {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    font-size: 2.5vmax;
  }
`

const StyledVoicingRoot = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  border-top: 2px solid black;

  .chord {
    flex: 1;
    text-align: left;
    padding-left: 1rem;
  }

  .notes {
    flex: 1;
    text-align: left;
  }
`

export interface VoicingResult {
  chord: Chord,
  key: MusicKey,
  validNotes: Note[]
}

interface Props {
  voicingResults: VoicingResult[]
}

const toVoicingComponent = (v: VoicingResult, i: number) => {
  const notes = notesInKey(v.chord.notes(), v.key)
  const prettyNotes = notes.map(n => new Note(n.root, n.accidental))
    .map(n => n.toString().replace(NATURAL.symbol, ''))
    .join(', ')
  const isSuccess = v.validNotes.length > 0
  const chordSymbol = v.chord.toString()

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
