/** * @jest-environment jsdom */
import setTitle from '../setTitle'

const title = document.createElement('title')
document.head.append(title)

it('tag title must be a set value', () => {
  setTitle('test')
  expect(title.textContent).toBe('test')
})
