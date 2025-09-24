import { defineStore } from 'pinia';
import { ref } from 'vue';
import { EMAILS } from '../constants/emails.js';

export const useEmailStore = defineStore('email', () => {
  // Add starred and read to each email on initialization
  const emails = ref(EMAILS.map(e => ({
    ...e,
    starred: false,
    read: false
  })));

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
