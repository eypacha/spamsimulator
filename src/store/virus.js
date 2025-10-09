import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';

// Store dedicado para el manejo de virus
export const useVirusStore = defineStore('virus', () => {
  // Estado principal
  const virusCount = ref(0);
  const virusByScreen = ref({}); // Ej: { home: 0, achievements: 0, ... }
  // Nuevo: array de virus con propiedades
  const virusList = ref([]); // [{id, size, x, y, screen, ...}]

  // Función para inicializar con datos guardados
  function initializeVirusData(loadedData) {
    virusCount.value = loadedData?.virusCount ?? 0;
    virusByScreen.value = loadedData?.virusByScreen ?? { inbox: 0, trash: 0, store: 0, achievements: 0, settings: 0, starred: 0 };
    virusList.value = loadedData?.virusList ?? [];
  }

  // === Virus coin drain logic ===
  const VIRUS_DRAIN_INTERVAL = 2000; // 2s
  let virusDrainTimer = null;

  // Función para calcular el drain (recibe pointsPerSpam del statsStore)
  function computeVirusDrain(pointsPerSpam) {
    if (virusCount.value <= 0) return 0;
    const drainPerVirus = Math.max(1, Math.floor(pointsPerSpam * 0.25));
    return drainPerVirus * virusCount.value;
  }

  // Función para aplicar el drain (recibe callbacks para modificar score y reproducir sonido)
  function applyVirusDrain(pointsPerSpam, scoreRef, saveStatsCallback, playSoundCallback) {
    const drain = computeVirusDrain(pointsPerSpam);
    if (drain > 0) {
      // Siempre reproducir sonido si hay virus, para indicar infección continua
      if (playSoundCallback) {
        playSoundCallback();
      }
      
      // Solo drenar monedas si hay score disponible
      if (scoreRef.value > 0) {
        scoreRef.value = Math.max(0, scoreRef.value - drain);
        // Guardar y disparar animación negativa (HUD ya detecta decremento)
        saveStatsCallback();
      }
    }
  }

  function startVirusDrainLoop(pointsPerSpam, scoreRef, saveStatsCallback, playSoundCallback) {
    if (virusDrainTimer) return; // ya corriendo
    virusDrainTimer = setInterval(() => {
      applyVirusDrain(pointsPerSpam, scoreRef, saveStatsCallback, playSoundCallback);
    }, VIRUS_DRAIN_INTERVAL);
  }

  function stopVirusDrainLoop() {
    if (virusDrainTimer) {
      clearInterval(virusDrainTimer);
      virusDrainTimer = null;
    }
  }

  // Incrementa la cantidad de virus (puede ser por pantalla)
  function incrementVirusCount(amount = 1, screens = []) {
    virusCount.value += amount;
    for (let i = 0; i < amount; i++) {
      // Probabilidad de tamaño: 70% 4x, 20% 8x, 10% 16x
      const rand = Math.random();
      let size = 4;
      if (rand > 0.9) size = 16;
      else if (rand > 0.7) size = 8;
      const screen = screens.length > 0 ? screens[Math.floor(Math.random() * screens.length)] : null;
      if (screen) {
        if (!virusByScreen.value[screen]) virusByScreen.value[screen] = 0;
        virusByScreen.value[screen]++;
      }
      virusList.value.push({
        id: Date.now() + Math.random() + '_' + Math.random(),
        size,
        x: Math.random() * 90 + 5,
        y: Math.random() * 90 + 5,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2,
        isMoving: Math.random() < 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        screen,
      });
    }
  }

  // Remueve un virus de una pantalla específica o aleatoria
  function removeOneVirusById(virusId) {
    const idx = virusList.value.findIndex(v => v.id === virusId);
    if (idx !== -1) {
      const virus = virusList.value[idx];
      if (virus.screen && virusByScreen.value[virus.screen] > 0) {
        virusByScreen.value[virus.screen]--;
      }
      virusList.value.splice(idx, 1);
      virusCount.value--;
      return true;
    }
    return false;
  }

  // Subdivide un virus por id
  function subdivideVirus(virusId) {
    const idx = virusList.value.findIndex(v => v.id === virusId);
    if (idx !== -1) {
      const virus = virusList.value[idx];
      let newSize = virus.size === 16 ? 8 : 4;
      if (virus.size === 16 || virus.size === 8) {
        for (let i = 0; i < 2; i++) {
          virusList.value.push({
            id: Date.now() + Math.random() + '_' + Math.random(),
            size: newSize,
            x: virus.x + (Math.random() - 0.5) * 5,
            y: virus.y + (Math.random() - 0.5) * 5,
            delay: Math.random() * 2,
            duration: 3 + Math.random() * 2,
            isMoving: Math.random() < 0.5,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            screen: virus.screen,
          });
        }
        virusCount.value += 2;
        // Eliminar el virus original
        virusList.value.splice(idx, 1);
        virusCount.value--;
        if (virus.screen && virusByScreen.value[virus.screen] > 0) {
          virusByScreen.value[virus.screen]--;
        }
        return true;
      }
    }
    return false;
  }

  // Computed para saber si hay virus activos
  const hasVirus = computed(() => virusCount.value > 0);

  // Watch para debug o efectos secundarios
  watch(virusCount, (newCount, oldCount) => {
    // Aquí puedes disparar efectos secundarios si lo necesitas
  });

  return {
    virusCount,
    virusByScreen,
    virusList,
    hasVirus,
    incrementVirusCount,
    removeOneVirusById,
    subdivideVirus,
    initializeVirusData,
    computeVirusDrain,
    applyVirusDrain,
    startVirusDrainLoop,
    stopVirusDrainLoop
  };
});
