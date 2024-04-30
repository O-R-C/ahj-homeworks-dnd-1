import TrelloUI from './TrelloUI'

export default class Trello {
  #ui = new TrelloUI()
  #app
  #element
  #columns
  #textarea
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

    if (btn.closest('button[type="submit"]')) {
      this.#submitFormAddCard(event)
    }
  }

  #openFormAddCard(btn) {
    this.#closeFormAddCard()
    const parent = btn.closest('div[class*="add-card"]')
    const containerFormAddCard = parent.querySelector('[class*="form-container"]')

    this.#currentColumn = parent.closest('[class*="column"]')
    this.#formAddCard = this.#ui.getFormAddCard()

    containerFormAddCard.append(this.#formAddCard)
    this.#textarea = this.#formAddCard.textToCard
    this.#textarea.focus()

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

  #submitFormAddCard(e) {
    e.preventDefault()

    const text = this.#textarea.value

    if (!text) {
      this.#showMessageNoEmptyCard()
      this.#highlightMessageNoEmptyCard()
      return
    }

    const content = this.#currentColumn.querySelector('[class*="column-content"]')
    content.append(this.#ui.getCard(text))
    this.#closeFormAddCard()
  }

  #showMessageNoEmptyCard() {
    this.#textarea.placeholder = 'Please, write something'
  }

  #highlightMessageNoEmptyCard() {
    this.#ui.togglePlaceholderColor(this.#textarea)
    setTimeout(() => {
      this.#ui.togglePlaceholderColor(this.#textarea)
    }, 1000)
  }
}
