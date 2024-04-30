import getElement from '@/js/getElement'
import formAddCard from '../formAddCard/formAddCard'

import styles from './addCard.module.css'

export const addCard = () => {
  const addCard = getElement({ tag: 'div', classes: styles['add-card'] })
  const form = formAddCard()
  const button = getElement({ tag: 'button', textContent: 'Add another card', classes: styles['add-card__button-add'] })

  addCard.append(form, button)
  return addCard
}

export default addCard
