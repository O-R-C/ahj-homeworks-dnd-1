/**
 * The DnD class.
 */
export default class DnD {
  #draggedCard
  #ghostCard
  #spotCard
  #container
  #diffTop
  #diffLeft

  /**
   * Initializes a new instance of the class with the provided columns.
   *
   * @param {HTMLElement} columns - The container element for the drag and drop functionality.
   */
  constructor(columns) {
    this.#container = columns
  }

  /**
   * Initializes the DnD class by adding event listeners.
   *
   * @return {void} This function does not return anything.
   */
  init() {
    this.#addEventsListeners()
  }

  /**
   * Adds event listeners to the container element.
   *
   * @return {void} This function does not return anything.
   */
  #addEventsListeners = () => {
    this.#container.addEventListener('mousedown', this.#onMouseDown)
  }

  /**
   * Handles the mouse down event.
   *
   * @param {MouseEvent} event - The mouse down event.
   * @return {void} This function does not return anything.
   */
  #onMouseDown = (event) => {
    event.preventDefault()
    if (event.button !== 0) return

    if (event.target.closest('button')) return

    this.#draggedCard = event.target.closest('[data-id="card"]')
    if (!this.#draggedCard) return

    this.#ghostCard = this.#draggedCard.cloneNode(true)
    this.#spotCard = this.#draggedCard.cloneNode()

    this.#setStylesGhost(event)
    this.#setStylesSpot()

    document.body.prepend(this.#ghostCard)

    this.#setActionListeners()

    this.#draggedCard.replaceWith(this.#spotCard)
  }

  /**
   * Sets the styles for the ghost card.
   *
   * @param {MouseEvent} event - The mouse down event.
   * @return {void} This function does not return anything.
   */
  #setStylesGhost = (event) => {
    // Get the bounding rectangle of the dragged card
    const { top, left } = this.#draggedCard.getBoundingClientRect()

    // Calculate the different position of the ghost card
    this.#setDifferentPosition(event, top, left)

    // Set the styles for the ghost card
    this.#ghostCard.style.height = `${this.#draggedCard.offsetHeight}px`
    this.#ghostCard.style.width = `${this.#draggedCard.offsetWidth}px`
    this.#ghostCard.style.left = `${window.scrollX + left}px`
    this.#ghostCard.style.top = `${window.scrollY + top}px`
    this.#ghostCard.classList.add('dragged')
  }

  /**
   * Sets the styles for the spot card.
   *
   * @return {void} This function does not return anything.
   */
  #setStylesSpot = () => {
    this.#spotCard.style.width = this.#draggedCard.offsetWidth + 'px'
    this.#spotCard.style.height = this.#draggedCard.offsetHeight + 'px'

    this.#spotCard.style.backgroundColor = '#b3b3b3'
  }

  /**
   * Sets the different position of the ghost card.
   *
   * @param {MouseEvent} event - The mouse down event.
   * @param {number} top - The top position of the dragged card.
   * @param {number} left - The left position of the dragged card.
   * @return {void} This function does not return anything.
   */
  #setDifferentPosition = (event, top, left) => {
    this.#diffTop = event.pageY - top - window.scrollY
    this.#diffLeft = event.pageX - left - window.scrollX
  }

  /**
   * Sets the action listeners for the ghost card.
   *
   * @return {void} This function does not return anything.
   */
  #setActionListeners = () => {
    this.#container.addEventListener('mouseup', this.#onMouseUp)
    this.#container.addEventListener('mousemove', this.#onMouseMove)
    this.#container.addEventListener('mouseleave', this.#onMouseLeave)
    this.#container.addEventListener('mousemove', this.#onGhostCardOver)
  }

  /**
   * Sets the position of the ghost card based on the mouse movement.
   *
   * @param {MouseEvent} event - The mouse move event.
   * @return {void} This function does not return anything.
   */
  #onMouseMove = (event) => {
    event.preventDefault()

    if (!this.#draggedCard) {
      return
    }

    this.#ghostCard.style.left = `${event.pageX - this.#diffLeft}px`
    this.#ghostCard.style.top = `${event.pageY - this.#diffTop}px`
  }

  /**
   * Resets the dragged card when the mouse leaves the container.
   *
   * @return {void} This function does not return anything.
   */
  #onMouseLeave = () => {
    if (!this.#draggedCard) {
      return
    }

    this.#dropCard()
    this.#resetDraggedCard()
  }

  /**
   * Resets the dragged card when the mouse button is released.
   *
   * @return {void} This function does not return anything.
   */
  #onMouseUp = () => {
    if (!this.#draggedCard) {
      return
    }

    this.#dropCard()
    this.#resetDraggedCard()
  }

  /**
   * Replaces the dragged card with the spot card.
   *
   * @return {void} This function does not return anything.
   */
  #dropCard = () => {
    this.#spotCard.replaceWith(this.#draggedCard)
  }

  /**
   * Shows the spot card in the correct position relative to the closest card.
   *
   * @param {HTMLElement} closestCard - The closest card element.
   * @param {number} currentY - The current y-coordinate of the mouse.
   * @param {HTMLElement} card - The card element to show.
   * @return {void} This function does not return anything.
   */
  #showSpot = (closestCard, currentY, card) => {
    const { top } = closestCard.getBoundingClientRect()
    const closestContent = closestCard.closest('[data-id="column-content"]')

    const isHigher = currentY > window.scrollY + top + closestCard.offsetHeight / 2

    isHigher
      ? closestContent.insertBefore(card, closestCard.nextElementSibling)
      : closestContent.insertBefore(card, closestCard)
  }

  /**
   * Resets the dragged card and its auxiliary elements.
   *
   * This function removes the ghost card and spot card, and sets
   * the dragged card to null.
   *
   * @return {void}
   */
  #resetDraggedCard = () => {
    if (this.#ghostCard) {
      this.#ghostCard.remove()
    }

    if (this.#spotCard) {
      this.#spotCard.remove()
    }

    this.#draggedCard = null
    this.#ghostCard = null
    this.#spotCard = null

    this.#container.removeEventListener('mouseup', this.#onMouseUp)
    this.#container.removeEventListener('mousemove', this.#onMouseMove)
    this.#container.removeEventListener('mouseleave', this.#onMouseLeave)
    this.#container.removeEventListener('mousemove', this.#onGhostCardOver)
  }

  /**
   * Handles the 'mouseover' event of the ghost card.
   *
   * If the dragged card exists, sets the cursor to grabbing and
   * inserts the spot card before the closest card in the column.
   *
   * @param {MouseEvent} event - The event object.
   * @return {void}
   */
  #onGhostCardOver = (event) => {
    if (!this.#draggedCard) {
      return
    }

    this.#setCursorGrabbing(event)

    const closestContent = event.target.closest('[data-id="column-content"]')
    const closestCard = event.target.closest('[data-id="card"]')

    if (closestContent && !this.#hasCards(closestContent)) {
      closestContent.insertBefore(this.#spotCard, closestCard)
      return
    }

    if (!closestCard) {
      return
    }

    this.#showSpot(closestCard, event.pageY, this.#spotCard)
  }

  /**
   * Checks if the content has cards.
   *
   * @param {HTMLElement} content - The content element.
   * @return {boolean} True if the content has cards, false otherwise.
   */
  #hasCards = (content) => {
    return content.hasChildNodes()
  }

  /**
   * Sets the cursor to grabbing.
   *
   * @param {MouseEvent} event - The event object.
   * @return {void}
   */
  #setCursorGrabbing = (event) => {
    event.target.classList.add('grabbing')
    event.target.addEventListener('mouseleave', this.#removeClassGrabbing)
  }

  /**
   * Removes the cursor from grabbing.
   *
   * @param {MouseEvent} event - The event object.
   * @return {void}
   */
  #removeClassGrabbing = (event) => {
    event.target.classList.remove('grabbing')
    event.target.removeEventListener('mouseleave', this.#removeClassGrabbing)
  }
}
