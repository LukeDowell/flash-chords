

export type Pitch = number // MIDI value, middle C = 60
export const Flat = (n: Pitch) => n - 1
export const Sharp = (n: Pitch) => n + 1
export const Scale = (n: Pitch, intervals: number[]): Pitch[] => intervals.reduce(
  (p, c) => {
    return p.concat(p.reduce((x, y) => x + y) + c)
}, [n])

export const Major = [2, 2, 1, 2, 2, 2, 1]
export const Minor = [2, 1, 2, 2, 1, 2, 2]
export const Pentatonic = [2, 2, 3, 2, 3]
