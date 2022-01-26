export interface PracticeSettings {
  /** Whether or not the chord voicing is timed */
  timerEnabled: boolean,

  /** The amount of time in milliseconds a user has to correctly input a voicing */
  timerValue: number
}

export const DEFAULT_PRACTICE_SETTINGS = {
  timerEnabled: false,
  timerValue: 10000
}
