import React from 'react'
import {KEYBOARD, Note} from "./Music";
import styled from "@emotion/styled";

interface Props {
  activeNotes: Note[],
}

export const Keyboard = ({activeNotes}: Props) => {
  const keys = KEYBOARD.map((note) => {
    const isSharp = note.includes("#")
    const Key = styled('div')({
      display: "flex",
      width: "35px", // ~1/88th
      height: isSharp ? "50%" : "100%",
      backgroundColor: isSharp ? "black" : "white",
      color: "grey",
      border: "1px solid black",
      alignItems: "end",
      justifyContent: "center",
    })
    return <Key key={note}>{note}</Key>
  })

  const StyledKeyboard = styled('div')({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "flex-start",
    height: "250px",
    width: "100%",
    border: "4px solid grey",
    backgroundColor: "slategray"
  })

  return <StyledKeyboard>
    {keys}
  </StyledKeyboard>
}
