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

  it('should show a navigation drawer', async () => {
    render(
      <App
        pageProps={{}}
        Component={() => <div/>}
        router={{} as any}
      />
    )

    const user = userEvent.setup()
    await user.click(screen.getByTestId('MenuIcon'))
    expect(screen.queryByText(/Home/)).toBeInTheDocument()
    expect(screen.queryByText(/Progression/)).toBeInTheDocument()
    expect(screen.queryByText(/Scale/)).toBeInTheDocument()
  })
})
