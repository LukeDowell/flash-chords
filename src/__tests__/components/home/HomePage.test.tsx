import HomePage from '@/components/home/HomePage'
import {render} from "@testing-library/react";

describe('the home page', () => {
  it('should render', () => {
    render(<HomePage/>)
  })
})
