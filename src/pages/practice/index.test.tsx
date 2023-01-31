import React from 'react'
import PracticePage from './index.page'
import {render} from "@testing-library/react";

describe('the chord symbol practice page', () => {
  it('should render', () => {
    render(<PracticePage/>)
  })
})
