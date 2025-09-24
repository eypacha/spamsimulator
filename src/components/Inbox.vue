<template>
  <section>
    <ul class="divide-y divide-gray-200 bg-white rounded-lg shadow">
      <Email v-for="email in emails" :key="email.id" :email="email" v-model="selectedEmails" @toggle-star="emailStore.toggleStar" />
    </ul>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useEmailStore } from '../store/email.js';
import { storeToRefs } from 'pinia';
import Email from './Email.vue';

const selectedEmails = ref([]);
const emailStore = useEmailStore();
const { emails } = storeToRefs(emailStore);
</script>
