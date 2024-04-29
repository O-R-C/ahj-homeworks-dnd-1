import getClasses from './getClasses.js'

/**
 * @typedef {Object} props
 * @property {string} tag
 * @property {(string|string[])=} classes
 * @property {string=} id
 * @property {string=} for
 * @property {string=} src
 * @property {string=} name
 * @property {string=} href
 * @property {string=} type
 * @property {string=} action
 * @property {string=} textContent
 * @property {string=} placeholder
 * @property {boolean=} hidden
 * @property {boolean=} required
 * @property {Object=} data
 */

/**
 * @function getElement
 * @param {props} props свойства элемента
 * @returns HTMLElement
 */
export const getElement = (props) => {
  const { classes, tag, data, ...rest } = props

  const element = document.createElement(tag)
  element.classList.add(...getClasses(classes))

  const restProps = Object.keys(rest)
  restProps.length && restProps.forEach((key) => (element[key] = rest[key]))

  data && Object.keys(data).forEach((key) => (element.dataset[key] = data[key]))

  return element
}

export default getElement
