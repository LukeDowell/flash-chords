import React from 'react'
import styled from "@emotion/styled";
import {genericInterval, lowerNote, Note, noteToSymbol, toNote} from "../music/Note";
import _ from "lodash";
import {ReactComponent as WholeNoteSvg} from '../images/whole-note.svg'

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
}))

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
  height: string,
  left?: string,
}

const WholeNote = styled(WholeNoteSvg)<WholeNoteProps>(props => ({
  position: 'absolute',
  transform: `translate(-50%, -50%)`,
  width: 'auto',
  height: props?.height || '20px',
  left: props?.left || '50%',
  top: props.top,
}))

export const Measure = ({
                          cleff = 'treble',
                          notes = [],
                          style = {
                            width: 400,
                            height: 80
                          }
                        }: Props) => {
  const noteComponents = notes.map((n) => {
    const key = `${noteToSymbol(n)}-note`.toLowerCase()
    const base = toNote(cleff === 'treble' ? 'F5' : 'A3')
    const interval = genericInterval(base, n)

    // Vertically Position
    let topValue = (interval - 1) * (style.height / 8)
    if (_.isEqual(lowerNote(base, n), base)) topValue = -topValue
    const top = `${topValue}px`

    // Horizontally Position
    let left
    const neighbors: Note[] = notes.filter((maybeNeighbor) => genericInterval(maybeNeighbor, n) === 2)
      .filter((dn) => {
        // Remove neighbors who themselves have two neighbors so that we alternate notes if necessary
        const neighborsNeighbors = notes.filter((mn) => genericInterval(dn, mn) === 2)
        return neighborsNeighbors.length < 2
      })

    if (neighbors.length == 1) left = "42.5%"


    return <WholeNote data-testid={key} key={key}
                      height={`${style?.height / 4}`}
                      top={top}
                      left={left}
    />
  })

  return <StyledRoot width={style.width} height={style.height}>
    {noteComponents}
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
