<template>
  <div class="space-y-6">
    <div class="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg text-center">
      <div class="text-4xl mb-2">🎯</div>
      <h1 class="text-3xl font-bold">¡Felicidades!</h1>
      <p class="text-lg mt-2">Has sido seleccionado para participar</p>
    </div>

    <div class="p-6 space-y-4">
      <div class="bg-green-50 border-2 border-green-400 rounded-lg p-4 text-center">
        <p class="text-xl font-bold text-green-700">
          Completa esta encuesta y gana $500 USD
        </p>
        <p class="text-sm text-green-600 mt-1">
          Solo quedan 3 premios disponibles
        </p>
      </div>

      <div class="space-y-4">
        <div>
          <p class="font-semibold mb-2">1. ¿Cuánto ganas al mes?</p>
          <select class="w-full border-2 border-gray-300 rounded px-3 py-2 cursor-pointer">
            <option>Selecciona una opción</option>
            <option>Menos de $1,000</option>
            <option>$1,000 - $3,000</option>
            <option>$3,000 - $5,000</option>
            <option>Más de $5,000</option>
          </select>
        </div>

        <div>
          <p class="font-semibold mb-2">2. ¿Número de teléfono?</p>
          <input 
            type="tel" 
            placeholder="+1 (555) 123-4567"
            class="w-full border-2 border-gray-300 rounded px-3 py-2 cursor-pointer"
          />
        </div>

        <div>
          <p class="font-semibold mb-2">3. ¿Email personal?</p>
          <input 
            type="email" 
            placeholder="tu@email.com"
            class="w-full border-2 border-gray-300 rounded px-3 py-2 cursor-pointer"
          />
        </div>

        <div>
          <p class="font-semibold mb-2">4. Para recibir el premio, introduce tu tarjeta:</p>
          <input 
            type="text" 
            placeholder="Número de tarjeta"
            class="w-full border-2 border-gray-300 rounded px-3 py-2 cursor-pointer"
          />
        </div>
      </div>

      <div class="flex items-center justify-center gap-2 text-yellow-600">
        <span class="text-2xl">⭐</span>
        <span class="text-2xl">⭐</span>
        <span class="text-2xl">⭐</span>
        <span class="text-2xl">⭐</span>
        <span class="text-2xl">⭐</span>
      </div>

      <button class="w-full bg-gradient-to-r cursor-pointer from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg text-lg font-bold shadow-lg hover:scale-105 transition animate-pulse">
        RECLAMAR $500 💰
      </button>

      <div class="text-center text-sm text-gray-500 mt-4">
        ⏰ Oferta válida por: <span class="text-red-600 font-bold">{{ countdown }}</span>
      </div>

      <div class="text-xs text-gray-400 text-center space-y-1">
        <p>✓ 12,847 personas ya ganaron</p>
        <p>✓ 100% legítimo y verificado</p>
        <p>✓ Sin costo, sin trampa</p>
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
