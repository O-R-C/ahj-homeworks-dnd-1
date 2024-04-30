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

    this.#addElements()
    this.#addEventsListeners()
  }

  #addElements() {
    this.#columns = this.#app.querySelector('[class*="columns"]')
  }

  #addEventsListeners() {
    this.#columns.addEventListener('click', this.#onClickColumns)
  }

  #onClickColumns = (event) => {
    const btn = event.target

    if (btn.closest('[class*="add-card__button-add--QLXgs"]')) {
      this.#openFormAddCard(btn)
    }
  }

  #openFormAddCard(btn) {
    const controlEl = btn.closest('div[class*="add-card"]')
    const form = controlEl.querySelector('[class*="form-add-card"]')
    this.#ui.toggleFormAddCard(form)
  }
}
