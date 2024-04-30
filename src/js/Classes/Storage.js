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
   * @param {string} textarea - The textarea to save.
   */
  saveTextarea(textarea) {
    this.#storage.setItem(this.#keyTextarea, JSON.stringify(textarea))
  }

  /**
   * Retrieves the textarea from localStorage and parses it as JSON.
   *
   * @return {string} The parsed textarea object.
   */
  loadTextarea() {
    return JSON.parse(this.#storage.getItem(this.#keyTextarea))
  }
}
