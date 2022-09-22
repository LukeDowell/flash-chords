import {Key} from "../../music/Keys";

export interface Settings {
  /** Whether or not the chord voicing is timed */
  timerEnabled: boolean,

  /** The amount of time in whole seconds a user has to correctly input a voicing */
  timerSeconds: number,

  /** Whether or not chords with the following properties may be generated */
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

  /** Key specific settings */
  activeKey: Key | undefined
}

export const DEFAULT_PRACTICE_SETTINGS = {
  timerEnabled: true,
  timerSeconds: 10,
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
  activeKey: undefined
}
