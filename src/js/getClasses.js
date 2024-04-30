/**
 * Returns an array of valid classes.
 *
 * @param {string|Array} classes - The classes to be processed.
 *                                It can be a string representing a single class
 *                                or an array of classes.
 * @return {Array} An array of valid classes.
 */
export const getClasses = (classes) => {
  // Convert the input into an array of classes
  const arrayClasses = getArrayClasses(classes)

  /**
   * Returns an array of valid classes.
   *
   * @param {Array} classes - The array of classes to be processed.
   * @return {Array} An array of valid classes.
   */
  const getValidClasses = (classesArray) => {
    return classesArray.reduce((acc, className) => {
      if (!className) {
        return acc
      }
      if (typeof className === 'string') {
        return [...acc, className]
      }
      if (!Array.isArray(className)) {
        return acc
      }

      return [...acc, ...getValidClasses(className)]
    }, [])
  }

  // Process the array of classes and return the valid ones.
  return getValidClasses(arrayClasses)
}

/**
 * Returns an array of classes.
 *
 * @param {*} classes - The classes to be processed.
 * @return {string[]} An array of classes.
 */
const getArrayClasses = (classes) => {
  return Array.isArray(classes) ? classes : [classes]
}

export default getClasses
