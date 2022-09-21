import {Chord, requiredNotesForChord, toChord} from "./Chord";
import {Accidental, ALL_ROOTS, FLAT, NATURAL, Note, noteToSymbol, Root, SHARP, toNote} from "./Note";

export type KeyQuality = "Major" | "Natural Minor" | "Harmonic Minor" | "Melodic Minor"

export interface KeyInterface {
  name: string,

  notes: Note[],

  quality: KeyQuality,

  /** Diatonic seventh chords for this key */
  diatonicChords: Chord[],
}

export class Key implements KeyInterface {
  name: string;
  notes: Note[];
  quality: KeyQuality;
  diatonicChords: Chord[];

  constructor(notes: Note[], quality: KeyQuality) {
    this.name = `${noteToSymbol(notes[0])} ${quality}`
    this.notes = notes
    this.quality = quality
    this.diatonicChords = getDiatonicChords(notes, quality)
  }

  requiredNotes(c: Chord): Note[] {
    return formatNotesInKey(requiredNotesForChord(c), this)
  }
}

const DIATONIC_QUALITIES: Record<KeyQuality, string[]> = {
  'Major': ['maj7', 'm7', 'm7', 'maj7', '7', 'm7', 'm7b5'],
  'Natural Minor': ['m7', 'm7b5', 'maj7', 'm7', 'm7', 'maj7', '7'],
  'Harmonic Minor': ['m7', 'm7b5', 'mM7', 'm7', '7', 'maj7', 'o7'],
  'Melodic Minor': ['mM7', 'm7', 'augM7', '7', '7', 'm7b5', 'm7b5'],
}

export const getDiatonicChords = (notes: Note[], quality: KeyQuality = "Major"): Chord[] => {
  if (notes.length !== 7) throw new Error('Provided note array must have length of 7')
  const noteSymbols = notes.map((n) => new Note(n.root, n.accidental, undefined)).map(noteToSymbol)
  const [first, second, third, fourth, fifth, sixth, seventh] = noteSymbols
  return [
    first.concat(DIATONIC_QUALITIES[quality][0]),
    second.concat(DIATONIC_QUALITIES[quality][1]),
    third.concat(DIATONIC_QUALITIES[quality][2]),
    fourth.concat(DIATONIC_QUALITIES[quality][3]),
    fifth.concat(DIATONIC_QUALITIES[quality][4]),
    sixth.concat(DIATONIC_QUALITIES[quality][5]),
    seventh.concat(DIATONIC_QUALITIES[quality][6]),
  ].map(toChord)
}

export const MAJOR_KEYS: Record<string, Key> = {
  'Cb': new Key(['Cb', 'Db', 'Eb', 'Fb', 'Gb', 'Ab', 'Bb'].map(toNote), "Major"),
  'Gb': new Key(['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F'].map(toNote), "Major"),
  'Db': new Key(['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'].map(toNote), "Major"),
  'Ab': new Key(['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'].map(toNote), "Major"),
  'Eb': new Key(['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'].map(toNote), "Major"),
  'Bb': new Key(['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'].map(toNote), "Major"),
  'F': new Key(['F', 'G', 'A', 'Bb', 'C', 'D', 'E'].map(toNote), "Major"),
  'C': new Key(['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(toNote), "Major"),
  'G': new Key(['G', 'A', 'B', 'C', 'D', 'E', 'F#'].map(toNote), "Major"),
  'D': new Key(['D', 'E', 'F#', 'G', 'A', 'B', 'C#'].map(toNote), "Major"),
  'A': new Key(['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'].map(toNote), "Major"),
  'E': new Key(['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'].map(toNote), "Major"),
  'B': new Key(['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'].map(toNote), "Major"),
  'F#': new Key(['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'].map(toNote), "Major"),
  'C#': new Key(['C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#'].map(toNote), "Major"),
}

export const MINOR_KEYS: Record<string, Key> = {
  'Eb': new Key(['Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb', 'Db'].map(toNote), "Natural Minor"),
  'Bb': new Key(['Bb', 'C', 'Db', 'Eb', 'F', 'Gb', 'Ab'].map(toNote), "Natural Minor"),
  'F': new Key(['F', 'G', 'Ab', 'Bb', 'C', 'Db', 'Eb'].map(toNote), "Natural Minor"),
  'C': new Key(['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'].map(toNote), "Natural Minor"),
  'G': new Key(['G', 'A', 'Bb', 'C', 'D', 'Eb', 'F'].map(toNote), "Natural Minor"),
  'D': new Key(['D', 'E', 'F', 'G', 'A', 'Bb', 'C'].map(toNote), "Natural Minor"),
  'A': new Key(['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(toNote), "Natural Minor"),
  'E': new Key(['E', 'F#', 'G', 'A', 'B', 'C', 'D'].map(toNote), "Natural Minor"),
  'B': new Key(['B', 'C#', 'D', 'E', 'F#', 'G', 'A'].map(toNote), "Natural Minor"),
  'F#': new Key(['F#', 'G#', 'A', 'B', 'C#', 'D', 'E'].map(toNote), "Natural Minor"),
  'C#': new Key(['C#', 'D#', 'E', 'F#', 'G#', 'A', 'B'].map(toNote), "Natural Minor"),
  'G#': new Key(['G#', 'A#', 'B', 'C#', 'D#', 'E', 'F#'].map(toNote), "Natural Minor"),
  'D#': new Key(['D#', 'E#', 'F#', 'G#', 'A#', 'B', 'C#'].map(toNote), "Natural Minor"),
}

export const HARMONIC_MINOR_KEYS: Record<string, Key> = {
  'Eb': new Key(['Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb', 'D'].map(toNote), "Harmonic Minor"),
  'Bb': new Key(['Bb', 'C', 'Db', 'Eb', 'F', 'Gb', 'A'].map(toNote), "Harmonic Minor"),
  'F': new Key(['F', 'G', 'Ab', 'Bb', 'C', 'Db', 'E'].map(toNote), "Harmonic Minor"),
  'C': new Key(['C', 'D', 'Eb', 'F', 'G', 'Ab', 'B'].map(toNote), "Harmonic Minor"),
  'G': new Key(['G', 'A', 'Bb', 'C', 'D', 'Eb', 'F#'].map(toNote), "Harmonic Minor"),
  'D': new Key(['D', 'E', 'F', 'G', 'A', 'Bb', 'C#'].map(toNote), "Harmonic Minor"),
  'A': new Key(['A', 'B', 'C', 'D', 'E', 'F', 'G#'].map(toNote), "Harmonic Minor"),
  'E': new Key(['E', 'F#', 'G', 'A', 'B', 'C', 'D#'].map(toNote), "Harmonic Minor"),
  'B': new Key(['B', 'C#', 'D', 'E', 'F#', 'G', 'A#'].map(toNote), "Harmonic Minor"),
  'F#': new Key(['F#', 'G#', 'A', 'B', 'C#', 'D', 'E#'].map(toNote), "Harmonic Minor"),
  'C#': new Key(['C#', 'D#', 'E', 'F#', 'G#', 'A', 'B#'].map(toNote), "Harmonic Minor"),
  'G#': new Key(['G#', 'A#', 'B', 'C#', 'D#', 'E', 'F##'].map(toNote), "Harmonic Minor"),
  'D#': new Key(['D#', 'E#', 'F#', 'G#', 'A#', 'B', 'C##'].map(toNote), "Harmonic Minor"),
}

export const MELODIC_MINOR_KEYS: Record<string, Key> = {
  'Eb': new Key(['Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb', 'D'].map(toNote), "Melodic Minor"),
  'Bb': new Key(['Bb', 'C', 'Db', 'Eb', 'F', 'Gb', 'A'].map(toNote), "Melodic Minor"),
  'F': new Key(['F', 'G', 'Ab', 'Bb', 'C', 'Db', 'E'].map(toNote), "Melodic Minor"),
  'C': new Key(['C', 'D', 'Eb', 'F', 'G', 'Ab', 'B'].map(toNote), "Melodic Minor"),
  'G': new Key(['G', 'A', 'Bb', 'C', 'D', 'Eb', 'F#'].map(toNote), "Melodic Minor"),
  'D': new Key(['D', 'E', 'F', 'G', 'A', 'Bb', 'C#'].map(toNote), "Melodic Minor"),
  'A': new Key(['A', 'B', 'C', 'D', 'E', 'F', 'G#'].map(toNote), "Melodic Minor"),
  'E': new Key(['E', 'F#', 'G', 'A', 'B', 'C', 'D#'].map(toNote), "Melodic Minor"),
  'B': new Key(['B', 'C#', 'D', 'E', 'F#', 'G', 'A#'].map(toNote), "Melodic Minor"),
  'F#': new Key(['F#', 'G#', 'A', 'B', 'C#', 'D', 'E#'].map(toNote), "Melodic Minor"),
  'C#': new Key(['C#', 'D#', 'E', 'F#', 'G#', 'A', 'B#'].map(toNote), "Melodic Minor"),
  'G#': new Key(['G#', 'A#', 'B', 'C#', 'D#', 'E', 'F##'].map(toNote), "Melodic Minor"),
  'D#': new Key(['D#', 'E#', 'F#', 'G#', 'A#', 'B', 'C##'].map(toNote), "Melodic Minor"),
}

export const KEYS: Key[] = [
  ...Object.values(MAJOR_KEYS),
  ...Object.values(MINOR_KEYS),
  // ...Object.values(MELODIC_MINOR_KEYS),
]

export const keyOf = (root: string, quality: KeyQuality): Key | undefined => {
  switch (quality) {
    case "Major":
      return MAJOR_KEYS[root] || undefined
    case "Natural Minor":
      return MINOR_KEYS[root] || undefined
    default:
      return undefined
  }
}

/**
 * This function takes a series of notes and makes sure that they are rendered in a compatible
 * way for a given key.
 *
 * Ex. Dbmaj7 on a standardized keyboard would be C#, G, A#, and C which isn't great due to the C# and C.
 * Those notes passed in with the Db key would result in Db, G, Bb, C
 *
 * No transposition has taken place, the notes are simply formatted in a way that makes sense under a given
 * key
 */
export const formatNoteInKey = (note: Note, key: Key): Note => {
  if (key.notes.some((n) => note.equalsWithoutOctave(n))) return note

  let newRoot: Root
  let newAccidental: Accidental
  if (note.accidental) {
    const rootIndex = ALL_ROOTS.indexOf(note.root)
    let newIndex;
    if (rootIndex + note.accidental.mod <= 0) newIndex = ALL_ROOTS.length - 1
    else if (rootIndex + note.accidental.mod >= ALL_ROOTS.length) newIndex = 0
    else newIndex = rootIndex + note.accidental.mod

    newRoot = ALL_ROOTS[newIndex]
    newAccidental = note.accidental === FLAT ? SHARP : FLAT
  } else if (note.root === "B" && key.notes.some(n => n.equalsWithoutOctave(new Note("C", FLAT)))) {
    newRoot = "C"
    newAccidental = FLAT
  } else if (note.root === "C" && key.notes.some(n => n.equalsWithoutOctave(new Note("B", SHARP)))) {
    newRoot = "B"
    newAccidental = SHARP
  } else if (note.root === "E" && key.notes.some(n => n.equalsWithoutOctave(new Note("F", FLAT)))) {
    newRoot = "F"
    newAccidental = FLAT
  } else if (note.root === "F" && key.notes.some(n => n.equalsWithoutOctave(new Note("E", SHARP)))) {
    newRoot = "E"
    newAccidental = SHARP
  } else {
    newRoot = note.root
    newAccidental = NATURAL
  }

  let newOctave = note.octave
  if (note.octave && (note.root === 'C' || newRoot === 'C')) {
    if (note.root === 'C' && newRoot === 'B') newOctave = note.octave - 1
    else if (newRoot === 'C' && note.root === 'B') newOctave = note.octave + 1
  }

  return new Note(newRoot, newAccidental, newOctave)
}

export const formatNotesInKey = (notes: Note[], key: Key): Note[] => {
  return notes.map((n) => formatNoteInKey(n, key))
}

/**
 * Attempts to find a key in which the provided notes would occur naturally,
 * and then formats them accordingly. The chordRoot parameter is to restrict
 * any potentially invalid keys in the context of a chord. For example,
 * if the notes (C, D#, F#) were provided without a chord root restriction, then a
 * valid key might be Db major when the symantic intention might be C# major's B#dim
 *
 * A valid key:
 *  cannot mix accidentals
 *  cannot have any natural accidentals
 *  cannot have two notes with the same root, i.e no C and C#
 *  must contain the root of the provided chord
 */
export const symanticFormat = (notes: Note[], chord?: Chord): Note[] => {
  const chordRoot = chord ? new Note(chord.root, chord.accidental) : notes[0]
  const validKeysAndNotes = KEYS.filter((key) => {
    const chordNotesInKey = formatNotesInKey(notes, key)
    const chordNotesAsString = chordNotesInKey.map(n => n.toString()).join()
    const chordNotesOnlyRoots = chordNotesInKey.map(n => n.root)
    const hopefullyUniqueRoots = [...new Set(chordNotesOnlyRoots)]

    if (!chordNotesInKey.some(n => chordRoot.equalsWithoutOctave(n))) return false
    else if (chordNotesAsString.includes('#') && chordNotesAsString.includes('b')) return false // TODO this won't be true for too long, some of the weird minor keys have this
    else if (hopefullyUniqueRoots.length !== chordNotesOnlyRoots.length) return false

    return true
  }).map(k => [k, formatNotesInKey(notes, k)] as [Key, Note[]])
    .sort((k1: [Key, Note[]], k2: [Key, Note[]]) => {
      // Prefer keys with no naturals
      const hasNatural = (notes: Note[]) => notes.some(n => n.accidental === NATURAL)
      if (hasNatural(k1[1]) && hasNatural(k2[1])) return 0
      else if (hasNatural(k1[1]) && !hasNatural(k2[1])) return 1
      else if (!hasNatural(k1[1]) && hasNatural(k2[1])) return -1
      else return 0
    })
    .sort((k1: [Key, Note[]], k2: [Key, Note[]]) => {
      // Prefer keys containing all the required notes
      const hasAllNotes = (k: [Key, Note[]]) => k[1].every(n => k[0].notes.some(kn => n.equalsWithoutOctave(kn)))
      if (hasAllNotes(k1) && hasAllNotes(k2)) return 0
      else if (hasAllNotes(k1) && !hasAllNotes(k2)) return 1
      else if (!hasAllNotes(k1) && hasAllNotes(k2)) return -1
      else return 0
    })

  if (validKeysAndNotes.length === 0) {
    const key = KEYS.find(k => k.notes[0].equalsWithoutOctave(chordRoot))
    if (!key) {
      throw new Error(`No valid keys found for notes ${notes.map(n => n.toString()).join(', ')} with chord root ${noteToSymbol(chordRoot)}`)
    }
    return formatNotesInKey(notes, key)
  }

  const [_, formattedNotes] = validKeysAndNotes.pop()!!
  return formattedNotes
}
