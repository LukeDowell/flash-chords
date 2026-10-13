jest.mock('@capacitor/core', () => ({
  Capacitor: {isNativePlatform: () => false}
}))

describe('getMidiAccess on the web', () => {
  beforeEach(() => {
    // midi-access caches module state, so each test needs a fresh registry
    jest.resetModules()
  })

  it('should only request midi access once across repeated calls', async () => {
    const access = {inputs: new Map()} as unknown as WebMidi.MIDIAccess
    const request = jest.fn().mockResolvedValue(access)
    global.navigator.requestMIDIAccess = request

    const {getMidiAccess} = await import('./midi-access')
    const first = await getMidiAccess()
    const second = await getMidiAccess()

    expect(first).toBe(second)
    expect(request).toHaveBeenCalledTimes(1)
  })

  it('should retry after a failed access request instead of caching the rejection', async () => {
    const access = {inputs: new Map()} as unknown as WebMidi.MIDIAccess
    const request = jest.fn()
      .mockRejectedValueOnce(new Error('denied'))
      .mockResolvedValue(access)
    global.navigator.requestMIDIAccess = request

    const {getMidiAccess} = await import('./midi-access')
    await expect(getMidiAccess()).rejects.toThrow('denied')
    await expect(getMidiAccess()).resolves.toBe(access)
    expect(request).toHaveBeenCalledTimes(2)
  })
})
