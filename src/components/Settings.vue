<template>
  <div class="p-6">
    <h2 class="text-xl font-bold mb-4">Settings</h2>
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
  </div>
</template>

<script setup>
import { ref } from 'vue';
const showConfirm = ref(false);
function confirmReset() {
  localStorage.clear();
  location.reload();
}
</script>
