import React from 'react'
import {styled} from "@mui/material/styles";
import {InteractiveStaff} from "@/components/interactivestaff/InteractiveStaff";
import {getKey} from "@/lib/music/Circle";
import {Chord} from '@/lib/music/Chord';

const StyledRoot = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100vw',
  height: '100vh',
})

const StaffContainer = styled('div')({
  width: '100vw',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

export default function ProgressionPage({}) {
  return <StyledRoot>
    <h1>Progression Page</h1>
    <StaffContainer>
      <InteractiveStaff musicKey={getKey('Gb', 'Major')}
                        chords={[
                          new Chord('Gb', 'Major'),
                          new Chord('Ab', 'Major'),
                          new Chord('Bb', 'Minor'),
                          new Chord('Bb', 'Minor'),
                        ]}
      />
    </StaffContainer>
  </StyledRoot>
}
