import React from 'react'
import styled from "@emotion/styled";
import {FLAT, genericInterval, Note, noteToSymbol, sortNotes, toNote} from "../music/Note";
import {ReactComponent as WholeNoteSvg} from '../images/whole-note.svg'
import {ReactComponent as FlatSvg} from '../images/accidental-flat.svg'
import {ReactComponent as SharpSvg} from '../images/accidental-sharp.svg'
import _ from "lodash";


export interface Props {
  cleff?: 'treble' | 'bass',
  notes?: Note[],
  style?: MeasureStyles
}

export interface MeasureStyles {
  width: number,
  height: number,
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

interface WhiteBarProps {
  height: number
}

const WhiteBar = styled('div')<WhiteBarProps>(props => ({
  height: `${props.height / 4}px`,
  width: '100%',
  backgroundColor: 'white',
}))

const BlackLine = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '1px',
  width: '100%',
  backgroundColor: 'black',
})

interface WholeNoteProps {
  top: number,
  height: number,
  left: number,
  linehint?: 'center' | 'bottom' | 'top'
}

const WholeNote = styled(WholeNoteSvg)<WholeNoteProps>(props => ({
  position: 'absolute',
  transform: `translate(-50%, -50%)`,
  width: 'auto',
  height: `${props.height}px`,
  left: `${props.left}%`,
  top: `${props.top}%`,
  backgroundImage: props.linehint ? 'linear-gradient(black, black)' : '',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '125% 1px',
  backgroundPosition: `-10px ${props.linehint}`,
}))

interface AccidentalProps {
  height: number,
  top: number,
  left: number
}

const SharpComponent = styled(SharpSvg)<AccidentalProps>(props => ({
  position: 'absolute',
  transform: `translate(-50%, -50%)`,
  height: `${props.height}px`,
  width: 'auto',
  left: `${props.left}%`,
  top: `${props.top}%`,
}))

const FlatComponent = styled(FlatSvg)<AccidentalProps>(props => ({
  position: 'absolute',
  transform: `translate(-50%, -75%)`,
  height: props.height,
  width: 'auto',
  left: `${props.left}%`,
  top: `${props.top}%`,
}))

export const Measure = ({
                          cleff = 'treble',
                          notes = [],
                          style = {
                            width: 800,
                            height: 200
                          }
                        }: Props) => {

  const leftShiftedNoteIndex: number[] = []
  const noteComponents = sortNotes(notes).flatMap((n, i, a) => {
    const key = `${noteToSymbol(n)}-note`
    const topOfStaff = toNote(cleff === 'treble' ? 'F5' : 'A3')
    const bottomOfStaff = toNote(cleff === 'treble' ? 'E4' : 'A0')
    const interval = genericInterval(topOfStaff, n)

    // Vertically Position
    let top = (interval - 1) * 12.5
    if (topOfStaff.isLowerThan(n)) top = -top

    // Horizontally Position
    let left = 50.0
    if (leftShiftedNoteIndex.includes(i)) left = 42.5
    else if (notes?.[i + 1] !== undefined && genericInterval(n, notes[i + 1]) === 2) {
      leftShiftedNoteIndex.push(i + 1)
    }

    // Accidental
    let accidental
    if (n?.accidental) {
      const aKey = `${noteToSymbol(n)}-accidental`
      const Accidental = _.isEqual(n.accidental, FLAT) ? FlatComponent : SharpComponent
      const neighborsAreShifted = leftShiftedNoteIndex.map((i) => notes[i])
        .some((o) => genericInterval(n, o) === 2)
      accidental = <Accidental data-testid={aKey} key={aKey}
                               height={style?.height / 4}
                               top={top}
                               left={neighborsAreShifted ? left + 8 : left - 8}/>
    }

    // Line Hint
    let lineHint: 'center' | 'bottom' | 'top' | undefined
    if (n.isLowerThan(bottomOfStaff)) {
      lineHint = genericInterval(bottomOfStaff, n) % 2 === 0 ? 'bottom' : 'center'
    } else if (topOfStaff.isLowerThan(n)) {
      lineHint = genericInterval(bottomOfStaff, n) % 2 === 0 ? 'top' : 'center'
    }

    return [<WholeNote data-testid={key} key={key}
                       height={style.height / 4}
                       top={top}
                       left={left}
                       linehint={lineHint}
    />, accidental]
  })

  return <StyledRoot width={style.width} height={style.height}>
    {noteComponents}
    <BlackLine/>
    <WhiteBar height={style.height}/>
    <BlackLine/>
    <WhiteBar height={style.height}/>
    <BlackLine/>
    <WhiteBar height={style.height}/>
    <BlackLine/>
    <WhiteBar height={style.height}/>
    <BlackLine/>
  </StyledRoot>
}
