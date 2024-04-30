import { v4 as uuid4 } from 'uuid'

/**
 * A class representing a card.
 *
 * @class
 * @property {string} textContent - The text content of the card.
 * @property {string} column - The column the card belongs to.
 * @property {string} id - The id of the card.
 */
export default class Card {
  /**
   * Initializes a new Card instance with the provided text content and column.
   *
   * @param {string} textContent - The text content of the card.
   * @param {string} column - The column the card belongs to.
   * @return {void} No return value.
   */
  constructor(textContent, column) {
    this.textContent = textContent
    this.column = column
    this.id = uuid4()
  }
}
