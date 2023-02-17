import React, {useState} from 'react'
import {styled} from "@mui/material/styles";
import KeyExercise from "@/components/exercises/KeyExercise";
import {getKey} from "@/lib/music/Circle";

const StyledRoot = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100vw',
  height: '100vh',
})

export default function ProgressionPage({}) {
  const [timesPlayed, setTimesPlayed] = useState(0)

  return <StyledRoot>
    <h1>Progression Page</h1>
    <p>Times Played: {timesPlayed}</p>
    <KeyExercise musicKey={getKey('Db', 'Major')} onEnd={(_) => setTimesPlayed(timesPlayed + 1)}/>
  </StyledRoot>
}
