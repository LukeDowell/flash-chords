import React from 'react';
import {render, screen} from "@testing-library/react";
import PracticePage from "./PracticePage";

describe("the practice page", () => {
  it('should render', () => {
    render(<PracticePage />)
    expect(screen.getByTestId("chord-symbol-prompt")).toBeInTheDocument()
  })
})
