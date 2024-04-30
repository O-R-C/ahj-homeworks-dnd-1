import getElement from '@/js/getElement'

import styles from './formAddCard.module.css'

/**
 * Creates a form element with input, add button, and cancel button.
 *
 * @return {HTMLFormElement} The form element with input, add button, and cancel button.
 */
export const formAddCard = () => {
  const form = getElement({ tag: 'form', classes: styles['form-add-card'] })
  const textarea = getElement({
    tag: 'textarea',
    rows: 5,
    classes: styles['form-add-card__textarea'],
    autofocus: true,
    placeholder: 'Enter a title for this card...',
    required: true,
  })
  const controls = getElement({ tag: 'div', classes: styles['form-add-card__controls'] })
  const buttonAdd = getElement({
    tag: 'button',
    textContent: 'Add card',
    classes: styles['form-add-card__button-add'],
  })
  const buttonCancel = getElement({
    tag: 'button',
    classes: styles['form-add-card__button-cancel'],
  })

  form.append(textarea, controls)
  controls.append(buttonAdd, buttonCancel)

  return form
}

export default formAddCard
