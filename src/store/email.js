import { ref, onMounted } from 'vue';
import { defineStore } from 'pinia';
import { fetchEmailFromLLM, newEmail } from '../utils/emailApi.js';

export const useEmailStore = defineStore('email', () => {
  // Inicializa la bandeja vacía
  const emails = ref([]);

  async function fetchEmail() {
    try {
      const parsed = await fetchEmailFromLLM();
      emails.value.push(newEmail(parsed));
    } catch (err) {
      console.error('Error al pedir email:', err);
    }
  }

  onMounted(() => {
    fetchEmail();
  });

  function toggleStar(id) {
    const email = emails.value.find(e => e.id === id);
    if (email) email.starred = !email.starred;
  }

  function setRead(id, value = true) {
    const email = emails.value.find(e => e.id === id);
    if (email) email.read = value;
  }

  function moveToTrash(id) {
    const email = emails.value.find(e => e.id === id);
    if (email) email.trash = true;
  }

  return { emails, toggleStar, setRead, moveToTrash, fetchEmail };
});
