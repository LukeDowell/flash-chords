export type MidiAccessProvider = () => Promise<WebMidi.MIDIAccess>

const webProvider: MidiAccessProvider = () => navigator.requestMIDIAccess()

let capacitorProvider: MidiAccessProvider | undefined

export function registerCapacitorProvider(provider: MidiAccessProvider) {
  capacitorProvider = provider
}

function isCapacitorNative(): boolean {
  if (typeof window === 'undefined') return false
  const cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor
  return cap?.isNativePlatform?.() === true
}

export function getMidiAccess(): Promise<WebMidi.MIDIAccess> {
  if (isCapacitorNative() && capacitorProvider) return capacitorProvider()
  return webProvider()
}
