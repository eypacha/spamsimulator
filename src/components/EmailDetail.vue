<template>
  <div class="max-w-xl mx-auto bg-white rounded-lg shadow p-6 mt-8">
    <div class="mb-4">
      <h2 class="text-2xl font-bold mb-2">{{ email.subject }}</h2>
      <div class="text-gray-500 text-sm mb-1">De: <span class="font-semibold">{{ email.fromName }}</span></div>
      <div v-if="email.fromEmail" class="text-gray-400 text-xs mb-1">&lt;{{ email.fromEmail }}&gt;</div>
      <div class="text-gray-500 text-sm mb-1">Para: <span class="font-semibold">{{ email.sender || 'tú' }}</span></div>
      <div class="text-gray-400 text-xs mb-2">Fecha: {{ email.date }}</div>
    </div>
    <div class="mb-6">
      <div class="text-base whitespace-pre-line" v-html="email.body"></div>
    </div>
    <div class="flex gap-4 border-t pt-4">
      <button v-if="!email.trash" @click="onDelete" class="px-4 py-2 rounded bg-red-100 text-red-700 hover:bg-red-200"><i class="fas fa-trash"></i></button>
      <button v-else @click="onDeletePermanent" class="px-4 py-2 rounded bg-red-100 text-red-700 hover:bg-red-200"><i class="fas fa-times"></i></button>
      <button v-if="!email.trash" @click="onStar" class="px-4 py-2 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200"><i :class="email.starred ? 'fas fa-star' : 'far fa-star'" ></i></button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
const props = defineProps({ email: Object });
const emit = defineEmits(['delete', 'star', 'deletePermanent']);

function onDelete() {
  emit('delete', props.email.id);
}
function onDeletePermanent() {
  emit('deletePermanent', props.email.id);
}
function onStar() {
  emit('star', props.email.id);
}
import '@fortawesome/fontawesome-free/css/all.css';
</script>
