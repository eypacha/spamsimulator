import { ref } from 'vue';

/**
 * Combo Manager - Maneja la lógica del sistema de combos
 * @param {Object} loaded - Datos cargados del storage
 * @param {Function} saveAllStats - Función para guardar estadísticas
 * @returns {Object} Estado y funciones del combo
 */
export function createComboManager(loaded, saveAllStats) {
  const comboUnlocked = ref(loaded?.comboUnlocked ?? false);
  const comboUpgradeCost = ref(loaded?.comboUpgradeCost ?? 150);
  const comboMultiplier = ref(loaded?.comboMultiplier ?? 1); // 1, 2, 3, 5
  const comboCount = ref(loaded?.comboCount ?? 0); // para llevar el conteo

  function updateCombo(success) {
    if (!comboUnlocked.value) return;
    
    if (success) {
      comboCount.value++;
      if (comboCount.value >= 100) comboMultiplier.value = 50;
      else if (comboCount.value >= 50) comboMultiplier.value = 20;
      else if (comboCount.value >= 30) comboMultiplier.value = 10;
      else if (comboCount.value >= 20) comboMultiplier.value = 5;
      else if (comboCount.value >= 10) comboMultiplier.value = 3;
      else if (comboCount.value >= 5) comboMultiplier.value = 2;
      else comboMultiplier.value = 1;
    } else {
      comboCount.value = 0;
      comboMultiplier.value = 1;
    }
    
    saveAllStats();
  }

  function resetCombo() {
    comboUnlocked.value = true;
    comboMultiplier.value = 1;
    comboCount.value = 0;
  }

  return {
    comboUnlocked,
    comboUpgradeCost,
    comboMultiplier,
    comboCount,
    updateCombo,
    resetCombo
  };
}
