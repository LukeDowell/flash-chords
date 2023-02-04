import {circleMajorKeys, FChord, stepFrom} from "@/lib/music/Circle";
import {Note} from "@/lib/music/Note";
import {MAJOR_SCALE} from "@/lib/music/Scale";

describe('a chord', () => {
  it('should calculate its intervals', () => {
    expect(new FChord(Note.of('C'), "Major").intervals()).toStrictEqual([4, 3])
    expect(new FChord(Note.of('C'), "Minor").intervals()).toStrictEqual([3, 4])
    expect(new FChord(Note.of('C'), "Diminished").intervals()).toStrictEqual([3, 3])
    expect(new FChord(Note.of('C'), "Augmented").intervals()).toStrictEqual([4, 4])
  })
})

describe('the circle of fifths', () => {
  it('should find notes that are n whole steps apart', () => {
    expect(stepFrom('A', 0)).toStrictEqual('A')
    expect(stepFrom('C', 7)).toStrictEqual('C')
    expect(stepFrom('C', 4)).toStrictEqual('G')
    expect(stepFrom('G', 8)).toStrictEqual('A')
    expect(stepFrom('F', 11)).toStrictEqual('C')
    expect(stepFrom('C', -7)).toStrictEqual('C')
    expect(stepFrom('C', -4)).toStrictEqual('F')
  })

  it('should make a key with one sharp', () => {
    expect(circleMajorKeys(1)).toStrictEqual({
      root: Note.of('G'),
      scale: MAJOR_SCALE,
      notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'].map(Note.of)
    })
  })

  it('should make a key with many sharps', () => {
    expect(circleMajorKeys(7)).toStrictEqual({
      root: Note.of('C#'),
      scale: MAJOR_SCALE,
      notes: ['C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#'].map(Note.of)
    })
  })

  it('should make a key with a flat', () => {
    expect(circleMajorKeys(-1)).toStrictEqual({
      root: Note.of('F'),
      scale: MAJOR_SCALE,
      notes: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'].map(Note.of)
    })
  })

  it('should make a key with many flats', () => {
    expect(circleMajorKeys(-7)).toStrictEqual({
      root: Note.of('Cb'),
      scale: MAJOR_SCALE,
      notes: ['Cb', 'Db', 'Eb', 'Fb', 'Gb', 'Ab', 'Bb'].map(Note.of)
    })
  })

  // it('should contain circle of fifth major keys', () => {
  //   const fMajor = CIRCLE_OF_FIFTHS["F"]["Major"]
  // })
})
