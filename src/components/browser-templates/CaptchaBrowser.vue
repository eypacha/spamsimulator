<template>
  <div class="flex flex-col align-items-center justify-center gap-4">
    <h2 class="text-center font-bold text-lg">BBA Verificación de seguridad</h2>
    <component v-if="captchaComponent" :is="captchaComponent" @submit="onCaptchaSuccess" />
  </div>
</template>

<script setup>
import { ref, markRaw, onMounted } from 'vue';
import PuzzleCaptcha from '../captchas/PuzzleCaptcha.vue';
import StringCaptcha from '../captchas/StringCaptcha.vue';

const captchaComponents = [PuzzleCaptcha, StringCaptcha];
const captchaComponent = ref(null);

function pickRandomCaptcha() {
  captchaComponent.value = markRaw(captchaComponents[Math.floor(Math.random() * captchaComponents.length)]);
}

function onCaptchaSuccess() {
  // Aquí podrías emitir un evento para cerrar el popup si lo deseas
  console.log('Captcha completado con éxito');
}

onMounted(() => {
  pickRandomCaptcha();
});
</script>
