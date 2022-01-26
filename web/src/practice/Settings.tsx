export interface Settings {
  /** Whether or not the chord voicing is timed */
  timerEnabled: boolean,

  /** The amount of time in milliseconds a user has to correctly input a voicing */
  timerValue: number,

  /** Whether or not chords with the following properties may be generated */
  triadsEnabled: boolean,
  seventhsEnabled: boolean,
}

export const DEFAULT_PRACTICE_SETTINGS = {
  timerEnabled: true,
  timerValue: 10000,
  triadsEnabled: true,
  seventhsEnabled: true
}
