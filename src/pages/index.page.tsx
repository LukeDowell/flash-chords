import Head from 'next/head'
import '@/styles/index.module.css'
import {styled} from "@mui/material/styles";
import React from "react";
import PracticePage from "@/components/practice/PracticePage";
import {FChord, FKey, getKey} from "@/lib/music/Circle";


const StyledRoot = styled('div')({
  display: "flex",
  flexDirection: "column",
  textAlign: "center",
  justifyContent: "space-between",
  width: '100%',
  height: '1000px',
})

interface Props {
  initialChord?: FChord,
  initialKey?: FKey
}

export default function HomePage({
                                   initialChord = new FChord("Db", 'Major'),
                                   initialKey = getKey('Db', 'Major')
                                 }: Props) {
  return (
    <>
      <Head>
        <title>Flash Chords</title>
        <meta name="description" content="Generated by create next app"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </Head>
      <StyledRoot>
        <PracticePage initialChord={initialChord} initialKey={initialKey}/>
      </StyledRoot>
    </>
  )
}
