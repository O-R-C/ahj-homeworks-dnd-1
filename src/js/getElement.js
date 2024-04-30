import getClasses from './getClasses.js'

/**
 * Creates an HTML element based on the provided properties.
 *
 * @typedef {Object} props
 * @property {string} tag - The HTML tag of the element.
 * @property {string=} id - The id of the element.
 * @property {string=} for - The value of the "for" attribute (used for labels).
 * @property {string=} src - The source of an image or link.
 * @property {string=} name - The name of a form element.
 * @property {string=} href - The URL of a link.
 * @property {string=} textContent - The text content of an element.
 * @property {string=} placeholder - The placeholder text of an input element.
 * @property {string=} alt - The alternate text of an image.
 * @property {(string|string[])=} classes - The CSS classes of the element.
 * @property {string=} type - The type of a form element.
 * @property {string=} action - The URL of a form's action.
 * @property {string=} target - The target of a link.
 * @property {string=} download - The download attribute of a link.
 * @property {string=} title - The title of an element.
 * @property {boolean=} hidden - Whether the element is hidden.
 * @property {boolean=} required - Whether the element is required.
 * @property {boolean=} autofocus - Whether the element should be focused on page load.
 * @property {boolean=} disabled - Whether the element is disabled.
 * @property {boolean=} readonly - Whether the element is read-only.
 * @property {number=} tabIndex - The tab index of the element.
 * @property {number=} cols - The number of columns in a textarea.
 * @property {number=} rows - The number of rows in a textarea.
 * @property {number=} min - The minimum value of an input element.
 * @property {number=} max - The maximum value of an input element.
 * @property {number=} step - The step value of an input element.
 * @property {Object=} data - An object containing custom data attributes.
 *
 * @param {props} props - The properties of the element.
 * @return {HTMLElement} The created HTML element.
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
