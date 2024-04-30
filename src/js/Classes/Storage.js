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
  #key = 'cards'

  /**
   * Saves the provided cards to localStorage.
   * @param {Array} cards - The array of cards to save.
   */
  save(cards) {
    this.#storage.setItem(this.#key, JSON.stringify(cards))
  }

  /**
   * Retrieves the saved cards from localStorage.
   * @return {Array} The array of saved cards.
   */
  load() {
    return JSON.parse(this.#storage.getItem(this.#key))
  }
}
