import getClasses from '../getClasses'

describe('should returns array', () => {
  it('empty array', () => {
    expect(getClasses('')).toEqual([])
  })
  const classes = [123, true, '', '321', 'class', null, {}]
  it('strings array', () => {
    expect(getClasses(classes)).toEqual(['321', 'class'])
  })
  it('get multi array => strings array', () => {
    const arr = []
    arr.push(classes)
    arr.push(classes)
    arr.push(classes)
    expect(getClasses(arr)).toEqual(['321', 'class', '321', 'class', '321', 'class'])
  })
})
