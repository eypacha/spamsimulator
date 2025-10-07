<template>
  <!-- Virus emojis flotantes -->
  <div v-if="virusCount > 0" class="fixed inset-0 pointer-events-none z-30">
    <div
      v-for="virus in virusPositions"
      :key="virus.id"
      class="absolute text-4xl cursor-pointer pointer-events-auto transition-all duration-75"
      :class="{ 'animate-float': !virus.isMoving }"
      :style="{
        left: virus.x + '%',
        top: virus.y + '%',
        animationDelay: !virus.isMoving ? virus.delay + 's' : undefined,
        animationDuration: !virus.isMoving ? virus.duration + 's' : undefined
      }"
      @click="onVirusClick"
    >
      🦠
    </div>
  </div>

  <!-- Explosiones -->
  <div class="fixed inset-0 pointer-events-none z-40">
    <div
      v-for="explosion in explosions"
      :key="explosion.id"
      class="absolute text-5xl animate-explode"
      :style="{
        left: explosion.x + '%',
        top: explosion.y + '%',
        transform: 'translate(-50%, -50%)'
      }"
    >
      💥
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onUnmounted } from 'vue';
import { useStatsStore } from '../store/stats.js';
import { useSoundStore } from '../store/sound.js';

const props = defineProps({
  screen: {
    type: String,
    required: true
  }
});

const statsStore = useStatsStore();
const soundStore = useSoundStore();

const virusPositions = ref([]);
const explosions = ref([]);
let animationFrameId = null;

const virusCount = computed(() => statsStore.virusByScreen?.[props.screen] || 0);

function generateVirusPositions(count) {
  const positions = [];
  for (let i = 0; i < Math.min(count, 10); i++) {
    const isMoving = Math.random() < 0.5; // 50% de probabilidad de moverse
    positions.push({
      id: Math.random(),
      x: Math.random() * 90 + 5, // 5% to 95%
      y: Math.random() * 90 + 5,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2, // 3-5 seconds
      isMoving,
      // Propiedades para movimiento
      vx: isMoving ? (Math.random() - 0.5) * 0.3 : 0, // velocidad X
      vy: isMoving ? (Math.random() - 0.5) * 0.3 : 0, // velocidad Y
    });
  }
  return positions;
}

function updateMovingViruses() {
  virusPositions.value = virusPositions.value.map(virus => {
    if (!virus.isMoving) return virus;

    // Actualizar posición
    let newX = virus.x + virus.vx;
    let newY = virus.y + virus.vy;
    let newVx = virus.vx;
    let newVy = virus.vy;

    // Rebotar en los bordes
    if (newX <= 5 || newX >= 95) {
      newVx = -virus.vx;
      newX = newX <= 5 ? 5 : 95;
    }
    if (newY <= 5 || newY >= 95) {
      newVy = -virus.vy;
      newY = newY <= 5 ? 5 : 95;
    }

    return {
      ...virus,
      x: newX,
      y: newY,
      vx: newVx,
      vy: newVy
    };
  });

  if (virusCount.value > 0) {
    animationFrameId = requestAnimationFrame(updateMovingViruses);
  }
}

watch(virusCount, (newCount) => {
  virusPositions.value = generateVirusPositions(newCount);

  // Iniciar animación de virus móviles si hay virus
  if (newCount > 0 && !animationFrameId) {
    animationFrameId = requestAnimationFrame(updateMovingViruses);
  } else if (newCount === 0 && animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}, { immediate: true });

function onVirusClick(event) {
  // Eliminar un virus
  if (virusCount.value > 0) {
    // Obtener posición del click para la explosión
    const rect = event.target.getBoundingClientRect();
    const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
    const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100;

    // Crear explosión
    const explosionId = Date.now() + Math.random();
    explosions.value.push({ id: explosionId, x, y });

    // Remover explosión después de la animación
    setTimeout(() => {
      explosions.value = explosions.value.filter(e => e.id !== explosionId);
    }, 400);

    // Reproducir sonido de espada
    if (soundStore.playAntivirusSound) {
      soundStore.playAntivirusSound();
    }

    // Decrementar virus count
    statsStore.removeOneVirus(props.screen);
  }

  event.stopPropagation();
}

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>