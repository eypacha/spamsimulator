<template>
  <div class="home-view h-screen bg-gray-100 overflow-x-hidden flex flex-col">
    <Hud />
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <Sidebar :selectedMenu="selectedMenu" @selectMenu="selectMenu" @openCompose="showCompose = true" />
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
      <div v-if="showCompose" class="fixed inset-0 z-50 flex items-center justify-center bg-[#0004]}">
        <ComposeEmail @send="onSendEmail" @close="showCompose = false" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
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

function selectMenu(menu) {
  selectedMenu.value = menu;
}

function onSendEmail(emailData) {
  soundStore.playSendSound();
  statsStore.recordEmailSent();
  showCompose.value = false;
}

</script>