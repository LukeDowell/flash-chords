import React from 'react'
import userEvent from "@testing-library/user-event";
import {PracticeSettings} from "./PracticeSettings";
import {render, screen} from "@testing-library/react";
import {DEFAULT_PRACTICE_SETTINGS} from "./Settings";

describe('the practice settings component', () => {
  it('should callback with any settings changes', async () => {
    const mockCallback = jest.fn()
    const user = userEvent.setup()
    const startingSettings = {...DEFAULT_PRACTICE_SETTINGS, timerEnabled: false}
    const expectedSettings = {...DEFAULT_PRACTICE_SETTINGS, timerEnabled: true}
    render(<PracticeSettings settings={startingSettings} onSettingsUpdate={mockCallback}/>)

    await user.click(screen.getByText(/Timer Enabled/))

    expect(mockCallback).toHaveBeenCalledWith(expectedSettings)
  })
})
