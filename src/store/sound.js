import { defineStore } from 'pinia';
import { Howl, Howler } from 'howler';

export const useSoundStore = defineStore('sound', () => {
  // Configurar Howler global
  Howler.volume(0.9);

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
  
  function playVirusSound() {
    console.log('Playing virus sound...');
    virusSound.play();
  }

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
    setVolume,
    playTrashSound,
    playSendSound,
    playVirusSound
  };
});