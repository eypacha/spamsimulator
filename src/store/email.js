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

      setTimeout(() => {
        fetchEmail();
      }, 1000); // pequeño retraso para evitar solapamientos

    }, 2500);
  }

  async function fetchEmail() {
    // Determinar spam o legit
    const spamType = Math.random() < 0.5 ? 'spam' : 'legit';
    // Tipos posibles
    const types = [
      'friend',
      'girlfriend',
      'office',
      'family',
      'promo',
      'support',
      'circus',
      'newsletter',
      'friend',
      'friend',
      'friend',
      'bank',
      'spaship',
      'social',
      'phishing',
      'girlfriend',
      'girlfriend',
      'nigerian prince',
      'shopping',
      'travel',
      'school',
      'health',
      'event',
      'subscription',
      'update',
      'alert',
      'delivery',
      'job',
      'community'
    ];
    const emailType = types[Math.floor(Math.random() * types.length)];
    // Idioma
    let lang;
    if (spamType === 'legit') {
      lang = 'es';
    } else {
      const langs = ['es', 'en'];
      lang = langs[Math.floor(Math.random() * langs.length)];
    }
    try {
      const parsed = await fetchEmailFromLLM(spamType, emailType, lang);
      // Excepción: si el tipo es girlfriend, usar nombre fijo
      if (emailType === 'girlfriend' && spamType === 'legit') {
        parsed.fromName = '💚 Cari';
        parsed.fromEmail = 'caribufaino@gmail.com';
      }
      emails.value.push(newEmail({ ...parsed, isSpam: spamType === 'spam' }));
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
