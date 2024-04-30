import getElement from '@/js/getElement'

import styles from './card.module.css'

export const card = (textContent = 'Awesome text') => {
  const card = getElement({ tag: 'div', classes: styles.card })
  const paragraph = getElement({ tag: 'p', textContent, classes: styles['card__paragraph'] })

  card.append(paragraph)

  return card
}

export default card
