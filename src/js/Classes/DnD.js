export default class DnD {
  #draggedCard
  #ghostCard
  #element
  #diffTop
  #diffLeft

  constructor(columns) {
    this.#element = columns
  }

  init() {
    this.#addEventsListeners()
  }

  #addEventsListeners = () => {
    this.#element.addEventListener('mousedown', this.#onMouseDown)
  }

  #onMouseDown = (event) => {
    event.preventDefault()

    if (event.target.closest('button')) return

    this.#draggedCard = event.target.closest('[data-id="card"]')
    if (!this.#draggedCard) return

    this.#ghostCard = this.#draggedCard.cloneNode(true)

    this.#setDifferentPosition(event)
    this.#setStyles(event)
    this.#draggedCard.prepend(this.#ghostCard)
    this.#setActionListeners()
    console.log('🚀 ~ body:', document.body)
    console.log('🚀 ~ this.#ghostCard:', this.#ghostCard)
  }

  #setStyles = (event) => {
    const { top, left } = this.#draggedCard.getBoundingClientRect()
    this.#ghostCard.style.width = this.#draggedCard.offsetWidth + 'px'
    // this.#ghostCard.style['pointer-events'] = 'none'
    this.#ghostCard.style['user-select'] = 'none'
    this.#ghostCard.style.position = 'absolute'
    this.#ghostCard.style.cursor = 'grabbing'
    this.#ghostCard.style.left = `${event.pageX - this.#diffLeft}px`
    this.#ghostCard.style.top = `${event.pageY - this.#diffTop}px`
    this.#ghostCard.style.zIndex = 9999
  }

  #setDifferentPosition = (event) => {
    this.#diffTop = event.pageY - this.#ghostCard.offsetTop
    this.#diffLeft = event.pageX - this.#ghostCard.offsetLeft
  }

  #setActionListeners = () => {
    this.#element.addEventListener('mouseup', this.#onMouseUp)
    this.#element.addEventListener('mousemove', this.#onMouseMove)
    this.#element.addEventListener('mouseleave', this.#onMouseLeave)
  }

  #onMouseMove = (event) => {
    event.preventDefault()
    if (!this.#draggedCard) return

    this.#ghostCard.style.left = `${event.pageX - this.#diffLeft}px`
    this.#ghostCard.style.top = `${event.pageY - this.#diffTop}px`
  }

  #onMouseLeave = () => {
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

    this.#element.removeEventListener('mouseup', this.#onMouseUp)
    this.#element.removeEventListener('mousemove', this.#onMouseMove)
    this.#element.removeEventListener('mouseleave', this.#onMouseLeave)
  }
}
