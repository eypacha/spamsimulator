<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background: rgba(0,0,0,0.5);">
    <div class="bg-white shadow-2xl w-full max-w-4xl h-[70vh] flex flex-col animate-popup border-2 border-gray-400 rounded-lg">
      <!-- Barra superior del navegador -->
      <div class="bg-gray-200 px-3 py-2 flex items-center gap-2 border-b border-gray-300 rounded-t-lg">
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
        <!-- Página de spam/phishing simulada -->
        <div class="text-center space-y-6">
          <div class="text-6xl animate-bounce">⚠️</div>
          <h1 class="text-4xl font-bold text-red-600 animate-pulse">
            ¡¡¡ADVERTENCIA!!!
          </h1>
          <p class="text-2xl font-semibold">
            ¡Has ganado un iPhone 15 Pro Max!
          </p>
          <p class="text-lg text-gray-700">
            Para reclamar tu premio, haz clic en el botón de abajo e introduce tus datos bancarios.
          </p>
          <button class="bg-gradient-to-r cursor-pointer from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-lg text-xl font-bold animate-pulse shadow-lg hover:scale-105 transition">
            ¡RECLAMAR AHORA! 🎁
          </button>
          <div class="mt-4 text-sm text-gray-500">
            ⏰ Esta oferta expira en: <span class="text-red-600 font-bold">{{ countdown }}</span>
          </div>
          <div class="grid grid-cols-3 gap-4 mt-8">
            <div class="text-4xl animate-spin-slow">💰</div>
            <div class="text-4xl animate-bounce">🎉</div>
            <div class="text-4xl animate-pulse">✨</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';

const props = defineProps({
  show: Boolean,
  url: {
    type: String,
    default: 'https://ejemplo.com'
  }
});

const emit = defineEmits(['close']);

const countdown = ref('05:00');
let countdownInterval = null;

// Countdown para páginas spam
watch(() => props.show, (newVal) => {
  if (newVal) {
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
