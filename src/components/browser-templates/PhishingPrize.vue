<template>
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
  </div>
</template>

<script setup>
defineProps({
  countdown: {
    type: String,
    default: '05:00'
  }
});
</script>
