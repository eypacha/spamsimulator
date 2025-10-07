<template>
  <div class="p-6">
    <h2 class="text-xl font-bold mb-4">Settings</h2>
    
    <!-- Toggle de efectos de sonido -->
    <div class="mb-6 bg-white p-4 shadow">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-semibold text-gray-800">Efectos de Sonido</h3>
          <p class="text-sm text-gray-600">Activar o desactivar todos los sonidos del juego</p>
        </div>
        <button 
          @click="soundStore.toggleSound()"
          :class="[
            'relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            soundStore.soundEnabled ? 'bg-blue-600' : 'bg-gray-300'
          ]"
        >
          <span 
            :class="[
              'inline-block h-6 w-6 transform rounded-full bg-white transition-transform',
              soundStore.soundEnabled ? 'translate-x-7' : 'translate-x-1'
            ]"
          ></span>
        </button>
      </div>
      <div class="mt-2 text-sm" :class="soundStore.soundEnabled ? 'text-green-600' : 'text-gray-500'">
        {{ soundStore.soundEnabled ? '🔊 Sonidos activados' : '🔇 Sonidos desactivados' }}
      </div>
    </div>

    <!-- Botón de borrar progreso -->
    <button @click="showConfirm = true" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
      Borrar Progreso
    </button>
    
    <div v-if="showConfirm" class="fixed inset-0 flex items-center justify-center bg-[#0004] z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
        <div class="mb-4 text-gray-800 font-semibold">¿Estás seguro de que quieres borrar todo el progreso?</div>
        <div class="flex justify-center gap-4">
          <button @click="confirmReset" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">Sí, borrar</button>
          <button @click="showConfirm = false" class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">Cancelar</button>
        </div>
      </div>
    </div>
    <VirusManager screen="settings" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSoundStore } from '../store/sound.js';
import VirusManager from './VirusManager.vue';

const soundStore = useSoundStore();
const showConfirm = ref(false);

function confirmReset() {
  localStorage.clear();
  location.reload();
}
</script>
