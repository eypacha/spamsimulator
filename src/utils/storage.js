// utils/storage.js

/**
 * Formatea un valor en KB a la unidad más apropiada (KB, MB, GB, TB)
 * @param {number} kb - Valor en kilobytes
 * @param {number} decimals - Número de decimales (por defecto 1)
 * @returns {string} - String formateado con la unidad apropiada
 */
export function formatStorage(kb, decimals = 1) {
  if (kb === 0) return '0 KB';

  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = kb;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  return `${value.toFixed(decimals)} ${units[unitIndex]}`;
}

/**
 * Convierte bytes a la unidad más apropiada
 * @param {number} bytes - Valor en bytes
 * @param {number} decimals - Número de decimales (por defecto 1)
 * @returns {string} - String formateado con la unidad apropiada
 */
export function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(decimals)} ${units[i]}`;
}