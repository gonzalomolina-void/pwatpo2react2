/**
 * Utilidades para manipulación de strings.
 */

/**
 * Capitaliza la primera letra de un string.
 * @param {string} str 
 * @returns {string}
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
