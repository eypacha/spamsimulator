<template>
  <div class="home-view flex h-screen bg-gray-100 overflow-x-hidden">
    <!-- Sidebar -->
    <Sidebar :selectedMenu="selectedMenu" @selectMenu="selectMenu" />
    <!-- Main Panel -->
    <main class="flex-1 max-w-full">
      <Inbox v-if="selectedMenu === 'inbox'"/>
      <Starred v-else-if="selectedMenu === 'starred'"/>
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
import Starred from '../components/Starred.vue';

const selectedMenu = ref('inbox');

function selectMenu(menu) {
  selectedMenu.value = menu;
}

</script>