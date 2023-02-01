import {ELEVENTH, FChord, MAJOR_THIRD, MINOR_THIRD, NINTH, SEVENTH, THIRTEENTH} from "@/lib/music/v2";
import {Note} from "@/lib/music/Note";

describe('a chord',  () => {
  it('should calculate its intervals', () => {
    expect(new FChord(Note.of('C'), "Major").intervals()).toStrictEqual([4, 3])
    expect(new FChord(Note.of('C'), "Minor").intervals()).toStrictEqual([3, 4])
    expect(new FChord(Note.of('C'), "Diminished").intervals()).toStrictEqual([3, 3])
    expect(new FChord(Note.of('C'), "Augmented").intervals()).toStrictEqual([4, 4])
  })

  it('should calculate intervals with seventh extensions', () => {
    const C = Note.of('C4')

    expect(new FChord(C, "Diminished", [[SEVENTH, MINOR_THIRD]]).intervals()).toStrictEqual([3, 3, 3]) // Fully Diminished
    expect(new FChord(C, "Diminished", [[SEVENTH, MAJOR_THIRD]]).intervals()).toStrictEqual([3, 3, 4]) // Half Diminished
    expect(new FChord(C, "Minor", [[SEVENTH, MINOR_THIRD]]).intervals()).toStrictEqual([3, 4, 3]) // Minor 7th
    expect(new FChord(C, "Minor", [[SEVENTH, MAJOR_THIRD]]).intervals()).toStrictEqual([3, 4, 4]) // Minor Major
    expect(new FChord(C, "Major", [[SEVENTH, MINOR_THIRD]]).intervals()).toStrictEqual([4, 3, 3]) // Dominant
    expect(new FChord(C, "Major", [[SEVENTH, MAJOR_THIRD]]).intervals()).toStrictEqual([4, 3, 4]) // Major 7th
  })

  it('should calculate intervals with higher extensions', () => {
    const C = Note.of('C4')

    expect(new FChord(C, "Major", [[SEVENTH, MINOR_THIRD]]).intervals()).toStrictEqual([4, 3, 3])
    expect(new FChord(C, "Major", [[NINTH, MAJOR_THIRD]]).intervals()).toStrictEqual([4, 3, 0, 4])
    expect(new FChord(C, "Minor", [[ELEVENTH, MINOR_THIRD]]).intervals()).toStrictEqual([3, 4, 0, 0, 3])
    expect(new FChord(C, "Minor", [[THIRTEENTH, MAJOR_THIRD]]).intervals()).toStrictEqual([3, 4, 0, 0, 0, 4])
  })

  it('should tell me the required notes for a chord', () => {
    const Cmaj7 = new FChord(Note.of('C'), "Major", [[SEVENTH, MAJOR_THIRD]])
    const Dbmaj7 = new FChord(Note.of('Db'), "Major", [[SEVENTH, MAJOR_THIRD]])

    expect(Cmaj7.notes()).toStrictEqual(['C', 'E', 'G', 'B'].map(Note.of))
    expect(Dbmaj7.notes()).toStrictEqual(['C#', 'F', 'G#', 'C'].map(Note.of))
  })
})
