export default class DnD {
  #draggedCard
  #ghostCard
  #element
  #diffTop
  #diffLeft

  constructor(columns) {
    this.#element = columns

    this.#init()
  }

  #init() {
    this.#addEventsListeners()
  }

  #addEventsListeners = () => {
    this.#element.addEventListener('mousedown', this.#onMouseDown)
  }

  #onMouseDown = (event) => {
    event.preventDefault()

    if (event.target.closest('button')) return

    const card = event.target.closest('[data-id="card"]')
    if (!card) return

    this.#draggedCard = card

    this.#ghostCard = card.cloneNode(true)
    this.#ghostCard.style.width = card.offsetWidth + 'px'

    document.body.prepend(this.#ghostCard)

    const { top, left } = card.getBoundingClientRect()
    this.#ghostCard.style.top = top + 'px'
    this.#ghostCard.style.left = left + 'px'

    this.#setDifferentPosition(event)

    this.#element.addEventListener('mouseup', this.#onMouseUp)
    this.#element.addEventListener('mousemove', this.#onMouseMove)
    this.#element.addEventListener('mouseleave', this.#onMouseLeave)
  }

  #setDifferentPosition = (event) => {
    this.#diffTop = event.pageY - this.#ghostCard.offsetTop
    this.#diffLeft = event.pageX - this.#ghostCard.offsetLeft
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

    const point = document.elementFromPoint(event.clientX, event.clientY)
    const closestCard = point.closest('[data-id="card"]')
    closestCard && this.#dropCard(closestCard, event.pageY)

    this.#resetDraggedCard()
  }

  #dropCard = (closestCard, currentY) => {
    const closestContent = closestCard.closest('[data-id="column-content"]')
    const { top } = closestCard.getBoundingClientRect()
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
