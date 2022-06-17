import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import styled from "@emotion/styled";
import Staff from "./Staff";

export default {
  title: 'Staff',
  component: Staff,
} as ComponentMeta<typeof Staff>;

const Container = styled('div')({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  width: 'fit-content',
  height: 'fit-content',
})

const BasicTemplate: ComponentStory<typeof Staff> = (args) => <Container>
  <Staff />
</Container>;

export const EmptyStaff = BasicTemplate.bind({});

EmptyStaff.args = {}
