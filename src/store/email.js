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
        // Email de spam: sumar puntos y monedas
        statsStore.addScore(statsStore.pointsPerSpam);
        statsStore.recordCorrectDeletion();
        if (email.type === 'nigerianprince') {
          statsStore.recordNigerianPrinceDeletion();
        }
      } else {
        // Email legítimo: RESTAR solo monedas (penalización)
        const penalty = statsStore.pointsPerSpam;
        
        // Restar monedas (score)
        if (statsStore.score >= penalty) {
          statsStore.score -= penalty;
        } else {
          statsStore.score = 0;
        }
        
        // Reproducir sonido de penalización
        soundStore.playPenaltySound();
        
        // totalSpamDeleted NO se resta, es una estadística acumulativa
        statsStore.recordIncorrectDeletion();
      }
    }
  // Guarda automáticamente cuando cambian los emails (por si hay cambios no cubiertos)
  watch(emails, saveEmails, { deep: true });
  }

  function convertLegitimateToSpam() {
    // Encontrar emails legítimos (no spam) que no estén en la papelera
    const legitimateEmails = emails.value.filter(e => !e.isSpam && !e.trash);
    
    if (legitimateEmails.length === 0) {
      // No hay ningún email legítimo para convertir
      return false;
    }

    // Seleccionar hasta 5 emails aleatorios (o todos los disponibles si son menos)
    const shuffled = [...legitimateEmails].sort(() => Math.random() - 0.5);
    const toReplace = shuffled.slice(0, Math.min(7, legitimateEmails.length));

    // Obtener emails de spam de la lista de constantes
    const spamEmails = EMAILS.filter(e => e.isSpam);

    // Reproducir sonido de virus inmediatamente
    soundStore.playVirusSound();

    // Reemplazar emails con delays progresivos (efecto de infección)
    toReplace.forEach((email, index) => {
      setTimeout(() => {
        // Seleccionar un email de spam aleatorio
        const randomSpam = spamEmails[Math.floor(Math.random() * spamEmails.length)];
        
        // Marcar temporalmente para flash visual
        email.virusFlash = true;
        saveEmails();
        
        // Después de 400ms, reemplazar el contenido
        setTimeout(() => {
          // Mantener el ID original pero reemplazar todo el contenido
          email.subject = randomSpam.subject;
          email.fromName = randomSpam.fromName;
          email.fromEmail = randomSpam.fromEmail;
          email.body = randomSpam.body;
          email.isSpam = true;
          email.type = randomSpam.type;
          email.read = false; // Marcar como no leído
          email.virusFlash = false;
          
          saveEmails();
        }, 400);
      }, index * 300); // 300ms entre cada conversión
    });

    return true;
  }

  return { emails, time, inboxFull, toggleStar, setRead, moveToTrash, fetchEmail, startGameLoop, convertLegitimateToSpam };
});
