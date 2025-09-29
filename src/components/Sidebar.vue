<template>
  <aside class="w-64 bg-gray-800 text-white flex-shrink-0">
    <nav class="h-full flex flex-col py-6">
      <ul class="space-y-2">
        <li>
          <button @click="selectMenu('compose')" :class="menuBtnClass('compose')">✍️ Redactar</button>
        </li>
        <li>
          <button @click="selectMenu('inbox')" :class="menuBtnClass('inbox')">📥 Recibidos</button>
        </li>
        <li>
          <button @click="selectMenu('sent')" :class="menuBtnClass('sent')">📤 Enviado</button>
        </li>
        <li>
          <button @click="selectMenu('starred')" :class="menuBtnClass('starred')">⭐ Destacados</button>
        </li>
        <li>
          <button @click="selectMenu('trash')" :class="menuBtnClass('trash')">🗑️ Papelera</button>
        </li>
        <li>
          <button @click="selectMenu('store')" :class="menuBtnClass('store')">🛒 Tienda</button>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
const props = defineProps({
  selectedMenu: String
});
const emit = defineEmits(['selectMenu']);

function selectMenu(menu) {
  emit('selectMenu', menu);
}

function menuBtnClass(menu) {
  return [
    'w-full text-left px-6 py-3 transition',
    props.selectedMenu === menu ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-gray-700',
  ];
}
</script>
