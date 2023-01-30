import * as React from 'react'
import {render} from '@testing-library/react'
import HomePage from "@/pages/index";

describe('the index page', () => {
  it('should render', () => {
    render(<HomePage/>)
  })
})
