import {Note} from "@/lib/music/Note";
import {Accidental, ChordSymbol, StaveNote} from "vexflow";

type NotesToStaveNoteOptions = {
  chordSymbolText?: string,
  fillStyle?: string
}

export const notesToStaveNote = (notes: Note[], options?: NotesToStaveNoteOptions): StaveNote => {
  const keys = notes.map(n => `${n.root.concat(n.accidental?.symbol || "")}/${n.octave}`)
  const staveNote = new StaveNote({keys, duration: 'w', auto_stem: true});
  notes.forEach((n, i) => {
    if (n?.accidental?.symbol) staveNote.addModifier(new Accidental(n.accidental.symbol), i)
  })

  if (options?.chordSymbolText) staveNote.addModifier(new ChordSymbol().setFontSize(16).addGlyphOrText(options.chordSymbolText.toString()))
  if (options?.fillStyle) staveNote.setStyle({fillStyle: options.fillStyle, strokeStyle: options.fillStyle})

  return staveNote
}
