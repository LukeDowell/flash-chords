import React from 'react';
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AppDrawer from './AppDrawer';

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
  })
})
