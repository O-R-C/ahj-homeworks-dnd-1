import TrelloUI from './TrelloUI'
import DnD from '@/js/Classes/DnD'
import Card from '@/js/Classes/Card'
import Storage from '@/js/Classes/Storage'
import exampleDataCards from '@/js/exampleDataCards'

/**
 * The Trello class.
 */
export default class Trello {
  #ui = new TrelloUI()
  #storage = new Storage()
  #cards = this.#storage.loadCards() ??
    exampleDataCards ?? { ['column-first']: [], ['column-second']: [], ['column-third']: [] }
  #dnd
  #app
  #element
  #columns
  #textarea
  #btnHidden
  #formAddCard
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

    this.#dnd = new DnD(this.#columns)
    this.#dnd.init()

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
    this.#columns.addEventListener('draggedFinish', this.#onDraggedFinish)
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
    }, 200)
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

    if (!text.trim()) {
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
    this.#textarea.value = ''
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
    this.#cards[this.#currentColumn.id].push(new Card(text))
    this.#saveCards()

    this.#renderCards()
  }

  /**
   * Saves the cards in localStorage.
   */
  #saveCards() {
    this.#storage.saveCards(this.#cards)
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
      const cardsInColumn = this.#cards[column.id]
      const columnContent = column.querySelector('[class*="column-content"]')

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
    const column = card.closest('[id^="column-"]')
    const id = card.dataset.id

    this.#cards[column.id] = this.#cards[column.id].filter((card) => card.id !== id)

    this.#saveCards()
    this.#renderCards()
  }

  #onDraggedFinish = (event) => {
    event.preventDefault()

    const { btnId, startColumnId, finishColumnId, prevId } = event.detail

    this.#replaceCard(btnId, startColumnId, finishColumnId, prevId)
    this.#saveCards()
  }

  /**
   * Replaces the card.
   *
   * @param {HTMLElement} btn - The button that was dragged.
   * @param {number} columnId - The id of the column.
   * @param {number} [prev] - The index of the card in the previous column.
   */
  #replaceCard(btnId, startColumnId, finishColumnId, prevId = 0) {
    const prevIndex = !prevId ? 0 : this.#cards[finishColumnId].findIndex((card) => card.id === prevId) + 1
    console.log('🚀 ~ prevIndex:', prevIndex)
    const draggedCardIndex = this.#cards[startColumnId].findIndex((card) => card.id === btnId)
    const draggedCard = this.#cards[startColumnId].splice(draggedCardIndex, 1)[0]
    this.#cards[finishColumnId].splice(prevIndex, 0, draggedCard)
    console.log('🚀 ~ this.#cards:', this.#cards)
  }
}
