import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {Measure} from "../scrollingstaff/Measure";
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
Treble.args = {
  cleff: "treble",
  notes: ['B3', 'C4', 'D4', 'E4', 'G4', 'E5', 'F5', 'G5'].map(toNote)
}
