import getElement from '@js/getElement'
import addCard from '../addCard/addCard'

import styles from './column.module.css'

/**
 * Create a column element with a header, content, and footer.
 *
 * @param {string} title - The title of the column.
 * @param {string} classes - The CSS classes to be applied to the column element.
 * @returns {HTMLElement} - The column element.
 */

export const column = (title, classes) => {
  const column = getElement({ tag: 'div', classes: [classes, styles.column] })
  const header = getElement({ tag: 'h2', textContent: title, classes: styles.columnHeader })
  const content = getElement({ tag: 'div', classes: styles.columnContent })
  const footer = addCard()

  column.append(header, content, footer)

  return column
}

export default column
