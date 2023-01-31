import React from 'react'
import ProgressionPage from './index.page'
import {render} from "@testing-library/react";

describe('the chord progression practice page', () => {
  it('should render', () => {
    render(<ProgressionPage/>)
  })
})
