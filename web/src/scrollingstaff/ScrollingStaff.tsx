import React from 'react'
import styled from "@emotion/styled";

interface Props {
  cleff: Cleff
}

const Ledger = styled('div')({
  height: "1rem"
})

export type Cleff = "treble" | "bass"

export const ScrollingStaff = ({
                                 cleff = 'treble'
                               }: Props) => {
  return <>

  </>
}
