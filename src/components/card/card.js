import getElement from '@/js/getElement'

import styles from './card.module.css'

/**
 * Creates a card element with the provided text content.
 *
 * @param {string} [textContent='Awesome text'] - The text content to be displayed in the card.
 * @return {HTMLElement} The card element.
 */
export const card = (textContent = 'Awesome text') => {
  const card = getElement({ tag: 'div', classes: styles.card })
  const paragraph = getElement({ tag: 'p', textContent, classes: styles['card__paragraph'] })

  card.append(paragraph)

  return card
}

export default card
