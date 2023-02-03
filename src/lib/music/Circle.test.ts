import {circleMajorKeys, FChord, stepFrom} from "@/lib/music/Circle";
import {Note, toNote} from "@/lib/music/Note";
import {MAJOR_SCALE} from "@/lib/music/Scale";
import _ from "lodash";

describe('a chord',  () => {
  it('should calculate its intervals', () => {
    expect(new FChord(Note.of('C'), "Major").intervals()).toStrictEqual([4, 3])
    expect(new FChord(Note.of('C'), "Minor").intervals()).toStrictEqual([3, 4])
    expect(new FChord(Note.of('C'), "Diminished").intervals()).toStrictEqual([3, 3])
    expect(new FChord(Note.of('C'), "Augmented").intervals()).toStrictEqual([4, 4])
  })
})

describe('the circle of fifths', () => {
  it('should correctly find notes that are whole steps apart', () => {
    expect(stepFrom('A', 0)).toStrictEqual('A')
    expect(stepFrom('C', 7)).toStrictEqual('C')
    expect(stepFrom('C', 4)).toStrictEqual('G')
    expect(stepFrom('G', 8)).toStrictEqual('A')
    expect(stepFrom('F', 11)).toStrictEqual('C')
    expect(stepFrom('C', -7)).toStrictEqual('C')
    expect(stepFrom('C', -4)).toStrictEqual('F')
  })

  it('should make a circle of fifths key based on the number of accidentals', () => {
    expect(circleMajorKeys(1)).toStrictEqual({
      root: Note.of('G'),
      scale: MAJOR_SCALE,
      notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'].map(Note.of)
    })

    expect(circleMajorKeys(-1)).toStrictEqual({
      root: Note.of('F'),
      scale: MAJOR_SCALE,
      notes: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'].map(Note.of)
    })
  })
})
