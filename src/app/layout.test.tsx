import React from 'react';
import {render} from "@testing-library/react";
import RootLayout from "@/app/layout";

describe('the root layout', () => {
  it('should render', () => {
    // TODO I wonder why we can't put this in jest.setup.tsx?
    navigator.requestMIDIAccess = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        addEventListener: jest.fn(),
        inputs: new Map<string, MIDIInput>([
          ["fake-id", {name: "a fake midi input"} as MIDIInput]
        ])
      })
    })

    render(<RootLayout/>)
  })
})
