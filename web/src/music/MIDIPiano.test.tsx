import {KEYBOARD, toNote} from "./Note";
import _ from "lodash";
import React from "react";

describe("a midi piano", () => {
  it('should be able to get the index of the note', () => {
    const note = toNote("A#0")
    const indexOfNote = KEYBOARD.findIndex((keyboardNote) => {
      return _.isEqual(keyboardNote, note);
    })

    expect(indexOfNote).toBe(1)
  })
})
