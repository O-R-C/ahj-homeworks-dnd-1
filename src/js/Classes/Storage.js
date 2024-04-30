/**
 * Class representing a Storage for cards.
 */
export default class Storage {
  /**
   * The localStorage object.
   * @private
   */
  #storage = localStorage

  /**
   * The key for storing the cards in localStorage.
   * @private
   */
  #keyCards = 'cards'

  /**
   * The key for storing the textarea in localStorage.
   * @private
   */
  #keyTextarea = 'textarea'

  /**
   * Saves the provided cards to localStorage.
   * @param {Array} cards - The array of cards to save.
   */
  saveCards(cards) {
    this.#storage.setItem(this.#keyCards, JSON.stringify(cards))
  }

  /**
   * Retrieves the saved cards from localStorage.
   * @return {Array} The array of saved cards.
   */
  loadCards() {
    return JSON.parse(this.#storage.getItem(this.#keyCards))
  }

  /**
   * Saves the provided textarea to localStorage.
   *
   * @param {string} id - The id of the textarea.
   * @param {string} textarea - The textarea to save.
   * @return {void} This function does not return a value.
   */
  saveTextarea(id, textarea) {
    this.#storage.setItem(this.#keyTextarea, JSON.stringify({ id, textarea }))
  }

  /**
   * Retrieves the textarea from localStorage and parses it as JSON.
   *
   * @return {string} The parsed textarea object.
   */
  loadTextarea() {
    return JSON.parse(this.#storage.getItem(this.#keyTextarea))
  }

  /**
   * Clears the textarea stored in localStorage.
   *
   * This function removes the textarea from localStorage by deleting the corresponding key.
   *
   * @return {void} This function does not return a value.
   */
  clearTextarea() {
    this.#storage.removeItem(this.#keyTextarea)
  }
}
