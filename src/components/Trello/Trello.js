import TrelloUI from './TrelloUI'
import Card from '@/js/Classes/Card'
import exampleDataCards from '@/js/exampleDataCards'

export default class Trello {
  #ui = new TrelloUI()
  #cards = exampleDataCards ?? { first: [], second: [], third: [] }
  #app
  #timer
  #element
  #columns
  #textarea
  #btnHidden
  #formAddCard
  #columnsArray
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

    this.#renderCards()
  }

  /**
   * Adds elements.
   *
   * @return {void} This function does not return anything.
   */
  #addElements() {
    this.#columns = this.#app.querySelector('[class*="columns"]')
    this.#columnsArray = [...this.#columns.children]
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

    this.#saveCard(text)
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
    this.#timer && clearTimeout(this.#timer)
    this.#ui.addPlaceholderWarning(this.#textarea)

    this.#timer = setTimeout(() => {
      this.#ui.removePlaceholderWarning(this.#textarea)
    }, 1000)
  }

  /**
   * Saves the card in this.#cards.
   *
   * @param {string} text - The text to be saved in the card.
   */
  #saveCard(text) {
    this.#cards[this.#currentColumn.id.replace(/column-/, '')].push(new Card(text))

    this.#renderCards()
  }

  /**
   * Renders the cards in the columns.
   *
   * This function resets the columns, then iterates over each column and its cards,
   * rendering each card in the column content.
   */
  #renderCards() {
    this.#resetColumns()

    this.#columnsArray.forEach((column) => {
      const columnContent = column.querySelector('[class*="column-content"]')
      const cardsInColumn = this.#cards[column.id.replace(/column-/, '')]

      cardsInColumn.forEach((card) => {
        columnContent.append(this.#ui.getCard(card.textContent))
      })
    })
  }

  /**
   * Resets the columns.
   */
  #resetColumns() {
    this.#columnsArray.forEach((column) => {
      this.#resetColumn(column)
    })
  }

  /**
   * Resets the column.
   *
   * @param {HTMLElement} column - The column to be reset.
   */
  #resetColumn(column) {
    column.querySelector('[class*="column-content"]').innerHTML = ''
  }
}
