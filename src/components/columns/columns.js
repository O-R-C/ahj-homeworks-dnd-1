import getElement from '@/js/getElement'

import styles from './columns.module.css'
import column from '../column/column'

/**
 * Creates a container element with columns and appends three column elements to it.
 *
 * @param {string|string[]} classes - The CSS classes to be applied to the container element.
 * @return {HTMLElement} The container element with the columns.
 */
export const columns = (classes) => {
  const columns = getElement({ tag: 'div', classes: [classes, styles.columns] })
  const columnFirst = column('TODO', 'column-first')
  const columnSecond = column('IN PROGRESS', 'column-second')
  const columnThird = column('DONE', 'column-third')

  columns.append(columnFirst, columnSecond, columnThird)

  return columns
}

export default columns
