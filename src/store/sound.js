import { defineStore } from 'pinia';
import { Howl, Howler } from 'howler';

export const useSoundStore = defineStore('sound', () => {
  // Configurar Howler global
  Howler.volume(0.5); // Volumen global al 50%

  // Definir sonidos (placeholders, agregar archivos reales en public/sounds/)
  const newEmailSound = new Howl({
    src: ['/sounds/new-email.wav'], // Agregar archivo
    volume: 0.8
  });

  const coinSound = new Howl({
    src: ['/sounds/coin.mp3'], // Agregar archivo
    volume: 0.8
  });

  const buySound = new Howl({
    src: ['/sounds/ding.mp3'], // Agregar archivo
    volume: 0.7
  });

  const errorSound = new Howl({
    src: ['/sounds/error.mp3'], // Agregar archivo
    volume: 1.0
  });

  // Funciones para reproducir sonidos
  function playNewEmail() {
    newEmailSound.play();
  }

  function playDelete() {
    deleteSound.play();
  }

  function playStar() {
    starSound.play();
  }

  function playCoinSound() {
    coinSound.play();
  }

  function playBuySound() {
    buySound.play();
  }

  function playErrorSound() {
    errorSound.play();
  }

  // Función para cambiar volumen global
  function setVolume(volume) {
    Howler.volume(volume);
  }

  return {
    playNewEmail,
    playDelete,
    playStar,
    playCoinSound,
    playBuySound,
    playErrorSound,
    setVolume
  };
});