import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {Measure} from "./Measure";
import {layNotesOnKeyboard, toNote} from "../../music/Note";
import styled from "@emotion/styled";
import {formatNotesInKey, MAJOR_KEYS} from "../../music/Keys";
import {requiredNotesForChord} from "../../music/Chord";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Measure',
  component: Measure,
} as ComponentMeta<typeof Measure>;

const Container = styled('div')({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  width: 'fit-content',
  height: 'fit-content',
})

const BasicTemplate: ComponentStory<typeof Measure> = (args) => <Container>
  <Measure style={{width: 450, height: 150}} {...args} />
</Container>;

const KeyTemplate: ComponentStory<typeof Measure> = (args) => {
  const measures = MAJOR_KEYS['Db'].diatonicChords.map(requiredNotesForChord)
    .map((notes) => layNotesOnKeyboard(notes, 4))
    .map((notes) => formatNotesInKey(notes, MAJOR_KEYS['Db']))
    .map((notes) => <Measure style={{width: 450, height: 150}} cleff={'treble'} notes={notes}/>)

  return <Container>
    {measures}
  </Container>
}

export const Treble = BasicTemplate.bind({});
export const Bass = BasicTemplate.bind({});
export const Key = KeyTemplate.bind({})

Treble.args = {
  cleff: "treble",
  notes: ['B3', 'C#4', 'D#4', 'E4', 'Gb4', 'E5', 'F5', 'G5'].map(toNote)
}

Bass.args = {
  cleff: "bass",
  notes: ['A2', 'Cb2', 'E2', 'D#2', 'C3'].map(toNote)
}
