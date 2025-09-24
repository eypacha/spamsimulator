<template>
  <section>
    <ul v-if="!selectedEmail" class="divide-y divide-gray-200 bg-white rounded-lg shadow">
      <Email v-for="email in visibleEmails" :key="email.id" :email="email" v-model="selectedEmails" @toggle-star="emailStore.toggleStar" @click="openEmail(email)" />
    </ul>
    <EmailDetail v-else :email="selectedEmail" @delete="deleteEmail" @star="toggleStar" />
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useEmailStore } from '../store/email.js';
import { storeToRefs } from 'pinia';
import Email from './Email.vue';
import EmailDetail from './EmailDetail.vue';

const selectedEmails = ref([]);
const selectedEmail = ref(null);
const emailStore = useEmailStore();
const { emails } = storeToRefs(emailStore);
const visibleEmails = computed(() => emails.value.filter(e => !e.trash));

function openEmail(email) {
  selectedEmail.value = email;
}

function deleteEmail(id) {
  emailStore.moveToTrash(id);
  selectedEmail.value = null;
}

function toggleStar(id) {
  emailStore.toggleStar(id);
}
</script>
