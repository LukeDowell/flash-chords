import {KEYBOARD, toNote} from "@/lib/music/Note";
import _ from "lodash";

describe("a midi piano", () => {
  it('should be able to get the index of the note', () => {
    const note = toNote("A#0")
    const indexOfNote = KEYBOARD.findIndex((keyboardNote) => {
      return _.isEqual(keyboardNote, note);
    })

    expect(indexOfNote).toBe(1)
  })
})