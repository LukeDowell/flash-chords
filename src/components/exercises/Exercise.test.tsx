import Exercise from "@/components/exercises/Exercise";
import {getKey} from "@/lib/music/Circle";
import {midiRender} from "../../jest.setup";
import {screen, waitFor} from "@testing-library/react";
import {NoteEmitter} from "../../note-emitter";

describe('a musical exercise', () => {
  it('should render a simple exercise', async () => {
    const config = {
      treble: [
        ['D4'],
        ['G4'],
        ['C4']
      ],
      bass: [
        ['D3'],
        ['G3'],
        ['C3'],
      ],
      timeSignature: '3/4',
      key: getKey('C', 'Major')
    }

    const [_, midiCallback] = midiRender(<Exercise config={config}/>)
    await new NoteEmitter(midiCallback)
      .keyPress(['D3', 'D4'])
      .keyPress(['G3', 'G4'])
      .keyPress(['C3', 'C4'])
      .play()

    await waitFor(() => {
      expect(screen.getByText("complete")).toBeVisible()
    })
  })
})
