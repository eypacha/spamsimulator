<template>
  <div class="text-center space-y-6 p-5">
    <div class="text-6xl animate-bounce">⚠️</div>
    <h1 class="text-4xl font-bold text-red-600 animate-pulse">
      ¡¡¡ADVERTENCIA!!!
    </h1>
    <p class="text-2xl font-semibold">
      ¡Has ganado {{ prize }}!
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
import { ref, onMounted } from 'vue';

defineProps({
  countdown: {
    type: String,
    default: '05:00'
  }
});

const prizes = [
  'un iPhone 15 Pro Max',
  'un MacBook Pro M3',
  'una PlayStation 5',
  'un Tesla Model 3',
  'un iPad Pro 12.9"',
  'una Xbox Series X',
  'un Apple Watch Ultra',
  'un Samsung Galaxy S24 Ultra',
  '$10,000 USD en efectivo',
  'un viaje a Dubai todo pagado',
  'una Nintendo Switch OLED',
  'un dron DJI Mavic Pro',
  'unos AirPods Max',
  'una TV Samsung 85" 8K',
  'un iPhone 14 Pro + AirPods',
  'una bicicleta eléctrica Tesla',
  'un kit completo de gaming RGB',
  'una cámara Canon EOS R5',
  'un año de Netflix Premium GRATIS',
  'una moto Harley-Davidson'
];

const prize = ref('');

onMounted(() => {
  prize.value = prizes[Math.floor(Math.random() * prizes.length)];
});
</script>
