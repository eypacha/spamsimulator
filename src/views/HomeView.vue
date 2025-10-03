<template>
  <div class="home-view h-screen bg-gray-100 overflow-x-hidden flex flex-col">
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
          class="z-50 h-full absolute top-0 left-0 transition-transform duration-300 bg-gray-800 pointer-events-auto"
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
import { ref, onMounted, onUnmounted } from 'vue';
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

function handleSelectMenu(menu) {
  selectedMenu.value = menu;
  if (!isDesktop.value) sidebarOpen.value = false;
}

function onSendEmail(emailData) {
  soundStore.playSendSound();
  statsStore.recordEmailSent();
  showCompose.value = false;
}

function handleResize() {
  isDesktop.value = window.innerWidth >= 768;
  if (isDesktop.value) sidebarOpen.value = true;
}

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

</script>