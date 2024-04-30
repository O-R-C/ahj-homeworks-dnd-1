import getElement from '@/js/getElement'

import styles from './addCard.module.css'

/**
 * Creates a card element with a form container and an add button.
 *
 * @return {HTMLElement} The card element with form container and add button.
 */
export const addCard = () => {
  const addCard = getElement({ tag: 'div', classes: styles['add-card'] })
  const formContainer = getElement({ tag: 'div', classes: styles['add-card__form-container'] })
  const button = getElement({ tag: 'button', textContent: 'Add another card', classes: styles['add-card__button-add'] })

  addCard.append(formContainer, button)
  return addCard
}

export default addCard
