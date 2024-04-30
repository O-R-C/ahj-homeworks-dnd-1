import getElement from '../getElement'

describe('should create an element created with the passed properties', () => {
  const div = getElement({
    tag: 'div',
    classes: 'div',
    id: 'div',
    textContent: 'div',
    data: { id: 'div', custom: 'div' },
  })

  it('tag should be div', () => {
    expect(div.nodeName).toBe('DIV')
  })

  it('className should be div', () => {
    expect(div.classList.contains('div')).toBeTruthy()
  })

  it('id should be div', () => {
    expect(div.id).toBe('div')
  })

  it('textContent should be div', () => {
    expect(div.textContent).toBe('div')
  })

  it('data-id should be div', () => {
    expect(div.dataset.id).toBe('div')
  })

  it('data-custom should be div', () => {
    expect(div.dataset.custom).toBe('div')
  })

  describe('getElement', () => {
    test('returns a valid HTML element', () => {
      const element = getElement({ tag: 'div' })
      expect(element).toBeInstanceOf(HTMLElement)
    })

    test('sets the classList of the created element', () => {
      const element = getElement({ tag: 'div', classes: ['class1', 'class2'] })
      expect(element.classList.contains('class1')).toBe(true)
      expect(element.classList.contains('class2')).toBe(true)
    })

    test('sets additional properties of the created element', () => {
      const element = getElement({ tag: 'input', type: 'text' })
      expect(element.type).toBe('text')
    })

    test('sets custom data attributes of the created element', () => {
      const element = getElement({ tag: 'div', data: { key1: 'value1', key2: 'value2' } })
      expect(element.dataset.key1).toBe('value1')
      expect(element.dataset.key2).toBe('value2')
    })

    test('handles missing properties in the input object', () => {
      const element = getElement({})
      expect(element).toBeInstanceOf(HTMLElement)
    })
  })
})
