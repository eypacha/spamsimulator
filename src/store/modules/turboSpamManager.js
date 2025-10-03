import { ref } from 'vue';

/**
 * Turbo Spam Manager - Maneja el upgrade de TurboSpam (reduce intervalo de aparición)
 * @param {Object} loaded - Datos cargados del storage
 * @param {Object} constants - Constantes de configuración (TURBO_MIN_INTERVAL, TURBO_DEFAULT_INTERVAL, etc.)
 * @returns {Object} Estado y funciones del turbo spam
 */
export function createTurboSpamManager(loaded, constants) {
  const { TURBO_MIN_INTERVAL, TURBO_DEFAULT_INTERVAL, TURBO_DEFAULT_COST, TURBO_DECREASE } = constants;

  const turboSpamLevel = ref(loaded?.turboSpamLevel ?? 0);
  const turboSpamInterval = ref(loaded?.turboSpamInterval ?? TURBO_DEFAULT_INTERVAL);
  const turboSpamUpgradeCost = ref(loaded?.turboSpamUpgradeCost ?? TURBO_DEFAULT_COST);

  function upgradeTurboSpam() {
    turboSpamLevel.value += 1;
    turboSpamInterval.value = Math.max(
      TURBO_MIN_INTERVAL, 
      Math.floor(turboSpamInterval.value * TURBO_DECREASE)
    );
  }

  function canUpgrade() {
    return turboSpamInterval.value > TURBO_MIN_INTERVAL;
  }

  return {
    turboSpamLevel,
    turboSpamInterval,
    turboSpamUpgradeCost,
    upgradeTurboSpam,
    canUpgrade
  };
}
