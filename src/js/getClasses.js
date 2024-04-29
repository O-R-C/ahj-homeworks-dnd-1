/**
 * Возвращает массив truthy классов
 * @param {string|[]} classes классы элемента
 * @returns string[]
 */
export const getClasses = (classes) => {
  return getValidClasses(getArrayClasses(classes))
}

/**
 * @param {*} classes
 * @returns string[]
 */
const getArrayClasses = (classes) => {
  return Array.isArray(classes) ? classes : [classes]
}

/**
 * Возвращает массив truthy классов
 * @param {[]} classes массив классов
 * @returns string[]
 */
const getValidClasses = (classes) => {
  return classes.reduce((acc, className) => {
    if (!className) return acc
    if (typeof className === 'string') return [...acc, className]
    if (!Array.isArray(className)) return acc

    return [...acc, ...getValidClasses(className)]
  }, [])
}

export default getClasses
