import type {CapacitorMIDIDevice as CapacitorMIDIDeviceType} from '@eugabrielsilva/capacitor-midi-device'

jest.mock('@capacitor/core', () => ({
  Capacitor: {isNativePlatform: () => true}
}))

jest.mock('@eugabrielsilva/capacitor-midi-device', () => ({
  CapacitorMIDIDevice: {
    listMIDIDevices: jest.fn(),
    initConnectionListener: jest.fn(),
    addListener: jest.fn(),
    openDevice: jest.fn(),
  }
}))

const flush = () => new Promise(resolve => setTimeout(resolve, 0))

describe('capacitor midi provider', () => {
  let mockedDevice: jest.Mocked<typeof CapacitorMIDIDeviceType>
  let nativeListeners: Map<string, (event: any) => void>

  beforeEach(() => {
    // midi-access caches module state, so each test needs a fresh registry;
    // the mocked plugin must then be re-required from that same registry.
    jest.resetModules()
    mockedDevice = jest.mocked(require('@eugabrielsilva/capacitor-midi-device').CapacitorMIDIDevice)
    nativeListeners = new Map()
    mockedDevice.listMIDIDevices.mockResolvedValue({value: ['Piano A', 'Piano B']})
    mockedDevice.initConnectionListener.mockResolvedValue(undefined)
    mockedDevice.openDevice.mockResolvedValue(undefined as any)
    mockedDevice.addListener.mockImplementation(async (eventName: string, callback: (event: any) => void) => {
      nativeListeners.set(eventName, callback)
      return {remove: jest.fn().mockResolvedValue(undefined)} as any
    })
  })

  async function getAccess(): Promise<WebMidi.MIDIAccess> {
    const {getMidiAccess} = await import('./midi-access')
    return getMidiAccess()
  }

  it('routes to the capacitor provider on native platforms without a side-effect import', async () => {
    const access = await getAccess()
    expect(Array.from(access.inputs.keys())).toEqual(['0', '1'])
  })

  it('returns the same access instance on repeated calls', async () => {
    const {getMidiAccess} = await import('./midi-access')
    const first = await getMidiAccess()
    const second = await getMidiAccess()
    expect(Array.from(first.inputs.keys())).toEqual(['0', '1'])
    expect(second).toBe(first)
  })

  it('delivers midi bytes as event.data to addEventListener subscribers', async () => {
    const access = await getAccess()
    const input = access.inputs.get('0')!
    const received: WebMidi.MIDIMessageEvent[] = []
    input.addEventListener('midimessage', (e: Event) => received.push(e as unknown as WebMidi.MIDIMessageEvent))
    await flush()

    nativeListeners.get('MIDI_MSG_EVENT')!({data: [144, 60, 100]})

    expect(received).toHaveLength(1)
    expect(received[0].data[0]).toBe(144)
    expect(received[0].data[1]).toBe(60)
    expect(received[0].data[2]).toBe(100)
  })

  it('keeps existing input instances across a device refresh', async () => {
    const access = await getAccess()
    const original = access.inputs.get('0')
    const received: WebMidi.MIDIMessageEvent[] = []
    original!.addEventListener('midimessage', (e: Event) => received.push(e as unknown as WebMidi.MIDIMessageEvent))
    await flush()

    await nativeListeners.get('MIDI_CON_EVENT')!({})

    expect(access.inputs.get('0')).toBe(original)

    nativeListeners.get('MIDI_MSG_EVENT')!({data: [144, 60, 100]})
    expect(received).toHaveLength(1)
  })

  it('retries opening the device after a failed open', async () => {
    mockedDevice.openDevice
      .mockRejectedValueOnce(new Error('transient plugin error'))
      .mockResolvedValue(undefined as any)
    const access = await getAccess()
    const input = access.inputs.get('0')!

    input.addEventListener('midimessage', jest.fn())
    await flush()
    expect(mockedDevice.openDevice).toHaveBeenCalledTimes(1)

    input.addEventListener('midimessage', jest.fn())
    await flush()
    expect(mockedDevice.openDevice).toHaveBeenCalledTimes(2)
    expect(nativeListeners.has('MIDI_MSG_EVENT')).toBe(true)
  })
})
