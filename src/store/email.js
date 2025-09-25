import { ref } from 'vue';
import { defineStore } from 'pinia';
import { fetchEmailFromLLM, newEmail } from '../utils/emailApi.js';

export const useEmailStore = defineStore('email', () => {
  // Inicializa la bandeja vacía
  const emails = ref([]);
  let gameLoopInterval = null;

  function startGameLoop() {
    if (gameLoopInterval) return;
    fetchEmail();
    gameLoopInterval = setInterval(() => {
      fetchEmail();
    }, 5000); // cada 5 segundos
  }

  async function fetchEmail() {
    // Determinar spam o legit
    const spamType = Math.random() < 0.5 ? 'spam' : 'legit';
    // Tipos posibles
    const types = ['friend', 'girlfriend', 'office', 'family', 'promo', 'support', 'newsletter'];
    const emailType = types[Math.floor(Math.random() * types.length)];
    // Idioma
    let lang;
    if (spamType === 'legit') {
      lang = 'es';
    } else {
      const langs = ['es', 'en', 'zh'];
      lang = langs[Math.floor(Math.random() * langs.length)];
    }
    try {
      const parsed = await fetchEmailFromLLM(spamType, emailType, lang);
      emails.value.push(newEmail(parsed));
    } catch (err) {
      console.error('Error al pedir email:', err);
    }
  }

  // Iniciar el GameLoop al montar el store
  startGameLoop();

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

  return { emails, toggleStar, setRead, moveToTrash, fetchEmail, startGameLoop };
});
