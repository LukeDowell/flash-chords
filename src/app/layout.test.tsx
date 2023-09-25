import React from 'react';
import {render} from "@testing-library/react";
import RootLayout from "@/app/layout";

describe('the root layout', () => {
  it('should render', () => {
    render(<RootLayout/>)
  })
})
