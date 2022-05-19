import React from 'react'
import styled from "@emotion/styled";
import {genericInterval, Note, noteToSymbol, toNote} from "../music/Note";
import _ from "lodash";
import { ReactComponent as WholeNoteSvg } from '../images/whole-note.svg'

export interface MeasureStyles {
  width: number,
  height: number,
}

export interface Props {
  cleff?: 'treble' | 'bass',
  notes?: Note[],
  style?: MeasureStyles
}

const StyledRoot = styled('div')<MeasureStyles>(props => ({
  display: 'flex',
  flexDirection: 'column',
  border: "1px solid black",
  borderBottom: '0px solid black',
  borderTop: 'none',
  minWidth: props.width,
  minHeight: props.height,
  position: 'relative'
})
)
const WhiteBar = styled('div')({
  height: '25%',
  width: '100%',
  backgroundColor: 'white',
})

const BlackLine = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '1px',
  width: '100%',
  backgroundColor: 'black',
})

interface WholeNoteProps {
  top: string,
  scale: string,
  left?: string,
}

const WholeNote = styled(WholeNoteSvg)<WholeNoteProps>(props => ({
  position: 'absolute',
  left: props?.left || '50%',
  top: props?.top || '40px',
  transform: `translate(-50%, -50%) scale(${props.scale})`
}))

export const Measure = ({
                          cleff = 'treble',
                          notes = [],
                          style = {
                            width: 400,
                            height: 80
                          }
                        }: Props) => {
  const noteComponents = notes.map((n, i) => {
    const key = `${noteToSymbol(n)}-note`.toLowerCase()
    const base = toNote(cleff === 'treble' ? 'F5' : 'A3')
    const interval = genericInterval(base, n)
    const top = `${interval * 10}%`
    return <WholeNote data-testid={key} key={key}
                      scale={`${1.5 + (style.height / style.width)}`}
                      top={top}
    />
  })

  return <StyledRoot width={style.width} height={style.height}>
    { noteComponents }
    <BlackLine/>
    <WhiteBar/>
    <BlackLine/>
    <WhiteBar/>
    <BlackLine/>
    <WhiteBar/>
    <BlackLine/>
    <WhiteBar/>
    <BlackLine/>
  </StyledRoot>
}
