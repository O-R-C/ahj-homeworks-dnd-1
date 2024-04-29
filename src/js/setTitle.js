/**
 * Устанавливает название приложения
 * @param {string} title название приложения
 */
export const setTitle = (title) => {
  document.querySelector('title').textContent = title
}

export default setTitle
