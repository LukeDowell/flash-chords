import {Note} from "@/lib/music/Note";
import {Accidental, ChordSymbol, StaveNote} from "vexflow";
import {Chord} from "@/lib/music/Chord";

type NotesToStaveNoteOptions = {
  chord?: Chord,
  fillStyle?: string
}

export const notesToStaveNote = (notes: Note[], options?: NotesToStaveNoteOptions): StaveNote => {
  if (notes.some(n => n.octave === undefined)) throw new Error('Notes need an octave in order to be placed on the staff')
  const keys = notes.map(n => `${n.root.concat(n.accidental?.symbol || "")}/${n.octave}`)
  const staveNote = new StaveNote({keys, duration: 'w', auto_stem: true});
  notes.forEach((n, i) => {
    if (n?.accidental?.symbol) staveNote.addModifier(new Accidental(n.accidental.symbol), i)
  })

  if (options?.chord) staveNote.addModifier(chordToChordSymbol(options.chord))
  if (options?.fillStyle) staveNote.setStyle({fillStyle: options.fillStyle, strokeStyle: options.fillStyle})

  return staveNote
}

export const chordToChordSymbol = (c: Chord): ChordSymbol => {
  return new ChordSymbol().addGlyphOrText(c.toString())
    .setFontSize(18)
    .setHorizontal('center')
}
