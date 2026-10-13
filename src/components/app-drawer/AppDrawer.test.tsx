import React from 'react';
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AppDrawer from './AppDrawer';
import MIDIInput = WebMidi.MIDIInput;

describe('the app drawer', () => {
  beforeEach(() => {
    global.navigator.requestMIDIAccess = jest.fn().mockImplementation(() => {
      return new Promise(() => {
      });
    })
  })

  it('should render', () => {
    render(<AppDrawer/>)
  })

  it('should pull out the drawer on click', async () => {
    render(<AppDrawer/>)
    const user = userEvent.setup()
    await user.click(screen.getByTestId('MenuIcon'))

    expect(screen.queryByText(/Home/)).toBeInTheDocument()
    expect(screen.queryByText(/Progression/)).toBeInTheDocument()
    expect(screen.queryByText(/Scale/)).toBeInTheDocument()
    expect(screen.queryByText(/Grand Staff/)).toBeInTheDocument()
  })

  it('should stop listening to the previous input when a new input is selected', async () => {
    const makeInput = (name: string) => ({
      name,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    } as unknown as MIDIInput)
    const firstInput = makeInput('piano-1')
    const secondInput = makeInput('piano-2')
    global.navigator.requestMIDIAccess = jest.fn().mockImplementation(() => Promise.resolve({
      addEventListener: jest.fn(),
      inputs: new Map<string, MIDIInput>([["id-1", firstInput], ["id-2", secondInput]])
    }))

    render(<AppDrawer/>)
    const user = userEvent.setup()
    await user.click(screen.getByTestId('MenuIcon'))
    await waitFor(() => expect(firstInput.addEventListener).toHaveBeenCalled())

    const inputSelector = await waitFor(() => {
      const combo = screen.getAllByRole('combobox').find(el => el.textContent?.includes('piano-1'))
      expect(combo).toBeDefined()
      return combo!
    })
    fireEvent.mouseDown(inputSelector)
    await user.click(await screen.findByRole('option', {name: 'piano-2'}))

    await waitFor(() => expect(secondInput.addEventListener).toHaveBeenCalled())
    expect(firstInput.removeEventListener).toHaveBeenCalled()
  })
})
