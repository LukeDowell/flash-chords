import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {Measure} from "../measure/Measure";
import {toNote} from "../music/Note";
import styled from "@emotion/styled";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Measure',
  component: Measure,
} as ComponentMeta<typeof Measure>;

const Container = styled('div')({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: '80px',
})

const Template: ComponentStory<typeof Measure> = (args) => <Container>
  <Measure {...args} />
</Container>;

export const Treble = Template.bind({});
export const Bass = Template.bind({});
Treble.args = {
  cleff: "treble",
  notes: ['B3', 'C#4', 'D#4', 'E4', 'G♭4', 'E5', 'F5', 'G5'].map(toNote)
}

Bass.args = {
  cleff: "bass",
  notes: ['A2', 'C♭3', 'E3', 'D#3'].map(toNote)
}
