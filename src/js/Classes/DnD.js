export default class DnD {
  #draggedCard
  #ghostCard
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

    this.#setStyles(event)
    this.#container.prepend(this.#ghostCard)
    this.#setActionListeners()
  }

  #setStyles = (event) => {
    const { top, left } = this.#draggedCard.getBoundingClientRect()
    this.#setDifferentPosition(event, top, left)
    this.#ghostCard.style.width = this.#draggedCard.offsetWidth + 'px'
    // this.#ghostCard.style['pointer-events'] = 'none'
    this.#ghostCard.style['user-select'] = 'none'
    this.#ghostCard.style.position = 'absolute'
    this.#ghostCard.style.cursor = 'grabbing'
    this.#ghostCard.style.left = `${left}px`
    this.#ghostCard.style.top = `${top}px`
    this.#ghostCard.style.zIndex = 9999
  }

  #setDifferentPosition = (event, top, left) => {
    this.#diffTop = event.pageY - top
    this.#diffLeft = event.pageX - left
  }

  #setActionListeners = () => {
    this.#container.addEventListener('mouseup', this.#onMouseUp)
    this.#container.addEventListener('mousemove', this.#onMouseMove)
    this.#container.addEventListener('mouseleave', this.#onMouseLeave)
  }

  #onMouseMove = (event) => {
    event.preventDefault()
    if (!this.#draggedCard) return

    this.#ghostCard.style.left = `${event.pageX - this.#diffLeft}px`
    this.#ghostCard.style.top = `${event.pageY - this.#diffTop}px`
  }

  #onMouseLeave = () => {
    console.log('onMouseLeave')
    if (!this.#draggedCard) return

    this.#resetDraggedCard()
  }

  #onMouseUp = (event) => {
    if (!this.#draggedCard) return
    this.#ghostCard.style['pointer-events'] = 'none'

    const point = document.elementFromPoint(event.clientX, event.clientY)
    const closestCard = point.closest('[data-id="card"]')
    closestCard && this.#dropCard(closestCard, event.pageY)

    this.#resetDraggedCard()
  }

  #dropCard = (closestCard, currentY) => {
    const { top } = closestCard.getBoundingClientRect()
    const closestContent = closestCard.closest('[data-id="column-content"]')

    const isHigher = currentY > window.scrollY + top + closestCard.offsetHeight / 2

    isHigher
      ? closestContent.insertBefore(this.#draggedCard, closestCard.nextElementSibling)
      : closestContent.insertBefore(this.#draggedCard, closestCard)
  }

  #resetDraggedCard = () => {
    this.#ghostCard && this.#ghostCard.remove()
    this.#draggedCard = null
    this.#ghostCard = null

    this.#container.removeEventListener('mouseup', this.#onMouseUp)
    this.#container.removeEventListener('mousemove', this.#onMouseMove)
    this.#container.removeEventListener('mouseleave', this.#onMouseLeave)
  }
}
