<template>
  <!-- Virus emojis flotantes -->
  <div v-if="virusCount > 0" class="fixed inset-0 pointer-events-none z-30">
    <div
      v-for="(virus, index) in virusPositions"
      :key="virus.id"
        :class="[
          'absolute cursor-pointer pointer-events-auto transition-all duration-75',
          virus.size === 16 ? 'text-8xl' : virus.size === 8 ? 'text-6xl' : 'text-4xl',
          { 'animate-float': !virus.isMoving }
        ]"
      
      :style="{
        left: virus.x + '%',
        top: virus.y + '%',
        transform: 'translate(-50%, -50%)',
        animationDelay: !virus.isMoving ? virus.delay + 's' : undefined,
        animationDuration: !virus.isMoving ? virus.duration + 's' : undefined
      }"
      @click="onVirusClick(index, $event)"
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
import { useVirusStore } from '../store/virus.js';
import { useSoundStore } from '../store/sound.js';

const props = defineProps({
  screen: {
    type: String,
    required: true
  }
});

const statsStore = useStatsStore();
const virusStore = useVirusStore();
const soundStore = useSoundStore();

import { computed as vueComputed } from 'vue';
// Visualización: solo los virus de la pantalla actual
const virusPositions = vueComputed(() => virusStore.virusList.filter(v => v.screen === props.screen));
const explosions = ref([]);
let animationFrameId = null;

const virusCount = vueComputed(() => virusStore.virusList.filter(v => v.screen === props.screen).length);

function generateVirusPositions(count) {
  const positions = [];
  for (let i = 0; i < Math.min(count, 10); i++) {
    const isMoving = Math.random() < 0.5;
    // Probabilidad de tamaño: 70% 4x, 20% 8x, 10% 16x
    const rand = Math.random();
    let size = 4;
    if (rand > 0.9) size = 16;
    else if (rand > 0.7) size = 8;
    positions.push({
      id: Math.random(),
      x: Math.random() * 90 + 5,
      y: Math.random() * 90 + 5,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
      isMoving,
      vx: isMoving ? (Math.random() - 0.5) * 0.3 : 0,
      vy: isMoving ? (Math.random() - 0.5) * 0.3 : 0,
      size,
    });
  }
  return positions;
}

function updateMovingViruses() {
  // Actualiza solo la posición en el store
  virusStore.virusList.forEach(virus => {
    if (!virus.isMoving) return;
    let newX = virus.x + virus.vx;
    let newY = virus.y + virus.vy;
    let newVx = virus.vx;
    let newVy = virus.vy;
    if (newX <= 5 || newX >= 95) {
      newVx = -virus.vx;
      newX = newX <= 5 ? 5 : 95;
    }
    if (newY <= 5 || newY >= 95) {
      newVy = -virus.vy;
      newY = newY <= 5 ? 5 : 95;
    }
    virus.x = newX;
    virus.y = newY;
    virus.vx = newVx;
    virus.vy = newVy;
  });
  if (virusCount.value > 0) {
    animationFrameId = requestAnimationFrame(updateMovingViruses);
  }
}

// Animación
watch(virusCount, (newCount) => {
  if (newCount > 0 && !animationFrameId) {
    animationFrameId = requestAnimationFrame(updateMovingViruses);
  } else if (newCount === 0 && animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}, { immediate: true });

function onVirusClick(virusIndex, event) {
  const virus = virusPositions.value[virusIndex];
  if (!virus) return;
  const x = virus.x;
  const y = virus.y;
  // Explosión visual
  const explosionId = Date.now() + Math.random();
  explosions.value.push({ id: explosionId, x, y });
  setTimeout(() => {
    explosions.value = explosions.value.filter(e => e.id !== explosionId);
  }, 400);
  if (soundStore.playAntivirusSound) {
    soundStore.playAntivirusSound();
  }

  // Subdivisión o eliminación usando el store
  if (virus.size === 16 || virus.size === 8) {
    virusStore.subdivideVirus(virus.id);
  } else if (virus.size === 4) {
    virusStore.removeOneVirusById(virus.id);
  }
  event.stopPropagation();
}

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>