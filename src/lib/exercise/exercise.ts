import {getKey, MusicKey} from "@/lib/music/Circle";

export default class Exercise {
  readonly treble: string[][]
  readonly bass: string[][]
  readonly timeSignature: string
  readonly key: MusicKey

  constructor(
    treble: string[][] = [],
    bass: string[][] = [],
    timeSignature: string = '4/4',
    key: MusicKey = getKey('C')
  ) {
    this.treble = treble
    this.bass = bass
    this.timeSignature = timeSignature
    this.key = key
  }

}
