export interface Settings {
  /** Whether the chord voicing is timed */
  timerEnabled: boolean,

  /** The amount of time in whole seconds a user has to correctly input a voicing */
  timerMilliseconds: number,

  /** Whether chords with the following properties may be generated */
  triadsEnabled: boolean,
  seventhsEnabled: boolean,
  flatRootsEnabled: boolean,
  sharpRootsEnabled: boolean,
  minorEnabled: boolean,
  majorEnabled: boolean,
  augmentedEnabled: boolean,
  diminishedEnabled: boolean,
  halfDiminishedEnabled: boolean,
  dominantEnabled: boolean,
}

export const DEFAULT_PRACTICE_SETTINGS = {
  timerEnabled: false,
  timerMilliseconds: 10_000,
  triadsEnabled: true,
  seventhsEnabled: true,
  flatRootsEnabled: true,
  sharpRootsEnabled: true,
  minorEnabled: true,
  majorEnabled: true,
  augmentedEnabled: true,
  diminishedEnabled: true,
  halfDiminishedEnabled: true,
  dominantEnabled: true,
}
