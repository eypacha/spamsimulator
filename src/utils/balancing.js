/**
 * Calcula el nivel del jugador según el totalScore.
 * El nivel sube cada vez que se supera el umbral de puntos.
 * Ejemplo: Nivel 1 = 0, Nivel 2 = 100, Nivel 3 = 300, Nivel 4 = 600, etc.
 * Puedes ajustar la progresión como prefieras.
 * @param {number} totalScore
 * @returns {number} nivel
 */
export function calculateLevel(totalScore) {
  // Nivel 2 a 20 puntos; a partir de ahí la curva crece de forma más pronunciada
  let level = 1;
  let threshold = 0;
  let step = 20;       // para alcanzar el nivel 2
  const growth = 1.5;  // factor de crecimiento pronunciado para pasos posteriores

  while (totalScore >= threshold + step) {
    threshold += step;
    level++;
    step = Math.ceil(step * growth);
  }

  return level;
}

/**
 * Calcula los puntos necesarios para alcanzar un nivel específico
 * @param {number} targetLevel - Nivel objetivo
 * @returns {number} - Puntos necesarios para alcanzar ese nivel
 */
export function calculateLevelThreshold(targetLevel) {
  if (targetLevel <= 1) return 0;

  let threshold = 0;
  let step = 20;       // para alcanzar el nivel 2
  const growth = 1.5;  // factor de crecimiento pronunciado para pasos posteriores

  for (let level = 2; level <= targetLevel; level++) {
    threshold += step;
    step = Math.ceil(step * growth);
  }

  return threshold;
}
/**
 * Calcula el incremento de puntos por spam basado en el nivel actual
 * Usa una curva de crecimiento escalonada (Fibonacci-like)
 * @param {number} currentLevel - Nivel actual de pointsPerSpam
 * @returns {number} - Incremento a aplicar
 */
export function calculatePointsPerSpamIncrement(currentLevel) {
  // Curva de crecimiento escalonada
  if (currentLevel <= 1) return 1;   // Nivel 1: +1 (total: 1)
  if (currentLevel <= 3) return 2;   // Niveles 2-3: +2 (total: 3, 5)
  if (currentLevel <= 6) return 3;   // Niveles 4-6: +3 (total: 8, 11, 14)
  if (currentLevel <= 10) return 5;  // Niveles 7-10: +5 (total: 19, 24, 29, 34)
  if (currentLevel <= 15) return 8;  // Niveles 11-15: +8
  if (currentLevel <= 20) return 13; // Niveles 16-20: +13
  return 20; // Nivel 21+: +20
}

/**
 * Calcula el incremento de capacidad de papelera basado en el nivel actual
 * @param {number} currentCapacity - Capacidad actual de la papelera
 * @returns {number} - Incremento a aplicar
 */
export function calculateTrashCapacityIncrement(currentCapacity) {
  // Progresión: 5, 12, 19, 27, 37, 49, 64, 82...
  if (currentCapacity <= 10) return 5;   // Early: +5
  if (currentCapacity <= 25) return 7;   // Mid-early: +7
  if (currentCapacity <= 50) return 10;  // Mid: +10
  if (currentCapacity <= 80) return 15;  // Late: +15
  return 20; // End game: +20
}

/**
 * Calcula el incremento de capacidad del inbox basado en el nivel actual
 * @param {number} currentCapacity - Capacidad actual del inbox
 * @returns {number} - Incremento a aplicar
 */
export function calculateInboxCapacityIncrement(currentCapacity) {
  // Progresión: 20, 30, 42, 57, 77, 102, 137...
  if (currentCapacity <= 30) return 10;  // Early: +10
  if (currentCapacity <= 60) return 12;  // Mid-early: +12
  if (currentCapacity <= 100) return 15; // Mid: +15
  if (currentCapacity <= 150) return 20; // Late: +20
  return 25; // End game: +25
}

/**
 * Calcula el incremento de selección múltiple basado en el nivel actual
 * Este es el upgrade más valioso, por eso crece más lento
 * @param {number} currentSelectable - Cantidad actual de emails seleccionables
 * @returns {number} - Incremento a aplicar
 */
export function calculateSelectionIncrement(currentSelectable) {
  // Empieza en 3, crece de 1 en 1 hasta 6, luego de 2 en 2
  if (currentSelectable < 6) return 1;   // De 3 a 6: +1 cada vez
  if (currentSelectable < 10) return 2;  // De 6 a 10: +2 cada vez
  return 3; // 10+: +3 cada vez (casi imposible de alcanzar)
}

/**
 * Calcula el multiplicador de costo para selección múltiple
 * Más suave que antes (era 2.0x, ahora escalonado)
 * @param {number} currentSelectable - Cantidad actual de emails seleccionables
 * @returns {number} - Multiplicador a aplicar
 */
export function calculateSelectionCostMultiplier(currentSelectable) {
  if (currentSelectable <= 4) return 1.6;  // Primeros upgrades: más accesibles
  if (currentSelectable <= 7) return 1.7;  // Mid: un poco más caro
  return 1.8; // Late: caro pero no imposible
}

/**
 * Calcula el multiplicador de costo basado en el nivel actual
 * Hace que el costo aumente más rápido en niveles altos
 * @param {number} currentLevel - Nivel actual de pointsPerSpam
 * @returns {number} - Multiplicador a aplicar al costo
 */
export function calculateUpgradeCostMultiplier(currentLevel) {
  if (currentLevel <= 5) return 1.7;   // Niveles bajos: más caro
  if (currentLevel <= 10) return 1.9;  // Niveles medios: aún más caro
  if (currentLevel <= 15) return 2.1;  // Niveles altos: mucho más caro
  return 2.3; // Niveles muy altos: extremadamente caro
}

/**
 * Calcula la probabilidad de infección por virus al archivar spam
 * Más fácil al principio, más difícil en niveles altos
 * @param {number} level - Nivel actual del jugador
 * @returns {number} - Probabilidad entre 0 y 1
 */
export function calculateArchiveSpamVirusProbability(level) {
  if (level <= 2) return 0.2;     // Niveles bajos: 20% de probabilidad
  if (level <= 5) return 0.3;     // Niveles medios-bajos: 30%
  if (level <= 10) return 0.4;    // Niveles medios: 40%
  if (level <= 15) return 0.5;    // Niveles medios-altos: 50%
  return 0.6; // Niveles altos: 60%
}

/**
 * Calcula la cantidad máxima de virus al archivar spam
 * Más virus en niveles altos
 * @param {number} level - Nivel actual del jugador
 * @returns {number} - Cantidad máxima de virus (mínimo 1)
 */
export function calculateArchiveSpamMaxVirus(level) {
  if (level <= 3) return 2;      // Niveles bajos: máximo 2 virus
  if (level <= 7) return 3;      // Niveles medios-bajos: máximo 3
  if (level <= 12) return 4;     // Niveles medios: máximo 4
  if (level <= 18) return 5;     // Niveles medios-altos: máximo 5
  return 6; // Niveles altos: máximo 6 virus
}

/**
 * Calcula la probabilidad de infección por virus al hacer click en links ilegítimos
 * Más fácil al principio, más difícil en niveles altos
 * @param {number} level - Nivel actual del jugador
 * @returns {number} - Probabilidad entre 0 y 1
 */
export function calculateLinkClickVirusProbability(level) {
  if (level <= 2) return 0.3;     // Niveles bajos: 30% de probabilidad
  if (level <= 5) return 0.4;     // Niveles medios-bajos: 40%
  if (level <= 10) return 0.5;    // Niveles medios: 50%
  if (level <= 15) return 0.6;    // Niveles medios-altos: 60%
  return 0.7; // Niveles altos: 70%
}

/**
 * Calcula la cantidad máxima de virus al hacer click en links ilegítimos
 * Más virus en niveles altos
 * @param {number} level - Nivel actual del jugador
 * @returns {number} - Cantidad máxima de virus (mínimo 1)
 */
export function calculateLinkClickMaxVirus(level) {
  if (level <= 3) return 1;      // Niveles bajos: máximo 1 virus
  if (level <= 7) return 2;      // Niveles medios-bajos: máximo 2
  if (level <= 12) return 3;     // Niveles medios: máximo 3
  if (level <= 18) return 4;     // Niveles medios-altos: máximo 4
  return 5; // Niveles altos: máximo 5 virus
}
