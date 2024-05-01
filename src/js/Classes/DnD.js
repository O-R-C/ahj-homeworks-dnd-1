export default class DnD {
  #draggedCard
  #ghostCard
  #spotCard
  #container
  #diffTop
  #diffLeft
  #parent
  #sibling
  #hasSpot = false

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
    this.#hasSpot = false
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

    this.#saveCurrentPosition()
    this.#draggedCard.replaceWith(this.#spotCard)
  }

  #saveCurrentPosition = () => {
    this.#parent = this.#draggedCard.closest('[data-id="column-content"]')
    this.#sibling = this.#draggedCard.nextElementSibling
  }

  #restoreCurrentPosition = () => {
    this.#parent.insertBefore(this.#draggedCard, this.#sibling)
  }

  #setStylesGhost = (event) => {
    const { top, left } = this.#draggedCard.getBoundingClientRect()
    this.#setDifferentPosition(event, top, left)
    this.#ghostCard.style.width = this.#draggedCard.offsetWidth + 'px'
    this.#ghostCard.style['pointer-events'] = 'none'
    this.#ghostCard.style['user-select'] = 'none'
    this.#ghostCard.style.position = 'absolute'
    this.#ghostCard.style.cursor = 'grabbing'
    this.#ghostCard.style.left = `${window.scrollX + left}px`
    this.#ghostCard.style.top = `${window.scrollY + top}px`
    this.#ghostCard.style.opacity = 0.5
    this.#ghostCard.style.zIndex = 9999
  }

  #setStylesSpot = () => {
    this.#spotCard.style.width = this.#draggedCard.offsetWidth + 'px'
    this.#spotCard.style.height = this.#draggedCard.offsetHeight + 'px'

    this.#spotCard.style.backgroundColor = 'gray'
  }

  #setDifferentPosition = (event, top, left) => {
    this.#diffTop = event.pageY - top
    this.#diffLeft = event.pageX - left
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
    this.#ghostCard.style.top = `${event.pageY - this.#diffTop + window.scrollY}px`
  }

  #onMouseLeave = () => {
    console.log('onMouseLeave')
    if (!this.#draggedCard) return

    this.#spotCard.replaceWith(this.#draggedCard)
    this.#resetDraggedCard()
  }

  #onMouseUp = () => {
    if (!this.#draggedCard) return

    // this.#hasSpot && this.#spotCard.replaceWith(this.#draggedCard)
    // !this.#hasSpot && this.#restoreCurrentPosition()

    this.#spotCard.replaceWith(this.#draggedCard)
    this.#resetDraggedCard()
  }

  #dropCard = (closestCard, currentY, card) => {
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

    this.#hasSpot = false

    const closestContent = event.target.closest('[data-id="column-content"]')
    const closestCard = event.target.closest('[data-id="card"]')

    if (closestContent && !this.#hasCards(closestContent)) {
      this.#hasSpot = true
      closestContent.insertBefore(this.#spotCard, closestCard)
      return
    }

    if (!closestCard) return

    this.#hasSpot = true
    this.#dropCard(closestCard, event.pageY, this.#spotCard)
  }

  #hasCards = (content) => {
    return content.hasChildNodes()
  }
}
