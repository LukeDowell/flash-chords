import {MAJOR_SCALE, WHOLE_TONE_SCALE} from '@/lib/music/Scale'

describe('a musical scale', () => {
  it('should know whether or not it is diatonic', () => {
    expect(MAJOR_SCALE.isDiatonic).toBeTruthy()
    expect(WHOLE_TONE_SCALE.isDiatonic).toBeFalsy()
  })

  it('should calculate the amount of semitones from the root', () => {
    expect(MAJOR_SCALE.semitonesFromRoot).toStrictEqual([2, 4, 5, 7, 9, 11, 12])
  })
})
