import {fillWithRests, splitIntoMeasures} from "@/lib/vexMusic";

describe('vex music', () => {
  it('should place a list of notes into evenly divided measures', () => {
    const input = 'C2/q, D2, E2, F2, G2, A2, B2, C3, D3'
    const measures = splitIntoMeasures(input)

    // expect(measures.length).toBe(3)
    expect(measures[0]).toBe('C2/q, D2, E2, F2')
    expect(measures[1]).toBe('G2, A2, B2, C3')
    expect(measures[2]).toBe('D3, C4/h/r, C4/q/r')
  })

  test.each([
    ["", "/w/r"],
  ])(
    `%s measure should be filled with an %s rest`,
    (input: string, expectedRests: string) => expect(fillWithRests(input).includes('')).toBeTruthy()
  )
})
