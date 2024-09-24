import {Renderer, StemmableNote, Vex} from "vexflow";
import {splitIntoMeasures} from "@/lib/vexMusic";
import _ from "lodash";

/**
 * @param width TODO what does width mean to vexflow? Max width? width-per-something?
 * @param trebleVoices An array of unbroken easyscore strings that contain durations. These will be automatically
 *                     broken up and placed into measures, with the last measure being filled with any rests as
 *                     necessary. These notes will be formatted to a treble stave.
 * @param bassVoices Same as trebleVoices, but will be formatted to a bass stave.
 */
interface RenderVexConfig {
  width?: number
  trebleVoice?: string
  bassVoice?: string
}

/**
 * @param elementId the id of an HTML element in which the music content will be rendered
 * @param config
 */
export function renderVex(elementId: string, config: RenderVexConfig = {}) {
  const vexWidth = config.width || 400
  const trebleVoice = config.trebleVoice || ""
  const bassVoice = config.bassVoice || ""

  if (trebleVoice.length === 0 && bassVoice.length === 0) {
    throw new Error("You need to have at least one voice in order to render!")
  }

  // Wipe the current score
  const outputDiv = document.getElementById(elementId) as HTMLDivElement
  if (outputDiv) outputDiv.innerHTML = ''

  const vf = new Vex.Flow.Factory({
    renderer: {
      backend: Renderer.Backends.SVG, elementId: elementId, width: vexWidth, height: 1400
    },
    stave: {
      space: 12
    }
  })
  const score = vf.EasyScore()
  const formatter = vf.Formatter()

  const trebleMeasures = trebleVoice.length > 0 ? splitIntoMeasures(trebleVoice) : []
  const bassMeasures = bassVoice.length > 0 ? splitIntoMeasures(bassVoice) : []

  _.zip(trebleMeasures, bassMeasures).forEach(([trebleMeasure, bassMeasure], i) => {
    const system = vf.System({
      x: i * 300,
      width: 300,
      formatOptions: {
        align_rests: true,
        auto_beam: true,
      },
    })

    function addVoice(voice: string, clef: 'treble' | 'bass') {
      let easyScoreNotes: StemmableNote[] = []
      if (['8', '16', '32'].some((d) => voice.includes(d))) easyScoreNotes = score.beam(score.notes(voice, {clef}))
      else easyScoreNotes = score.notes(voice, {clef})

      const easyScoreVoice = score.voice(easyScoreNotes)
      formatter.joinVoices([easyScoreVoice])
      const stave = system.addStave({voices: [easyScoreVoice]}).setMeasure(i)
      if (i === 0) {
        stave.addClef(clef)
          .addTimeSignature('4/4')
      }
    }

    if (trebleMeasure && trebleMeasure.length > 0) addVoice(trebleMeasure, 'treble')
    if (bassMeasure && bassMeasure.length > 0) addVoice(bassMeasure, 'bass')

    if (i === 0) {
      system.addConnector()
    }
  })

  vf.draw()
}
