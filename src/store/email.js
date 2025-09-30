import { ref } from 'vue';
import { defineStore } from 'pinia';
import { fetchEmailFromLLM, newEmail } from '../utils/emailApi.js';
import { useSoundStore } from './sound.js';
import { useStatsStore } from './stats.js';
import { EMAILS } from '../constants/emails.js';

export const useEmailStore = defineStore('email', () => {

  const emails = ref([]);
  const time = ref(0); // in seconds
  const inboxFull = ref(false);
  const inboxFullNotified = ref(false);
  let gameLoopInterval = null;
  let timeInterval = null;

  const statsStore = useStatsStore();
  const soundStore = useSoundStore();

  function startGameLoop() {
    if (gameLoopInterval) return;
    fetchEmail();
    gameLoopInterval = setInterval(() => {

      setTimeout(() => {
        fetchEmail();
      }, 1000); // pequeño retraso para evitar solapamientos

    }, 3500);
    timeInterval = setInterval(() => {
      time.value++;
    }, 1000);
  }

  async function fetchEmail() {
    const visibleCount = emails.value.filter(e => !e.trash).length;
    if (visibleCount >= statsStore.maxInbox) {
      inboxFull.value = true;
      if (!inboxFullNotified.value) {
        inboxFullNotified.value = true;
        soundStore.playErrorSound();
      }
      return;
    }
    inboxFull.value = false;
    inboxFullNotified.value = false;
    // Determinar spam o legit
    const spamType = Math.random() < 0.5 ? 'spam' : 'legit';
    // Tipos para legit
    const legitTypes = ['friend', 'girlfriend', 'office', 'family', 'support'];
    // Tipos para spam
    const spamTypes = ['promo', 'cine', 'newsletter', 'bank', 'spaship', 'social', 'phishing', 'nigerian prince', 'shopping', 'travel', 'school', 'health', 'event', 'subscription', 'update', 'alert', 'delivery', 'job', 'community'];
    // Elegir tipo según spamType
    const emailType = spamType === 'legit' ? legitTypes[Math.floor(Math.random() * legitTypes.length)] : spamTypes[Math.floor(Math.random() * spamTypes.length)];
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
        parsed.fromEmail = 'carinovia@gmail.com';
      }
      emails.value.push(newEmail({ ...parsed, isSpam: spamType === 'spam', type: emailType }));
      // Reproducir sonido de nuevo email
      const soundStore = useSoundStore();
      soundStore.playNewEmail();
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
    if (email) {
      email.trash = true;
      const statsStore = useStatsStore();
      if (email.isSpam) {
        statsStore.addScore(statsStore.pointsPerSpam);
        statsStore.recordCorrectDeletion();
        if (email.type === 'nigerian prince') {
          statsStore.recordNigerianPrinceDeletion();
        }
      } else {
        statsStore.recordIncorrectDeletion();
      }
    }
  }

  return { emails, time, inboxFull, toggleStar, setRead, moveToTrash, fetchEmail, startGameLoop };
});
