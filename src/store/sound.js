import { defineStore } from 'pinia';
import { Howl, Howler } from 'howler';
import { ref, watch } from 'vue';

export const useSoundStore = defineStore('sound', () => {
  // Estado para activar/desactivar efectos de sonido
  const soundEnabled = ref(localStorage.getItem('soundEnabled') !== 'false');

  // Guardar preferencia en localStorage cuando cambie
  watch(soundEnabled, (newValue) => {
    localStorage.setItem('soundEnabled', String(newValue));
  });

  // Sistema de throttle para evitar sonidos repetidos
  const soundThrottles = new Map();
  
  function throttleSound(soundName, callback, delay = 200) {
    if (!soundEnabled.value) return;
    
    const now = Date.now();
    const lastPlayed = soundThrottles.get(soundName) || 0;
    
    if (now - lastPlayed >= delay) {
      soundThrottles.set(soundName, now);
      callback();
    }
  }

  Howler.volume(0.8);

  const getAssetPath = (path) => {
    const base = import.meta.env.BASE_URL || '/';
    return base + path.replace(/^\//, '');
  };

  // Definir sonidos (placeholders, agregar archivos reales en public/sounds/)
  const newEmailSound = new Howl({
    src: [getAssetPath('sounds/new-email.wav')],
    volume: 0.8
  });

  const coinSound = new Howl({
    src: [getAssetPath('sounds/coin.mp3')],
    volume: 0.8
  });

  const sendSound = new Howl({
    src: [getAssetPath('sounds/send.wav')],
    volume: 0.8
  });

  function playSendSound() {
    sendSound.play();
  }

  const buySound = new Howl({
    src: [getAssetPath('sounds/ding.mp3')],
    volume: 0.7
  });

  const errorSound = new Howl({
    src: [getAssetPath('sounds/error.mp3')],
    volume: 1.0
  });

  const trashSound = new Howl({
      src: [getAssetPath('sounds/trash.mp3')],
      volume: 0.8
    });
    function playTrashSound() {
      trashSound.play();
    }

  const virusSound = new Howl({
    src: [getAssetPath('sounds/virus.wav')],
    volume: 1,
    onload: function() {
      console.log('Virus sound loaded successfully');
    },
    onloaderror: function(id, error) {
      console.error('Error loading virus sound:', error);
    },
    onplayerror: function(id, error) {
      console.error('Error playing virus sound:', error);
    }
  });

  const antivirusSound = new Howl({
    src: [getAssetPath('sounds/sword.wav')],
    volume: 1,
    onload: function() {
      console.log('Antivirus (sword) sound loaded successfully');
    },
    onloaderror: function(id, error) {
      console.error('Error loading antivirus sound:', error);
    },
    onplayerror: function(id, error) {
      console.error('Error playing antivirus sound:', error);
    }
  });
  
  const penaltySound = new Howl({
    src: [getAssetPath('sounds/penalty.wav')],
    volume: 0.9
  });
  
  const winSound = new Howl({
    src: [getAssetPath('sounds/win.mp3')],
    volume: 0.8
  });
  
  const levelupSound = new Howl({
    src: [getAssetPath('sounds/levelup.wav')],
    volume: 0.5
  });
  
  function playVirusSound() {
    throttleSound('virus', () => {
      console.log('Playing virus sound...');
      virusSound.play();
    }, 300);
  }

  function playAntivirusSound() {
    if (!soundEnabled.value) return;
    antivirusSound.play();
  }

  // Funciones para reproducir sonidos
  function playNewEmail() {
    if (!soundEnabled.value) return;
    newEmailSound.play();
  }

  function playDelete() {
    if (!soundEnabled.value) return;
    deleteSound.play();
  }

  function playStar() {
    if (!soundEnabled.value) return;
    starSound.play();
  }

  function playCoinSound() {
    if (!soundEnabled.value) return;
    coinSound.play();
  }

  function playBuySound() {
    if (!soundEnabled.value) return;
    buySound.play();
  }

  function playErrorSound() {
    throttleSound('error', () => errorSound.play(), 300);
  }

  function playSendSound() {
    if (!soundEnabled.value) return;
    sendSound.play();
  }

  function playTrashSound() {
    if (!soundEnabled.value) return;
    trashSound.play();
  }

  function playPenaltySound() {
    throttleSound('penalty', () => penaltySound.play(), 300);
  }

  function playWinSound() {
    if (!soundEnabled.value) return;
    // Detener el sonido anterior si está reproduciéndose
    winSound.stop();
    winSound.play();
  }

  function playLevelupSound() {
    if (!soundEnabled.value) return;
    levelupSound.play();
  }

  // Función para cambiar volumen global
  function setVolume(volume) {
    Howler.volume(volume);
  }

  // Función para activar/desactivar sonidos
  function toggleSound() {
    soundEnabled.value = !soundEnabled.value;
  }

  return {
    soundEnabled,
    playNewEmail,
    playDelete,
    playStar,
    playCoinSound,
    playBuySound,
    playErrorSound,
    setVolume,
    playTrashSound,
    playSendSound,
    playVirusSound,
  playAntivirusSound,
    playPenaltySound,
    playWinSound,
    playLevelupSound,
    toggleSound
  };
});