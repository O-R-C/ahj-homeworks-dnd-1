import getElement from '@/js/getElement'
import card from '@/components/card/card'
import columns from '@components/columns/columns'

import styles from './Trello.module.css'

export default class TrelloUI {
  /**
   * A function to get the specified element.
   *
   * @param {string|HTMLElement} element - The element to retrieve.
   * @return {HTMLElement} The retrieved element.
   */
  getElement(element) {
    if (typeof element === 'string') {
      element = document.querySelector(element)
    }
    return element
  }

  /**
   * Returns the app element with columns appended.
   *
   * @return {HTMLElement} The app element.
   */
  get app() {
    const app = getElement({ classes: styles.app, tag: 'div' })
    const columnsEl = columns(styles.columns)

    app.append(columnsEl)

    return app
  }

  /**
   * Returns a card element with the provided text.
   *
   * @param {string} text - The text to be displayed in the card.
   * @return {HTMLElement} The card element.
   */
  getCard(text) {
    return card(text)
  }

  toggleFormAddCard(form) {
    form.classList.toggle(styles['form-add-card--active'])
  }
}
