<template>
  <div class="p-6">
    <h2 class="text-xl font-bold mb-4">Settings</h2>
    <button @click="resetProgress" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
      Borrar Progreso
    </button>
  </div>
</template>

<script setup>
function resetProgress() {
  localStorage.clear();
  location.reload();
}
</script>
