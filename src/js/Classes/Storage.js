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
}
