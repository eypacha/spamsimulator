import { defineStore } from 'pinia';
import { ref } from 'vue';
import { EMAILS } from '../constants/emails.js';

export const useEmailStore = defineStore('email', () => {
  const emails = ref(EMAILS);

  function toggleStar(id) {
    const email = emails.value.find(e => e.id === id);
    if (email) email.starred = !email.starred;
  }

  function setRead(id, value = true) {
    const email = emails.value.find(e => e.id === id);
    if (email) email.read = value;
  }

  return { emails, toggleStar, setRead };
});
