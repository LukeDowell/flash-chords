import React, {useState} from 'react'
import {styled} from "@mui/material/styles";
import KeyExercise from "@/components/exercises/KeyExercise";
import {CIRCLE_OF_FIFTHS, getKey} from "@/lib/music/Circle";
import _ from "lodash";

const StyledRoot = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100vw',
  height: '100vh',
})

export default function ProgressionPage({}) {
  const [timesPlayed, setTimesPlayed] = useState(0)
  const [musicKey, setMusicKey] = useState(getKey('Db', 'Major'))

  return <StyledRoot>
    <h1>Progression Page</h1>
    <p>Times Played: {timesPlayed}</p>
    <KeyExercise key={`${musicKey.root}-${musicKey.scale.name}`} musicKey={musicKey} onEnd={(r) => {
      setTimesPlayed(timesPlayed + 1)
      setMusicKey(_.sample(CIRCLE_OF_FIFTHS)!)
    }}/>
  </StyledRoot>
}
