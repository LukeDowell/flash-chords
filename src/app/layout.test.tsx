import React from 'react';
import {render, screen, waitFor} from "@testing-library/react";
import RootLayout from "@/app/layout";

describe('the root layout', () => {
  /**
   * This test is giving me grief because I like the idea of making sure I have a 'recipe' for rendering the root layout,
   * but I am not a fan of the double-Object.defineProperty and jest.spyOn magic here. This test ALSO dumps an error about
   * an <html> tag being a child of a <div>, which apparently will be resolved in React 19.
   *
   * https://github.com/testing-library/react-testing-library/issues/1250
   *
   */
  it('should render', async () => {
    const fakeInput = {
      name: "a fake midi input",
      addEventListener: jest.fn()
    } as unknown as MIDIInput

    jest.spyOn(global.navigator, 'requestMIDIAccess').mockResolvedValue({
      addEventListener: jest.fn(),
      inputs: new Map<string, MIDIInput>([
        ["fake-id", fakeInput]
      ])
    } as unknown as WebMidi.MIDIAccess)

    const randomTestId = Math.random().toString(16).slice(2)
    render(
      <RootLayout>
        <div data-testid={randomTestId}/>
      </RootLayout>
    )

    await waitFor(() => expect(screen.getByTestId(randomTestId)).toBeVisible())
  })
})
