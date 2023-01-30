import {Key, MAJOR_KEYS} from "@/lib/music/Keys";

export interface Props {
  musicalKey?: Key,
  clef?: 'bass' | 'treble'
}

export default function Staff({
                                musicalKey = MAJOR_KEYS['C'],
                                clef = 'treble'
                              }: Props) {
  return <>
  </>
}
