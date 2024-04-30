import getElement from '@/js/getElement'
import columns from '@components/columns/columns'

import styles from './Trello.module.css'

export default class TrelloUI {
  getElement(element) {
    if (typeof element === 'string') {
      element = document.querySelector(element)
    }
    return element
  }

  /**
   *
   * @returns HTMLElement
   */
  get app() {
    const app = getElement({ classes: styles.app, tag: 'div' })
    const columnsEl = columns('columns')

    app.append(columnsEl)

    return app
  }
}
