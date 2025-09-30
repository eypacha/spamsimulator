import { ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { fetchEmailFromLLM, newEmail } from '../utils/emailApi.js';
import { useSoundStore } from './sound.js';
import { useStatsStore } from './stats.js';
import { EMAILS } from '../constants/emails.js';

export const useEmailStore = defineStore('email', () => {

  const EMAILS_STORAGE_KEY = 'spambot_emails';

  function loadEmails() {
    const saved = localStorage.getItem(EMAILS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  }

  function saveEmails() {
    localStorage.setItem(EMAILS_STORAGE_KEY, JSON.stringify(emails.value));
  }

  const emails = ref(loadEmails());
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
  saveEmails();
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
    if (email) {
      email.starred = !email.starred;
      saveEmails();
    }
  }

  function setRead(id, value = true) {
    const email = emails.value.find(e => e.id === id);
    if (email) {
      email.read = value;
      saveEmails();
    }
  }

  function moveToTrash(id) {
    const email = emails.value.find(e => e.id === id);
    if (email) {
      email.trash = true;
      saveEmails();
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
  // Guarda automáticamente cuando cambian los emails (por si hay cambios no cubiertos)
  watch(emails, saveEmails, { deep: true });
  }

  return { emails, time, inboxFull, toggleStar, setRead, moveToTrash, fetchEmail, startGameLoop };
});
