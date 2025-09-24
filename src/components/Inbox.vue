<template>
  <section>
    <ul v-if="!selectedEmail" class="divide-y divide-gray-200 bg-white rounded-lg shadow">
      <Email v-for="email in emails" :key="email.id" :email="email" v-model="selectedEmails" @toggle-star="emailStore.toggleStar" @click="openEmail(email)" />
    </ul>
    <EmailDetail v-else :email="selectedEmail" @delete="deleteEmail" @star="toggleStar" @important="markImportant" />
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useEmailStore } from '../store/email.js';
import { storeToRefs } from 'pinia';
import Email from './Email.vue';
import EmailDetail from './EmailDetail.vue';

const selectedEmails = ref([]);
const selectedEmail = ref(null);
const emailStore = useEmailStore();
const { emails } = storeToRefs(emailStore);

function openEmail(email) {
  selectedEmail.value = email;
}

function deleteEmail(id) {
  const idx = emails.value.findIndex(e => e.id === id);
  if (idx !== -1) emails.value.splice(idx, 1);
  selectedEmail.value = null;
}

function toggleStar(id) {
  emailStore.toggleStar(id);
}

function markImportant(id) {
  const email = emails.value.find(e => e.id === id);
  if (email) email.important = !email.important;
}
</script>
