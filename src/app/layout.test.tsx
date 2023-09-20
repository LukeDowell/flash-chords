import React from 'react'
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RootLayout from "@/app/layout";


describe('the app wrapper', () => {
  beforeEach(() => {
    global.navigator.requestMIDIAccess = jest.fn().mockImplementation(() => {
      return new Promise(() => {
      });
    })
  })

  it('should render', () => {
    render(<RootLayout/>)
  })

  it('should show a navigation drawer', async () => {
    render(<RootLayout/>)
    const user = userEvent.setup()
    await user.click(screen.getByTestId('MenuIcon'))

    expect(screen.queryByText(/Home/)).toBeInTheDocument()
    expect(screen.queryByText(/Progression/)).toBeInTheDocument()
    expect(screen.queryByText(/Scale/)).toBeInTheDocument()
  })
})
