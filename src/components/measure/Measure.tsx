import React from 'react'
import {FLAT, genericInterval, Note, noteToSymbol, sortNotes, toNote} from "@/lib/music/Note";
import _ from "lodash";
import {BlackLine, FlatComponent, SharpComponent, StyledRoot, WhiteBar, WholeNote} from './MeasureStyles';
import {formatNoteInKey, Key} from "@/lib/music/Keys";


export interface Props {
  clef?: 'treble' | 'bass',
  notes?: Note[],
  musicalKey?: Key,
  style?: MeasureStyles,
  options?: MeasureOptions,
}

export interface MeasureStyles {
  width: number,
  height: number,
  noteColor?: string,
}

export interface MeasureOptions {
  /** Any note higher than this will not be rendered */
  upperNoteLimit?: Note,

  /** Any note lower than this will not be rendered */
  lowerNoteLimit?: Note
}

export const Measure = ({
                          clef = 'treble',
                          notes = [],
                          musicalKey = undefined,
                          style = {
                            width: 400,
                            height: 150,
                          },
                          options = {
                            upperNoteLimit: undefined,
                            lowerNoteLimit: undefined
                          }
                        }: Props) => {

  const formattedNotes = notes.filter((n) => !options?.upperNoteLimit || n.isLowerThan(options.upperNoteLimit))
    .filter((n) => !options?.lowerNoteLimit || options.lowerNoteLimit.isLowerThan(n))
    .map((n) => musicalKey ? formatNoteInKey(n, musicalKey) : n)

  const leftShiftedNoteIndex: number[] = []

  const noteComponents = sortNotes(formattedNotes).flatMap((n, i) => {
    const key = `${noteToSymbol(n)}-note`
    const topOfStaff = toNote(clef === 'treble' ? 'F5' : 'A3')
    const bottomOfStaff = toNote(clef === 'treble' ? 'E4' : 'G2')
    const interval = genericInterval(topOfStaff, n)

    // Vertically Position
    let top = (interval - 1) * 12.5
    if (topOfStaff.isLowerThan(n)) top = -top

    // Horizontally Position
    let left = 50.0
    if (leftShiftedNoteIndex.includes(i)) left = 40.0
    else if (formattedNotes?.[i + 1] !== undefined && genericInterval(n, formattedNotes[i + 1]) === 2) {
      leftShiftedNoteIndex.push(i + 1)
    }

    // Accidental
    let accidental
    if (n?.accidental) {
      const aKey = `${noteToSymbol(n)}-accidental`
      const Accidental = _.isEqual(n.accidental, FLAT) ? FlatComponent : SharpComponent
      const neighborsAreShifted = leftShiftedNoteIndex.map((i) => formattedNotes[i])
        .some((o) => genericInterval(n, o) === 2)
      accidental = <Accidental data-testid={aKey} key={aKey}
                               height={style?.height / 4}
                               top={top}
                               left={neighborsAreShifted ? left + 10 : left - 10}/>
    }

    // Line Hint
    let lineHint: 'center' | 'bottom' | 'top' | undefined
    if (n.isLowerThan(bottomOfStaff)) lineHint = genericInterval(bottomOfStaff, n) % 2 === 0 ? 'bottom' : 'center'
    else if (topOfStaff.isLowerThan(n)) lineHint = genericInterval(bottomOfStaff, n) % 2 === 0 ? 'top' : 'center'
    else lineHint = undefined

    return [
      <WholeNote data-testid={key}
                 key={key}
                 top={top}
                 left={left}
                 linehint={lineHint}
      />,
      accidental
    ]
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
