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

  /**
   * Initializes the constructor with the provided element.
   *
   * @param {any} element - The element to be used in the constructor.
   */
  constructor(element) {
    this.#element = this.#ui.getElement(element)
  }

  /**
   * Initializes the app.
   *
   * @return {void} This function does not return anything.
   */
  init() {
    this.#app = this.#ui.app
    this.#element.append(this.#app)

    this.#addElements()
    this.#addEventsListeners()
  }

  /**
   * Adds elements.
   *
   * @return {void} This function does not return anything.
   */
  #addElements() {
    this.#columns = this.#app.querySelector('[class*="columns"]')
  }

  /**
   * Adds events listeners.
   *
   * @return {void} This function does not return anything.
   */
  #addEventsListeners() {
    this.#columns.addEventListener('click', this.#onClickColumns)
  }

  /**
   * Handles events.
   * Depending on the clicked element, calls handlers
   *
   * @param {Event} event - The event object.
   * @return {void} This function does not return anything.
   */
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

  /**
   * Opens the form add card.
   */
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

  /**
   * Closes the form add card.
   */
  #closeFormAddCard() {
    this.#formAddCard && this.#formAddCard.remove()
    this.#btnHidden && this.#toggleBtnAddCard(this.#btnHidden)
    this.#currentColumn = null
    this.#formAddCard = null
    this.#btnHidden = null
  }

  /**
   * Toggles the visibility of the add card button by adding or removing the 'hide' class from its classList.
   */
  #toggleBtnAddCard() {
    this.#ui.toggleBtnHidden(this.#btnHidden)
  }

  /**
   * Handles the submit event of the form.
   *
   * @param {Event} e - The submit event.
   */
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

  /**
   * Displays a message when the textarea is empty.
   */
  #showMessageNoEmptyCard() {
    this.#textarea.placeholder = 'Please, write something here...'
  }

  /**
   * Highlights the placeholder in red for 1 second.
   */
  #highlightMessageNoEmptyCard() {
    this.#ui.togglePlaceholderColor(this.#textarea)
    setTimeout(() => {
      this.#ui.togglePlaceholderColor(this.#textarea)
    }, 1000)
  }
}
