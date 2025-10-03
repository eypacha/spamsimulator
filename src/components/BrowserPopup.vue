<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background: rgba(0,0,0,0.5);">
    <div class="bg-white shadow-2xl w-full max-w-3xl h-[55vh] flex flex-col animate-popup border-2 border-gray-400 rounded-lg">
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
          @click="$emit('close')" 
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
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';
import PhishingPrize from './browser-templates/PhishingPrize.vue';
import VirusWarning from './browser-templates/VirusWarning.vue';
import FakeBank from './browser-templates/FakeBank.vue';
import SurveyScam from './browser-templates/SurveyScam.vue';

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

const countdown = ref('05:00');
let countdownInterval = null;

// Countdown para páginas spam
watch(() => props.show, (newVal) => {
  if (newVal) {
    // Seleccionar un template aleatorio cada vez que se abre el popup
    currentTemplate.value = templates[Math.floor(Math.random() * templates.length)];
    startCountdown();
  } else {
    stopCountdown();
  }
});

function startCountdown() {
  let minutes = 4;
  let seconds = 59;
  
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
  countdown.value = '05:00';
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
