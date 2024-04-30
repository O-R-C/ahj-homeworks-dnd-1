import { v4 as uuid4 } from 'uuid'

/**
 * A class representing a card.
 *
 * @class
 * @property {string} textContent - The text content of the card.
 * @property {string} id - The id of the card.
 */
export default class Card {
  /**
   * Initializes a new Card instance with the provided text content and column.
   *
   * @param {string} textContent - The text content of the card.
   * @return {void} No return value.
   */
  constructor(textContent) {
    this.textContent = textContent
    this.id = uuid4()
  }
}
