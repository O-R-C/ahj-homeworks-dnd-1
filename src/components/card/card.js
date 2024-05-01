import getElement from '@/js/getElement'

import styles from './card.module.css'

/**
 * Creates a card element with a paragraph and a delete button.
 *
 * @param {string} id - The id of the card.
 * @param {string} [textContent='Awesome text'] - The text content of the paragraph.
 * @return {HTMLElement} The card element.
 */
export const card = (id, textContent = 'Awesome text') => {
  const card = getElement({ tag: 'div', classes: styles.card, data: { id: `card` } })
  const paragraph = getElement({ tag: 'p', textContent, classes: styles['card__paragraph'] })
  const buttonDelete = getElement({
    tag: 'button',
    textContent: 'X',
    classes: styles['card__button-delete'],
    data: { id: id },
  })

  card.append(paragraph, buttonDelete)

  return card
}

export default card
