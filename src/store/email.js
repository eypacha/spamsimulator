import { ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { newEmail } from '../utils/emailApi.js';
import { EMAILS } from '../constants/emails.js';
import { useSoundStore } from './sound.js';
import { useStatsStore } from './stats.js';

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
  let gameLoopTimeout = null;
  let timeInterval = null;
  let spamFrenzyInterval = null;

  const statsStore = useStatsStore();
  const soundStore = useSoundStore();

  function scheduleNextEmail() {
    const randomDelay = Math.floor(Math.random() * 500);
    let interval = statsStore.turboSpamInterval;
    gameLoopTimeout = setTimeout(async () => {
      await new Promise(res => setTimeout(res, randomDelay));
      await fetchEmail();
      scheduleNextEmail();
    }, interval);
  }

  // Observa el estado de Spam Frenzy y dispara emails extra durante el efecto
  watch(
    () => statsStore.spamFrenzyActive,
    (active) => {
      if (active) {
        if (spamFrenzyInterval) clearInterval(spamFrenzyInterval);
        spamFrenzyInterval = setInterval(() => {
          fetchEmail();
        }, 400); // cada 400ms llega un email extra
      } else {
        if (spamFrenzyInterval) clearInterval(spamFrenzyInterval);
        spamFrenzyInterval = null;
      }
    }
  );

  function startGameLoop() {
    if (gameLoopTimeout) return;
    fetchEmail();
    scheduleNextEmail();
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
    // Elegir un email random de las constantes
    const randomEmail = EMAILS[Math.floor(Math.random() * EMAILS.length)];
    emails.value.push(newEmail({ ...randomEmail }));
    saveEmails();
    soundStore.playNewEmail();
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
