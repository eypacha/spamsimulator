<template>
  <div class="home-view h-screen bg-gray-100 overflow-x-hidden flex flex-col relative">
    <!-- Virus emojis flotantes -->
    <div v-if="statsStore.virusCount > 0" class="fixed inset-0 pointer-events-none z-30">
      <div
        v-for="virus in virusPositions"
        :key="virus.id"
        class="absolute text-4xl animate-float cursor-pointer pointer-events-auto"
        :style="{
          left: virus.x + '%',
          top: virus.y + '%',
          animationDelay: virus.delay + 's',
          animationDuration: virus.duration + 's'
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
    
    <Hud @openSidebar="sidebarOpen = true" />
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar: drawer en mobile, fijo en desktop -->
      <template v-if="isDesktop">
        <Sidebar
          :selectedMenu="selectedMenu"
          @selectMenu="handleSelectMenu"
          @openCompose="showCompose = true"
          class="relative"
        />
      </template>
      <div v-if="!isDesktop" class="fixed inset-0 z-40 flex pointer-events-none">
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-[#0004] transition-opacity duration-300"
          :class="sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'"
          @click="sidebarOpen = false"
        ></div>

        <Sidebar
          :selectedMenu="selectedMenu"
          @selectMenu="handleSelectMenu"
          @openCompose="showCompose = true"
          class="z-50 h-full absolute top-0 left-0 transition-transform duration-300 pointer-events-auto"
          :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
        />
      </div>
      <!-- Main Panel -->
      <main class="flex-1 max-w-full">
        <Inbox v-if="selectedMenu === 'inbox'"/>
        <Starred v-else-if="selectedMenu === 'starred'"/>
        <Trash v-else-if="selectedMenu === 'trash'"/>
        <Store v-else-if="selectedMenu === 'store'"/>
        <Achievements v-else-if="selectedMenu === 'achievements'"/>
        <Settings v-else-if="selectedMenu === 'settings'"/>
        <section v-else>
          <div class="text-gray-400 text-center mt-20 text-lg">Selecciona una opción del menú</div>
        </section>
      </main>
      <div v-if="showCompose" class="fixed inset-0 z-50 flex items-center justify-center bg-[#0004]">
        <ComposeEmail @send="onSendEmail" @close="showCompose = false" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useSoundStore } from '../store/sound.js';
import { useStatsStore } from '../store/stats.js';
import Sidebar from '../components/Sidebar.vue';
import Inbox from '../components/Inbox.vue';
import Trash from '../components/Trash.vue';
import Starred from '../components/Starred.vue';
import Hud from '../components/Hud.vue';
import Store from '../components/Store.vue';
import Achievements from '../components/Achievements.vue';
import ComposeEmail from '../components/ComposeEmail.vue';
import Settings from '../components/Settings.vue';


const selectedMenu = ref('inbox');
const showCompose = ref(false);
const soundStore = useSoundStore();
const statsStore = useStatsStore();
const sidebarOpen = ref(false);
const isDesktop = ref(window.innerWidth >= 768);
const virusPositions = ref([]);
const explosions = ref([]);

function generateVirusPositions(count) {
  const positions = [];
  for (let i = 0; i < Math.min(count, 10); i++) {
    positions.push({
      id: Math.random(),
      x: Math.random() * 90 + 5, // 5% to 95%
      y: Math.random() * 90 + 5,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2 // 3-5 seconds
    });
  }
  return positions;
}

watch(() => statsStore.virusCount, (newCount) => {
  virusPositions.value = generateVirusPositions(newCount);
}, { immediate: true });

function onVirusClick(event) {
  // Eliminar un virus
  if (statsStore.virusCount > 0) {
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
    
    // Decrementar virus count usando la función del store
    const removed = statsStore.virusCount > 0;
    if (removed) {
      statsStore.virusCount--;
      statsStore.saveAllStats?.();
    }
  }
  
  event.stopPropagation();
}

function handleSelectMenu(menu) {
  selectedMenu.value = menu;
  if (!isDesktop.value) sidebarOpen.value = false;
}

function onSendEmail(emailData) {
  if (!statsStore.composeUnlocked) return;
  soundStore.playSendSound();
  statsStore.recordEmailSent();
  showCompose.value = false;
}

function handleResize() {
  isDesktop.value = window.innerWidth >= 768;
  if (isDesktop.value) sidebarOpen.value = true;
}

function handleKeydown(event) {
  // Solo si los atajos están desbloqueados y se presiona Shift
  if (!statsStore.keyboardShortcutsUnlocked || !event.shiftKey) return;
  
  const key = event.key.toUpperCase();
  
  switch(key) {
    case 'Q':
      if (statsStore.composeUnlocked) {
        showCompose.value = true;
        event.preventDefault();
      }
      break;
    case 'W':
      selectedMenu.value = 'inbox';
      showCompose.value = false;
      event.preventDefault();
      break;
    case 'E':
      if (statsStore.starredUnlocked) {
        selectedMenu.value = 'starred';
        showCompose.value = false;
        event.preventDefault();
      }
      break;
    case 'R':
      selectedMenu.value = 'trash';
      showCompose.value = false;
      event.preventDefault();
      break;
    case 'A':
      selectedMenu.value = 'store';
      showCompose.value = false;
      event.preventDefault();
      break;
    case 'S':
      selectedMenu.value = 'achievements';
      showCompose.value = false;
      event.preventDefault();
      break;
    case 'D':
      selectedMenu.value = 'settings';
      showCompose.value = false;
      event.preventDefault();
      break;
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize);
  window.addEventListener('keydown', handleKeydown);
  handleResize();
});
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('keydown', handleKeydown);
});

</script>