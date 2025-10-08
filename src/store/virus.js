import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';

// Store dedicado para el manejo de virus
export const useVirusStore = defineStore('virus', () => {
  // Estado principal
  const virusCount = ref(0);
  const virusByScreen = ref({}); // Ej: { home: 0, achievements: 0, ... }

  // Función para inicializar con datos guardados
  function initializeVirusData(loadedData) {
    virusCount.value = loadedData?.virusCount ?? 0;
    virusByScreen.value = loadedData?.virusByScreen ?? { inbox: 0, trash: 0, store: 0, achievements: 0, settings: 0, starred: 0 };
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
    if (drain > 0 && scoreRef.value > 0) {
      scoreRef.value = Math.max(0, scoreRef.value - drain);
      // Guardar y disparar animación negativa (HUD ya detecta decremento)
      saveStatsCallback();
      // Reproducir sonido de virus por drenaje
      if (playSoundCallback) {
        playSoundCallback();
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
    if (screens.length > 0) {
      for (let i = 0; i < amount; i++) {
        const randomScreen = screens[Math.floor(Math.random() * screens.length)];
        if (!virusByScreen.value[randomScreen]) virusByScreen.value[randomScreen] = 0;
        virusByScreen.value[randomScreen]++;
      }
    }
  }

  // Remueve un virus de una pantalla específica o aleatoria
  function removeOneVirus(screen) {
    if (screen) {
      if (virusByScreen.value[screen] > 0) {
        virusByScreen.value[screen]--;
        virusCount.value--;
        return true;
      }
    } else {
      const screensWithVirus = Object.keys(virusByScreen.value).filter(s => virusByScreen.value[s] > 0);
      if (screensWithVirus.length > 0) {
        const randomScreen = screensWithVirus[Math.floor(Math.random() * screensWithVirus.length)];
        virusByScreen.value[randomScreen]--;
        virusCount.value--;
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
    hasVirus,
    incrementVirusCount,
    removeOneVirus,
    initializeVirusData,
    computeVirusDrain,
    applyVirusDrain,
    startVirusDrainLoop,
    stopVirusDrainLoop
  };
});
