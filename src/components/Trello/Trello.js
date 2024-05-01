import TrelloUI from './TrelloUI'
import Card from '@/js/Classes/Card'
import Storage from '@/js/Classes/Storage'
import exampleDataCards from '@/js/exampleDataCards'

/**
 * The Trello class.
 */
export default class Trello {
  #ui = new TrelloUI()
  #storage = new Storage()
  #cards = this.#storage.loadCards() ?? exampleDataCards ?? { first: [], second: [], third: [] }
  #app
  #element
  #columns
  #diffTop
  #diffLeft
  #textarea
  #currentId
  #btnHidden
  #ghostCard
  #formAddCard
  #cardDragged
  #columnsArray
  #timerMessage
  #timerTextarea
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
    this.#storage.loadTextarea() && this.#restoreTextarea()
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
    this.#columns.addEventListener('mousedown', this.#onMouseDownColumns)
  }

  /**
   * Restores the textarea from localStorage.
   *
   * @return {void} This function does not return anything.
   */
  #restoreTextarea() {
    const { id, textarea } = this.#storage.loadTextarea()

    if (!id || !textarea) return

    const currentColumn = this.#columnsArray.find((el) => el.id === id)
    const btnAdd = currentColumn.querySelector('[class*="add-card__button-add"]')
    this.#openFormAddCard(btnAdd)
    this.#textarea.value = textarea

    this.#storage.saveTextarea(id, textarea)
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

    if (!btn.closest('button')) return

    if (btn.closest('[class*="add-card__button-add"]')) {
      this.#openFormAddCard(btn)
      return
    }

    this.#setCurrentsParams(btn)

    if (btn.closest('button[type="reset"]')) {
      this.#closeFormAddCard()
      return
    }

    if (btn.closest('button[type="submit"]')) {
      this.#submitFormAddCard(event)
      return
    }

    if (btn.closest('[class*="card__button-delete"]')) {
      this.#deleteCard(btn)
      return
    }

    return
  }

  /**
   * Sets the current column and id.
   * @param {HTMLElement} btn - The button element.
   * @return {void} This function does not return anything.
   */
  #setCurrentsParams(btn) {
    this.#currentColumn = btn.closest('[id*="column"]')
    this.#currentId = this.#currentColumn.id.replace(/column-/, '')
  }

  /**
   * Opens the form add card.
   */
  #openFormAddCard(btn) {
    this.#closeFormAddCard()
    this.#setCurrentsParams(btn)
    this.#addFormAddCard()

    const containerFormAddCard = this.#getFormContainer(btn)
    containerFormAddCard.append(this.#formAddCard)
    this.#formAddCardInit()

    this.#hideBtnAddCard(btn)
  }

  /**
   * Returns the form container element.
   *
   * @param {HTMLElement} btn - The button element.
   * @return {HTMLElement} The form container element.
   */
  #getFormContainer(btn) {
    const parent = btn.closest('div[class*="add-card"]')
    return parent.querySelector('[class*="form-container"]')
  }

  /**
   * Adds the form add card.
   *
   * @return {void} This function does not return anything.
   */
  #addFormAddCard() {
    this.#formAddCard = this.#ui.getFormAddCard()
  }

  /**
   * Initializes the form add card.
   *
   * @return {void} This function does not return anything.
   */
  #formAddCardInit() {
    this.#textarea = this.#formAddCard.textToCard
    this.#textarea.focus()

    this.#addFormListeners()
  }

  /**
   * Adds event listeners to the form add card.
   */
  #addFormListeners() {
    this.#formAddCard.addEventListener('keydown', this.#onKeyDownForm)
    this.#formAddCard.addEventListener('input', this.#onInputForm)
  }

  /**
   * Closes the form add card if the escape key is pressed.
   *
   * @param {Event} event - The keydown event.
   */
  #onKeyDownForm = (event) => {
    if (event.key === 'Escape') {
      this.#closeFormAddCard()
    }
  }

  /**
   * Saves the textarea value to localStorage.
   */
  #onInputForm = () => {
    this.#timerTextarea && clearTimeout(this.#timerTextarea)

    this.#timerTextarea = setTimeout(() => {
      this.#storage.saveTextarea(this.#currentColumn.id, this.#textarea.value)
    }, 300)
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

    this.#storage.clearTextarea()
  }

  #hideBtnAddCard(btn) {
    this.#btnHidden = btn
    this.#toggleBtnAddCard()
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
    this.#timerMessage && clearTimeout(this.#timerMessage)
    this.#ui.addPlaceholderWarning(this.#textarea)

    this.#timerMessage = setTimeout(() => {
      this.#ui.removePlaceholderWarning(this.#textarea)
    }, 1000)
  }

  /**
   * Saves the card in this.#cards.
   *
   * @param {string} text - The text to be saved in the card.
   */
  #saveCard(text) {
    this.#cards[this.#currentId].push(new Card(text))
    this.#storage.saveCards(this.#cards)

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
        columnContent.append(this.#ui.getCard(card.id, card.textContent))
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

  /**
   * Deletes the card.
   *
   * @param {HTMLElement} btn - The button that was clicked.
   */
  #deleteCard(btn) {
    const card = btn.closest('[class*="card"]')
    const id = card.dataset.id

    this.#cards[this.#currentId] = this.#cards[this.#currentId].filter((card) => card.id !== id)

    this.#storage.saveCards(this.#cards)

    this.#renderCards()
  }

  #onMouseDownColumns = (event) => {
    event.preventDefault()

    if (event.target.closest('button')) return

    const card = event.target.closest('[class^="card--"]')
    if (!card) return

    this.#cardDragged = card
    this.#ghostCard = card.cloneNode(true)
    this.#ghostCard.style.width = card.offsetWidth + 'px'
    this.#ui.addDraggedClass(this.#ghostCard)

    this.#element.prepend(this.#ghostCard)

    const { top, left } = card.getBoundingClientRect()
    this.#ghostCard.style.top = top + 'px'
    this.#ghostCard.style.left = left + 'px'
    this.#ghostCard.classList.add('grabbing')

    this.#setDifferentPosition(event)

    this.#columns.addEventListener('mouseup', this.#onMouseUpColumns)
    this.#columns.addEventListener('mousemove', this.#onMouseMoveColumns)
    this.#columns.addEventListener('mouseleave', this.#onMouseLeaveColumns)
  }

  #setDifferentPosition = (event) => {
    this.#diffTop = event.pageY - this.#ghostCard.offsetTop
    this.#diffLeft = event.pageX - this.#ghostCard.offsetLeft
  }

  #onMouseMoveColumns = (event) => {
    event.preventDefault()
    if (!this.#cardDragged) return

    this.#ghostCard.style.left = `${event.pageX - this.#diffLeft}px`
    this.#ghostCard.style.top = `${event.pageY - this.#diffTop}px`
    this.#ghostCard.style.cursor = 'grabbing'
  }

  #onMouseLeaveColumns = () => {
    if (!this.#cardDragged) return

    this.#resetDraggedCard()
  }

  #resetDraggedCard = () => {
    this.#ghostCard && this.#ghostCard.remove()
    this.#cardDragged = null
    this.#ghostCard = null

    this.#columns.removeEventListener('mouseup', this.#onMouseUpColumns)
    this.#columns.removeEventListener('mousemove', this.#onMouseMoveColumns)
    this.#columns.removeEventListener('mouseleave', this.#onMouseLeaveColumns)
  }

  #onMouseUpColumns = () => {
    this.#resetDraggedCard()
  }
}
