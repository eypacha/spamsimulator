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

  const deleteSound = new Howl({
    src: ['/sounds/delete.mp3'], // Agregar archivo
    volume: 0.6
  });

  const starSound = new Howl({
    src: ['/sounds/star.mp3'], // Agregar archivo
    volume: 0.7
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

  // Función para cambiar volumen global
  function setVolume(volume) {
    Howler.volume(volume);
  }

  return {
    playNewEmail,
    playDelete,
    playStar,
    setVolume
  };
});