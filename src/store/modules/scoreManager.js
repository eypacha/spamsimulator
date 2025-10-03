import { ref } from 'vue';

/**
 * Score Manager - Maneja la lógica de puntuación con multiplicadores y sonidos
 * @param {Ref} comboUnlocked - Ref que indica si el combo está desbloqueado
 * @param {Ref} comboMultiplier - Ref del multiplicador de combo actual
 * @param {Object} statsTracker - Instancia del statsTracker
 * @param {Function} saveAllStats - Función para guardar estadísticas
 * @param {Object} soundStore - Store de sonidos
 * @returns {Object} Estado y funciones de puntuación
 */
export function createScoreManager(comboUnlocked, comboMultiplier, statsTracker, saveAllStats, soundStore) {
  let soundTimeout = null;

  function addScore(score, points) {
    let realPoints = points;
    
    // Aplicar multiplicador de combo si está desbloqueado
    if (comboUnlocked.value) {
      realPoints = points * comboMultiplier.value;
    }
    
    // Actualizar score y estadísticas
    score.value += realPoints;
    statsTracker.incrementCoinsEarned(realPoints);
    statsTracker.incrementSpamDeleted();
    saveAllStats();
    
    // Throttle sound para evitar múltiples reproducciones
    if (soundTimeout) clearTimeout(soundTimeout);
    soundTimeout = setTimeout(() => {
      soundStore.playCoinSound();
    }, 100);
  }

  return {
    addScore
  };
}
