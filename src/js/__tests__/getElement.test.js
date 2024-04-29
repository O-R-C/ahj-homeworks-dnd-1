import getElement from '../getElement'

describe('should create an element created with the passed properties', () => {
  const div = getElement({
    tag: 'div',
    classes: 'div',
    id: 'div',
    textContent: 'div',
    data: { id: 'div', custom: 'div' },
  })

  it(' tag should be div', () => {
    expect(div.nodeName).toBe('DIV')
  })

  it(' className should be div', () => {
    expect(div.classList.contains('div')).toBeTruthy()
  })

  it(' id should be div', () => {
    expect(div.id).toBe('div')
  })

  it(' textContent should be div', () => {
    expect(div.textContent).toBe('div')
  })

  it(' data-id should be div', () => {
    expect(div.dataset.id).toBe('div')
  })

  it(' data-custom should be div', () => {
    expect(div.dataset.custom).toBe('div')
  })
})
