import {Note} from "@/lib/music/Note";
import {Accidental, ChordSymbol, StaveNote} from "vexflow";

type NotesToStaveNoteOptions = {
  chordSymbolText?: string,
  fillStyle?: string
}

export const notesToStaveNote = (notes: Note[], options?: NotesToStaveNoteOptions): StaveNote => {
  if (notes.some(n => n.octave === undefined)) throw new Error('Notes need an octave in order to be placed on the staff')
  const keys = notes.map(n => `${n.root.concat(n.accidental?.symbol || "")}/${n.octave}`)
  const staveNote = new StaveNote({keys, duration: 'w', auto_stem: true});
  notes.forEach((n, i) => {
    if (n?.accidental?.symbol) {
      const accidental = new Accidental(n.accidental.symbol);
      staveNote.addModifier(accidental, i)
    }
  })

  if (options?.chordSymbolText) staveNote.addModifier(new ChordSymbol().setFontSize(16).addGlyphOrText(options.chordSymbolText.toString()))
  if (options?.fillStyle) staveNote.setStyle({fillStyle: options.fillStyle, strokeStyle: options.fillStyle})

  return staveNote
}
