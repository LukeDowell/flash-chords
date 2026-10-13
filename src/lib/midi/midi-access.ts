import {Capacitor} from '@capacitor/core'

export type MidiAccessProvider = () => Promise<WebMidi.MIDIAccess>

let webAccess: Promise<WebMidi.MIDIAccess> | undefined

/** Drops the cached web MIDI access so the next call requests it anew */
export function resetMidiAccessCache() {
  webAccess = undefined
}

// Cached so repeated callers share one browser permission request; a rejected
// request is evicted so the user can retry after denying access
const webProvider: MidiAccessProvider = () => {
  webAccess ??= navigator.requestMIDIAccess().catch(e => {
    webAccess = undefined
    throw e
  })
  return webAccess
}

let capacitorProvider: MidiAccessProvider | undefined
let capacitorAccess: Promise<WebMidi.MIDIAccess> | undefined

export function registerCapacitorProvider(provider: MidiAccessProvider) {
  capacitorProvider = provider
  capacitorAccess = undefined
}

function isCapacitorNative(): boolean {
  return typeof window !== 'undefined' && Capacitor.isNativePlatform()
}

export async function getMidiAccess(): Promise<WebMidi.MIDIAccess> {
  if (!isCapacitorNative()) return webProvider()
  if (!capacitorProvider) {
    // The provider registers itself as an import side effect; loading it lazily
    // here avoids relying on a UI component keeping a side-effect import alive.
    await import('./capacitor-provider')
  }
  if (!capacitorProvider) return webProvider()
  // Each CapacitorMidiAccess registers its own native listeners, so there must
  // only ever be one per app lifetime.
  capacitorAccess ??= capacitorProvider()
  return capacitorAccess
}
