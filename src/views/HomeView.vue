<template>
    <div class="home-view flex h-screen bg-gray-100">
      <!-- Sidebar -->
      <Sidebar :selectedMenu="selectedMenu" @selectMenu="selectMenu" />
      <!-- Main Panel -->
      <main class="flex-1 overflow-y-auto">
        <Inbox  v-if="selectedMenu === 'inbox'"/>
        <Trash v-else-if="selectedMenu === 'trash'"/>
        <section v-else>
          <div class="text-gray-400 text-center mt-20 text-lg">Selecciona una opción del menú</div>
        </section>
      </main>
    </div>
  </template>

<script setup>
import { ref } from 'vue';
import Sidebar from '../components/Sidebar.vue';
import Inbox from '../components/Inbox.vue';
import Trash from '../components/Trash.vue';

const selectedMenu = ref('inbox');

function selectMenu(menu) {
  selectedMenu.value = menu;
}

</script>