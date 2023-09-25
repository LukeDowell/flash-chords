'use client'

import React from "react";
import {styled} from "@mui/material/styles";
import {Chord} from "@/lib/music/Chord";
import {getKey} from "@/lib/music/Circle";
import PracticePage from "@/components/practice/PracticePage";

const StyledRoot = styled('div')({
  display: "flex",
  flexDirection: "column",
  textAlign: "center",
  justifyContent: "space-between",
  width: '100%',
  height: '1000px',
})

export default function HomePage() {
  const initialChord = new Chord("Db", 'Major')
  const initialKey = getKey('Db', 'Major')

  return (
    <StyledRoot>
      <PracticePage initialChord={initialChord} initialKey={initialKey}/>
    </StyledRoot>
  )
}
