import TrelloUI from './TrelloUI'

export default class Trello {
  #ui = new TrelloUI()
  #app
  #element
  #columns
  #btnHidden
  #formAddCard
  #currentColumn

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

    if (btn.closest('[class*="add-card__button-add"]')) {
      this.#openFormAddCard(btn)
    }

    if (btn.closest('button[type="reset"]')) {
      this.#closeFormAddCard()
    }
  }

  #openFormAddCard(btn) {
    this.#closeFormAddCard()
    const parent = btn.closest('div[class*="add-card"]')
    const containerFormAddCard = parent.querySelector('[class*="form-container"]')

    this.#currentColumn = parent.closest('[class*="column"]')
    this.#formAddCard = this.#ui.getFormAddCard()

    containerFormAddCard.append(this.#formAddCard)
    this.#formAddCard.textToCard.focus()

    this.#btnHidden = btn
    this.#toggleBtnAddCard()
  }

  #closeFormAddCard() {
    this.#formAddCard && this.#formAddCard.remove()
    this.#btnHidden && this.#toggleBtnAddCard(this.#btnHidden)
    this.#currentColumn = null
    this.#formAddCard = null
    this.#btnHidden = null
  }

  #toggleBtnAddCard() {
    this.#ui.toggleBtnHidden(this.#btnHidden)
  }
}
