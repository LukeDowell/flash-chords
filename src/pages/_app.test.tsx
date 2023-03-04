import React from 'react'
import {render, screen} from "@testing-library/react";
import App from "@/pages/_app.page";
import userEvent from "@testing-library/user-event";


describe('the app wrapper', () => {
  it('should render', () => {
    render(
      <App
        pageProps={''}
        Component={() => <div/>}
        router={{} as any}
      />
    )
  })

  it('should show a settings drawer, and then close it', async () => {
    render(
      <App
        pageProps={{}}
        Component={() => <div/>}
        router={{} as any}
      />
    )

    const user = userEvent.setup()
    expect(screen.queryByTestId('CloseIcon')).not.toBeInTheDocument()
    await user.click(screen.getByTestId('SettingsIcon'))
    expect(screen.getByTestId('CloseIcon')).toBeInTheDocument()
    expect(screen.getByTestId('SettingsDrawer')).toBeInTheDocument()
    expect(screen.queryByTestId('SettingsIcon')).not.toBeInTheDocument()
    await user.click(screen.getByTestId('CloseIcon'))
    expect(screen.getByTestId('SettingsIcon')).toBeInTheDocument()
  })
})
