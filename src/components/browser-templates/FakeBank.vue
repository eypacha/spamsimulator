<template>
  <div class="space-y-4">
    <div class="space-y-3">
      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div class="flex items-start gap-3">
          <span class="text-2xl">⚠️</span>
          <div>
            <p class="font-bold text-yellow-800">Verificación de Seguridad Requerida</p>
            <p class="text-sm text-yellow-700 mt-1">
              Por motivos de seguridad, necesitamos verificar tu identidad.
            </p>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <div>
          <label class="block text-sm font-semibold mb-1">Número de Tarjeta</label>
          <input 
            type="text" 
            placeholder="1234 5678 9012 3456"
            class="w-full border-2 border-gray-300 rounded px-3 py-2 cursor-pointer"
          />
        </div>
        
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-semibold mb-1">Fecha Exp.</label>
            <input 
              type="text" 
              placeholder="MM/AA"
              class="w-full border-2 border-gray-300 rounded px-3 py-2 cursor-pointer"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold mb-1">CVV</label>
            <input 
              type="text" 
              placeholder="123"
              class="w-full border-2 border-gray-300 rounded px-3 py-2 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <button class="w-full bg-blue-600 cursor-pointer text-white px-6 py-3 rounded-lg text-lg font-bold shadow-lg hover:bg-blue-700 transition">
        Verificar Identidad 🔐
      </button>

      <div class="text-center text-sm text-gray-500 mt-4">
        ⏰ Sesión expira en: <span class="text-red-600 font-bold">{{ countdown }}</span>
      </div>

      <div class="flex items-center justify-center gap-4 text-xs text-gray-400 mt-4">
        <span>🔒 Conexión Segura</span>
        <span>✓ SSL Verificado</span>
        <span>🛡️ Protegido</span>
      </div>
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
