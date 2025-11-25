<template>
  <div v-if="show">
    <!-- Popup -->
    <div 
      class="bg-white shadow-2xl w-full max-w-3xl h-[55vh] flex flex-col animate-popup border-2 border-gray-400 absolute z-50"
      :style="{ top: randomPosition.top, left: randomPosition.left }"
    >
      <!-- Barra superior del navegador -->
      <div class="bg-gray-200 px-3 py-2 flex items-center gap-2 border-b border-gray-300">
        <!-- Barra de navegación -->
        <div class="flex-1 flex items-center gap-2">
          <button class="text-gray-600 hover:text-gray-800 px-2">⟳</button>
          
          <!-- Barra de URL -->
          <div class="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-700 border border-gray-300 flex items-center gap-2">
            <span class="text-gray-400">🔒</span>
            <span class="truncate">{{ url }}</span>
          </div>
        </div>
        
        <!-- Botón de cerrar -->
        <button 
          @click="closePopup" 
          class="text-gray-600 hover:text-gray-900 text-xl font-bold px-2 cursor-pointer"
          title="Cerrar"
        >
          ×
        </button>
      </div>
      
      <!-- Contenido del navegador -->
      <div class="flex-1 overflow-auto bg-white flex items-center justify-center p-4">
        <component
          v-if="component"
          :is="component"
          @close="closePopup"
        />
        <component
          v-else
          :is="currentTemplate"
          :countdown="countdown"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, onMounted, markRaw } from 'vue';
import { useStatsStore } from '../store/stats.js';
import { useEmailStore } from '../store/email.js';
import { useSoundStore } from '../store/sound.js';
import { calculateLinkClickVirusProbability, calculateLinkClickMaxVirus } from '../utils/balancing.js';
import PhishingPrize from './browser-templates/PhishingPrize.vue';
import VirusWarning from './browser-templates/VirusWarning.vue';
import FakeBank from './browser-templates/FakeBank.vue';
import SurveyScam from './browser-templates/SurveyScam.vue';
import RouletteScam from './browser-templates/RouletteScam.vue';
import CaptchaBrowser from './browser-templates/CaptchaBrowser.vue';

const statsStore = useStatsStore();
const soundStore = useSoundStore();

const props = defineProps({
  show: Boolean,
  url: {
    type: String,
    default: 'https://ejemplo.com'
  },
  screen: {
    type: String,
    default: 'inbox'
  },
  component: {
    type: [Object, Function, String],
    default: null
  }
});

const emit = defineEmits(['close']);

// Array de templates disponibles
const templates = [PhishingPrize, VirusWarning, FakeBank, SurveyScam, RouletteScam];

// Seleccionar template aleatorio
const currentTemplate = ref(null);

// Posición aleatoria del popup
const randomPosition = ref({ top: '50%', left: '50%' });

const countdown = ref('00:10');
let countdownInterval = null;

// Función para generar posición aleatoria
function getRandomPosition() {
  const isMobile = window.innerWidth < 768;
  const popupWidth = Math.min(window.innerWidth, 768); // max-w-3xl = 768px
  const margin = 16; // margen de seguridad para la 'x' (px)
  const maxLeftPx = window.innerWidth - popupWidth - margin;
  const maxLeftPercent = (maxLeftPx / window.innerWidth) * 100;
  const leftPercent = isMobile ? 0 : Math.random() * maxLeftPercent;
  const topPercent = Math.random() * 40 + 5; // Entre 5% y 45%
  return {
    top: `${topPercent}%`,
    left: `${leftPercent}%`
  };
}
// Cerrar popup principal
function closePopup() {
  emit('close');
}

function startCountdown() {
  let minutes = 0;
  let seconds = 10;
  
  countdownInterval = setInterval(() => {
    if (seconds === 0) {
      if (minutes === 0) {
        stopCountdown();
        countdown.value = '00:00';
        return;
      }
      minutes--;
      seconds = 59;
    } else {
      seconds--;
    }
    countdown.value = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, 1000);
}

function stopCountdown() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  countdown.value = '00:10';
}

onMounted(() => {
  // Si se pasa un componente personalizado, solo mostrarlo y no penalizar ni mostrar templates de spam
  if (props.component) {
    randomPosition.value = getRandomPosition();
    return;
  }
  // Si la url es 'captcha', mostrar CaptchaBrowser
  if (props.url === 'captcha') {
    currentTemplate.value = markRaw(CaptchaBrowser);
    randomPosition.value = getRandomPosition();
    return;
  }
  // Inicializar template y countdown para todos los popups
  currentTemplate.value = markRaw(templates[Math.floor(Math.random() * templates.length)]);
  randomPosition.value = getRandomPosition();
  startCountdown();

  // Penalización y virus
  // Probabilidad y cantidad de virus basada en el nivel del jugador
  const virusProbability = calculateLinkClickVirusProbability(statsStore.level);
  const maxVirusAmount = calculateLinkClickMaxVirus(statsStore.level);
  
  const gotVirus = Math.random() < virusProbability;
  
  if (gotVirus) {
    // Si hay virus, infectarse con 1 a maxVirusAmount virus
    const virusAmount = Math.floor(Math.random() * maxVirusAmount) + 1;
    console.log("🚀 ~ maxVirusAmount:", maxVirusAmount)
    statsStore.incrementVirusCount(virusAmount, props.screen); 
    soundStore.playVirusSound();
  } else {
    // Reproducir sonido al abrir
    soundStore.playWinSound();
  }
  
  // Penalización del popup principal: points puntos por spam (como monedas)
  const penalty = statsStore.pointsPerSpam;
  
  // Restar monedas
  if (statsStore.score >= penalty) {
    statsStore.score -= penalty;
  } else {
    statsStore.score = 0;
  }
  
  // Restar puntos (estrellitas)
  if (statsStore.totalScore >= penalty) {
    statsStore.totalScore -= penalty;
  } else {
    statsStore.totalScore = 0;
  }
});

onUnmounted(() => {
  stopCountdown();
});
</script>

<style scoped>
@keyframes popup {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-popup {
  animation: popup 0.2s ease-out;
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}
</style>
