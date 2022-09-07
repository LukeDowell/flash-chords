import MIDIPiano from "../music/MIDIPiano";

export default class Game {
  #piano: MIDIPiano

  constructor(piano: MIDIPiano) {
    this.#piano = piano
  }
}
