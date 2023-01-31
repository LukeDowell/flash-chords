import React from 'react'
import {styled} from "@mui/material/styles";
import {KEYBOARD, Note, noteToSymbol, SHARP} from "@/lib/music/Note";

interface Props {
  activeNotes: Note[],
}

const Key = styled('div')({
  display: "flex",
  width: "35px",
  height: "100%",
  backgroundColor: "white",
  color: "grey",
  border: "1px solid black",
  alignItems: "end",
  justifyContent: "center",
})

const BlackKey = styled(Key)({
  height: "50%",
  backgroundColor: "black",
  width: "28px",
})

const StyledKeyboard = styled('div')({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
  alignContent: "flex-start",
  height: "250px",
  width: "100%",
  border: "4px solid grey",
  backgroundColor: "slategray",
})

const SpookyNoWidthFloat = styled('div')({
  display: "inline-block",
  width: "0px",
  zIndex: "2",
  position: "relative",
  left: "-16px",
})

export const Keyboard = ({activeNotes}: Props) => {
  const keys = KEYBOARD.map((note) => {
    const activeStyle = activeNotes.includes(note) ? {
      backgroundColor: "lightblue"
    } : {}

    return note.accidental?.symbol === SHARP.symbol ?
      <SpookyNoWidthFloat key={noteToSymbol(note)}>
        <BlackKey style={activeStyle}>{noteToSymbol(note)}</BlackKey>
      </SpookyNoWidthFloat>
      : <Key key={noteToSymbol(note)} style={activeStyle}>{noteToSymbol(note)}</Key>
  })

  return <StyledKeyboard>{keys}</StyledKeyboard>
}
