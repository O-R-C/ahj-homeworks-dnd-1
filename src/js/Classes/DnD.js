export default class DnD {
  #draggedCard
  #ghostCard
  #spotCard
  #container
  #diffTop
  #diffLeft

  constructor(columns) {
    this.#container = columns
  }

  init() {
    this.#addEventsListeners()
  }

  #addEventsListeners = () => {
    this.#container.addEventListener('mousedown', this.#onMouseDown)
  }

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

  #setStylesGhost = (event) => {
    const { top, left } = this.#draggedCard.getBoundingClientRect()
    this.#setDifferentPosition(event, top, left)

    this.#ghostCard.style.height = this.#draggedCard.offsetHeight + 'px'
    this.#ghostCard.style.width = this.#draggedCard.offsetWidth + 'px'
    this.#ghostCard.style.left = `${window.scrollX + left}px`
    this.#ghostCard.style.top = `${window.scrollY + top}px`
    this.#ghostCard.classList.add('dragged')
  }

  #setStylesSpot = () => {
    this.#spotCard.style.width = this.#draggedCard.offsetWidth + 'px'
    this.#spotCard.style.height = this.#draggedCard.offsetHeight + 'px'

    this.#spotCard.style.backgroundColor = '#b3b3b3'
  }

  #setDifferentPosition = (event, top, left) => {
    this.#diffTop = event.pageY - top - window.scrollY
    this.#diffLeft = event.pageX - left - window.scrollX
  }

  #setActionListeners = () => {
    this.#container.addEventListener('mouseup', this.#onMouseUp)
    this.#container.addEventListener('mousemove', this.#onMouseMove)
    this.#container.addEventListener('mouseleave', this.#onMouseLeave)
    this.#container.addEventListener('mousemove', this.#onGhostCardOver)
  }

  #onMouseMove = (event) => {
    event.preventDefault()
    if (!this.#draggedCard) return

    this.#ghostCard.style.left = `${event.pageX - this.#diffLeft}px`
    this.#ghostCard.style.top = `${event.pageY - this.#diffTop}px`
  }

  #onMouseLeave = () => {
    if (!this.#draggedCard) return

    this.#dropCard()
    this.#resetDraggedCard()
  }

  #onMouseUp = () => {
    if (!this.#draggedCard) return

    this.#dropCard()
    this.#resetDraggedCard()
  }

  #dropCard = () => {
    this.#spotCard.replaceWith(this.#draggedCard)
  }

  #showSpot = (closestCard, currentY, card) => {
    const { top } = closestCard.getBoundingClientRect()
    const closestContent = closestCard.closest('[data-id="column-content"]')

    const isHigher = currentY > window.scrollY + top + closestCard.offsetHeight / 2

    isHigher
      ? closestContent.insertBefore(card, closestCard.nextElementSibling)
      : closestContent.insertBefore(card, closestCard)
  }

  #resetDraggedCard = () => {
    this.#ghostCard && this.#ghostCard.remove()
    this.#spotCard && this.#spotCard.remove()
    this.#draggedCard = null
    this.#ghostCard = null
    this.#spotCard = null

    this.#container.removeEventListener('mouseup', this.#onMouseUp)
    this.#container.removeEventListener('mousemove', this.#onMouseMove)
    this.#container.removeEventListener('mouseleave', this.#onMouseLeave)
    this.#container.removeEventListener('mousemove', this.#onGhostCardOver)
  }

  #onGhostCardOver = (event) => {
    if (!this.#draggedCard) return

    this.#setCursorGrabbing(event)

    const closestContent = event.target.closest('[data-id="column-content"]')
    const closestCard = event.target.closest('[data-id="card"]')

    if (closestContent && !this.#hasCards(closestContent)) {
      closestContent.insertBefore(this.#spotCard, closestCard)
      return
    }

    if (!closestCard) return

    this.#showSpot(closestCard, event.pageY, this.#spotCard)
  }

  #hasCards = (content) => {
    return content.hasChildNodes()
  }

  #setCursorGrabbing = (event) => {
    event.target.classList.add('grabbing')
    event.target.addEventListener('mouseleave', this.#removeClassGrabbing)
  }

  #removeClassGrabbing = (event) => {
    event.target.classList.remove('grabbing')
    event.target.removeEventListener('mouseleave', this.#removeClassGrabbing)
  }
}
