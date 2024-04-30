import getElement from '@/js/getElement'
import card from '@/components/card/card'
import columns from '@components/columns/columns'
import formAddCard from '@components/formAddCard/formAddCard'

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
   * @param {string} id - The id of the card.
   * @param {string} text - The text to be displayed in the card.
   * @return {HTMLElement} The card element.
   */
  getCard(id, text) {
    return card(id, text)
  }

  /**
   * Returns the result of calling the `formAddCard` function.
   *
   * @return {HTMLElement} The result of calling the `formAddCard` function.
   */
  getFormAddCard() {
    return formAddCard()
  }

  /**
   * Toggles the visibility of a button element by adding or removing the 'hide' class from its classList.
   *
   * @param {HTMLElement} btn - The button element to toggle visibility for.
   * @return {void} This function does not return anything.
   */
  toggleBtnHidden(btn) {
    btn.classList.toggle(styles.hide)
  }

  /**
   * Adds the 'warning' class to the provided element's classList.
   *
   * @param {HTMLElement} element - The element to add the class to.
   * @return {void} This function does not return anything.
   */
  addPlaceholderWarning(element) {
    element.classList.add(styles['warning'])
  }

  /**
   * Removes the 'placeholder-warning' class from the provided element's classList.
   *
   * @param {HTMLElement} element - The element to remove the class from.
   * @return {void} This function does not return anything.
   */
  removePlaceholderWarning(element) {
    element.classList.remove(styles['warning'])
  }

  /**
   * Adds the 'dragged' class to the provided element's classList.
   *
   * @param {HTMLElement} element - The element to add the class to.
   * @return {void} This function does not return anything.
   */
  addDraggedClass(element) {
    element.classList.add(styles.dragged)
  }
}
