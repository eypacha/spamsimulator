<template>
  <div class="text-center space-y-5 bg-red-50 p-4 rounded-lg border-4 border-red-600">
    <div class="text-6xl animate-pulse">🛡️</div>
    <h1 class="text-4xl font-bold text-red-700 uppercase">
      ¡VIRUS DETECTADO!
    </h1>
    <div class="bg-white p-4 rounded border-2 border-red-400">
      <div class="text-left space-y-2 text-sm font-mono">
        <div class="flex items-center gap-2">
          <span class="text-red-600">❌</span>
          <span>Trojan.Win32.Generic</span>
        </div>
      </div>
    </div>
    <p class="text-lg text-gray-700">
      ¡Descarga nuestro antivirus GRATIS ahora!
    </p>
    <button class="bg-red-600 cursor-pointer text-white px-8 py-4 rounded-lg text-xl font-bold shadow-lg hover:bg-red-700 transition animate-pulse">
      DESCARGAR ANTIVIRUS 🔒
    </button>
    <div class="mt-2 text-sm text-gray-600">
      ⏰ Tu sistema se bloqueará en: <span class="text-red-700 font-bold">{{ countdown }}</span>
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
