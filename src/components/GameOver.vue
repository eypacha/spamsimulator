<template>
  <!-- Game Over Modal -->
  <div v-if="statsStore.gameOver" class="fixed inset-0 flex items-center justify-center bg-[#0004] z-50">
    <div class="bg-white rounded-lg shadow-2xl p-8 w-96 text-center max-w-sm mx-4">
      <div class="mb-6">
        <div class="text-6xl mb-4">💀</div>
        <h2 class="text-3xl font-bold text-red-600 mb-2">GAME OVER</h2>
        <p class="text-gray-600 mb-4">
          Los virus han drenado todas tus monedas.<br/>
          ¡No te rindas, inténtalo de nuevo!
        </p>
      </div>
      <button
        @click="restartGame"
        class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        🔄 Jugar de Nuevo
      </button>
    </div>
  </div>
</template>

<script setup>
import { useStatsStore } from '../store/stats.js';
import { useEmailStore } from '../store/email.js';

const statsStore = useStatsStore();
const emailStore = useEmailStore();

// Emitir evento para resetear la UI
const emit = defineEmits(['resetUI']);

function restartGame() {
  // Resetear emails
  emailStore.resetEmails();
  
  // Resetear stats del juego
  statsStore.resetGame();
  
  // Resetear UI (navegación, modales, etc.)
  console.log('Emitting resetUI event');
  emit('resetUI');
}
</script>