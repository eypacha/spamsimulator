<template>
  <div v-if="show" class="fixed inset-0 z-50" style="background: rgba(0,0,0,0.5);">
    <!-- Popup principal -->
    <div 
      class="bg-white shadow-2xl w-full max-w-3xl h-[55vh] flex flex-col animate-popup border-2 border-gray-400 absolute"
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
      <div class="flex-1 overflow-auto bg-white p-8">
        <!-- Página de spam/phishing simulada - Template aleatorio -->
        <component :is="currentTemplate" :countdown="countdown" />
      </div>
    </div>

    <!-- Popups adicionales (recursivo) -->
    <div 
      v-for="(popup, index) in additionalPopups" 
      :key="index"
      class="bg-white shadow-2xl w-full max-w-3xl h-[55vh] flex flex-col animate-popup border-2 border-gray-400 absolute"
      :style="{ top: popup.position.top, left: popup.position.left, zIndex: 51 + index }"
    >
      <!-- Barra superior del navegador -->
      <div class="bg-gray-200 px-3 py-2 flex items-center gap-2 border-b border-gray-300">
        <!-- Barra de navegación -->
        <div class="flex-1 flex items-center gap-2">
          <button class="text-gray-600 hover:text-gray-800 px-2">⟳</button>
          
          <!-- Barra de URL -->
          <div class="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-700 border border-gray-300 flex items-center gap-2">
            <span class="text-gray-400">🔒</span>
            <span class="truncate">{{ popup.url }}</span>
          </div>
        </div>
        
        <!-- Botón de cerrar -->
        <button 
          @click="closeAdditionalPopup(index)" 
          class="text-gray-600 hover:text-gray-900 text-xl font-bold px-2 cursor-pointer"
          title="Cerrar"
        >
          ×
        </button>
      </div>
      
      <!-- Contenido del navegador -->
      <div class="flex-1 overflow-auto bg-white p-8">
        <!-- Página de spam/phishing simulada - Template aleatorio -->
        <component :is="popup.template" :countdown="popup.countdown" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted, markRaw } from 'vue';
import { useStatsStore } from '../store/stats.js';
import { useEmailStore } from '../store/email.js';
import { useSoundStore } from '../store/sound.js';
import PhishingPrize from './browser-templates/PhishingPrize.vue';
import VirusWarning from './browser-templates/VirusWarning.vue';
import FakeBank from './browser-templates/FakeBank.vue';
import SurveyScam from './browser-templates/SurveyScam.vue';

const statsStore = useStatsStore();
const emailStore = useEmailStore();
const soundStore = useSoundStore();

const props = defineProps({
  show: Boolean,
  url: {
    type: String,
    default: 'https://ejemplo.com'
  }
});

const emit = defineEmits(['close']);

// Array de templates disponibles
const templates = [PhishingPrize, VirusWarning, FakeBank, SurveyScam];

// Seleccionar template aleatorio
const currentTemplate = ref(null);

// Posición aleatoria del popup
const randomPosition = ref({ top: '50%', left: '50%' });

const countdown = ref('00:10');
let countdownInterval = null;

// Popups adicionales
const additionalPopups = ref([]);
const popupIntervals = ref([]);

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

// Función para crear un popup adicional
function createAdditionalPopup() {
  // Reproducir sonido de win (cortando el anterior)
  soundStore.playWinSound();
  
  // Penalización: descontar 50% de los puntos por spam (como monedas), mínimo 1
  const penalty = Math.max(1, Math.floor(statsStore.pointsPerSpam / 2));
  
  // Restar monedas
  if (statsStore.score >= penalty) {
    statsStore.score -= penalty;
  } else {
    statsStore.score = 0;
  }
  
  // Restar puntos (estrellitas)
  if (statsStore.totalSpamDeleted >= penalty) {
    statsStore.totalSpamDeleted -= penalty;
  } else {
    statsStore.totalSpamDeleted = 0;
  }
  
  // Generar un nuevo email
  emailStore.fetchEmail();
  
  const newPopup = {
    template: markRaw(templates[Math.floor(Math.random() * templates.length)]),
    position: getRandomPosition(),
    url: props.url,
    countdown: ref('00:10')
  };
  
  additionalPopups.value.push(newPopup);
  
  // Iniciar countdown para este popup
  let minutes = 0;
  let seconds = 10;
  
  const interval = setInterval(() => {
    if (seconds === 0) {
      if (minutes === 0) {
        newPopup.countdown.value = '00:00';
        return;
      }
      minutes--;
      seconds = 59;
    } else {
      seconds--;
    }
    newPopup.countdown.value = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, 1000);
  
  popupIntervals.value.push(interval);
  
  // 50% de probabilidad de crear otro popup
  if (Math.random() < 0.5) {
    setTimeout(() => {
      createAdditionalPopup();
    }, 300); // Pequeño delay para que no se creen todos al mismo tiempo
  }
}

// Cerrar popup adicional
function closeAdditionalPopup(index) {
  if (popupIntervals.value[index]) {
    clearInterval(popupIntervals.value[index]);
    popupIntervals.value.splice(index, 1);
  }
  additionalPopups.value.splice(index, 1);
}

// Cerrar popup principal
function closePopup() {
  emit('close');
}

// Countdown para páginas spam
watch(() => props.show, (newVal) => {
  if (newVal) {
    // 50% de probabilidad de infectarse con un virus al hacer clic en un link
    const gotVirus = Math.random() < 0.5;
    
    if (gotVirus) {
      // Si hay virus, infectarse con 1 a 5 virus
      const virusAmount = Math.floor(Math.random() * 5) + 1;
      statsStore.incrementVirusCount(virusAmount); 
      soundStore.playVirusSound();
    } else {
      // Si no hay virus, reproducir el sonido de win
      soundStore.playWinSound();
    }
    
    // Penalización del popup principal: points puntos por spam (como monedas), mínimo 1
    const penalty = statsStore.pointsPerSpam;
    
    // Restar monedas
    if (statsStore.score >= penalty) {
      statsStore.score -= penalty;
    } else {
      statsStore.score = 0;
    }
    
    // Restar puntos (estrellitas)
    if (statsStore.totalSpamDeleted >= penalty) {
      statsStore.totalSpamDeleted -= penalty;
    } else {
      statsStore.totalSpamDeleted = 0;
    }
    
    // Generar un nuevo email para el popup principal
    emailStore.fetchEmail();
    
    // Seleccionar un template aleatorio cada vez que se abre el popup
    currentTemplate.value = markRaw(templates[Math.floor(Math.random() * templates.length)]);
    
    // Generar posición aleatoria
    randomPosition.value = getRandomPosition();
    
    startCountdown();
    
    // 50% de probabilidad de crear un popup adicional
    if (Math.random() < 0.5) {
      setTimeout(() => {
        createAdditionalPopup();
      }, 300);
    }
  } else {
    stopCountdown();
    // Limpiar todos los popups adicionales
    popupIntervals.value.forEach(interval => clearInterval(interval));
    popupIntervals.value = [];
    additionalPopups.value = [];
  }
});

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
