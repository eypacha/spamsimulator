/**
 * Upgrade Manager - Maneja la lógica genérica de compras de upgrades
 * @param {Ref<number>} score - Referencia al score actual
 * @param {Function} saveAllStats - Función para guardar todas las estadísticas
 * @param {Object} soundStore - Store de sonidos
 * @returns {Function} Función para comprar upgrades
 */
export function createUpgradeHandler(score, saveAllStats, soundStore) {
  return function buyUpgrade(costRef, updateFn, multiplier = 1.5, condition = true) {
    if (score.value >= costRef.value && condition) {
      score.value -= costRef.value;
      updateFn();
      costRef.value = Math.floor(costRef.value * multiplier);
      saveAllStats();
      soundStore.playBuySound();
    }
  };
}