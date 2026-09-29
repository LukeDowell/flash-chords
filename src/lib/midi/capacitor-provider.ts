import {Capacitor} from '@capacitor/core'
import {CapacitorMIDIDevice} from '@eugabrielsilva/capacitor-midi-device'
import type {MidiMessage} from '@eugabrielsilva/capacitor-midi-device'
import {registerCapacitorProvider} from './midi-access'

type Listener<E> = (event: E) => void

class CapacitorMidiInput extends EventTarget {
  readonly id: string
  readonly name: string
  readonly manufacturer = ''
  readonly type = 'input' as const
  readonly state = 'connected' as const
  readonly connection = 'open' as const
  readonly version = ''

  onmidimessage: Listener<WebMidi.MIDIMessageEvent> | null = null

  private readonly _access: CapacitorMidiAccess
  private _opened = false

  constructor(access: CapacitorMidiAccess, deviceNumber: number, name: string) {
    super()
    this._access = access
    this.id = String(deviceNumber)
    this.name = name
  }

  fireMessage(bytes: number[]) {
    const data = new Uint8Array(bytes)
    const event = {data, receivedTime: performance.now()} as unknown as WebMidi.MIDIMessageEvent
    this.onmidimessage?.(event)
    this.dispatchEvent(new MessageEvent('midimessage', {data: event}))
  }

  addEventListener(type: string, listener: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean) {
    super.addEventListener(type, listener, options)
    if (type === 'midimessage' && !this._opened) {
      this._opened = true
      void this._access.openInput(this)
    }
  }

  async open() { return this }
  async close() { return this }
}

class CapacitorMidiAccess extends EventTarget {
  readonly inputs: Map<string, CapacitorMidiInput> = new Map()
  readonly outputs: Map<string, unknown> = new Map()
  readonly sysexEnabled = false
  onstatechange: Listener<WebMidi.MIDIConnectionEvent> | null = null

  private _activeInputId: string | undefined
  private _msgHandle: {remove: () => Promise<void>} | undefined

  async init() {
    await this._refreshDevices()
    await CapacitorMIDIDevice.initConnectionListener()
    await CapacitorMIDIDevice.addListener('MIDI_CON_EVENT', async () => {
      await this._refreshDevices()
      const event = {port: undefined} as unknown as WebMidi.MIDIConnectionEvent
      this.onstatechange?.(event)
      this.dispatchEvent(new Event('statechange'))
    })
  }

  private async _refreshDevices() {
    const {value: names} = await CapacitorMIDIDevice.listMIDIDevices()
    this.inputs.clear()
    names.forEach((name, i) => {
      this.inputs.set(String(i), new CapacitorMidiInput(this, i, name))
    })
  }

  async openInput(input: CapacitorMidiInput) {
    if (this._activeInputId === input.id) return
    if (this._msgHandle) await this._msgHandle.remove()
    await CapacitorMIDIDevice.openDevice({deviceNumber: Number(input.id)})
    this._activeInputId = input.id
    this._msgHandle = await CapacitorMIDIDevice.addListener('MIDI_MSG_EVENT', (message: MidiMessage) => {
      const active = this._activeInputId ? this.inputs.get(this._activeInputId) : undefined
      active?.fireMessage(message.data)
    })
  }
}

async function createCapacitorMidiAccess(): Promise<WebMidi.MIDIAccess> {
  const access = new CapacitorMidiAccess()
  await access.init()
  return access as unknown as WebMidi.MIDIAccess
}

if (Capacitor.isNativePlatform()) {
  registerCapacitorProvider(() => createCapacitorMidiAccess())
}
