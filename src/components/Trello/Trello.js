import TrelloUI from './TrelloUI'

export default class Trello {
  #ui = new TrelloUI()
  #app
  #element

  constructor(element) {
    this.#app = this.#ui.app
    this.#element = this.#ui.getElement(element)
  }

  init() {
    this.#element.append(this.#app)
  }
}
