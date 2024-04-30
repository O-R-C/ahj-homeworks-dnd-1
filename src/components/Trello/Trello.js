import TrelloUI from './TrelloUI'

export default class Trello {
  #ui = new TrelloUI()
  #app
  #element
  #columns

  constructor(element) {
    this.#element = this.#ui.getElement(element)
  }

  init() {
    this.#app = this.#ui.app
    this.#element.append(this.#app)

    this.addElements()
  }

  addElements() {
    this.#columns = this.#app.querySelector('[class*="columns"]')
  }

  addEventsListeners() {
    this.#columns.addEventListener('click', this.#onClickColumns)
  }

  #onClickColumns = (event) => {
    const target = event.target
    console.log('🚀 ~ target:', target)
  }
}
