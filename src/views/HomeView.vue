<template>
  <div class="home-view h-screen bg-gray-100 overflow-x-hidden flex flex-col">
    <Hud />
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <Sidebar :selectedMenu="selectedMenu" @selectMenu="selectMenu" />
      <!-- Main Panel -->
      <main class="flex-1 max-w-full">
        <Inbox v-if="selectedMenu === 'inbox'"/>
        <Starred v-else-if="selectedMenu === 'starred'"/>
        <Trash v-else-if="selectedMenu === 'trash'"/>
        <Store v-else-if="selectedMenu === 'store'"/>
        <Achievements v-else-if="selectedMenu === 'achievements'"/>
        <section v-else>
          <div class="text-gray-400 text-center mt-20 text-lg">Selecciona una opción del menú</div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from '../components/Sidebar.vue';
import Inbox from '../components/Inbox.vue';
import Trash from '../components/Trash.vue';
import Starred from '../components/Starred.vue';
import Hud from '../components/Hud.vue';
import Store from '../components/Store.vue';
import Achievements from '../components/Achievements.vue';

const selectedMenu = ref('inbox');

function selectMenu(menu) {
  selectedMenu.value = menu;
}

</script>