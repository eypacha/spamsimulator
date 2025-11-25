<template>
  <component :is="captchaComponent" @submit="onCaptchaSuccess" />
</template>

<script setup>
import { ref } from 'vue';
import StringCaptcha from './captchas/StringCaptcha.vue';
// Puedes agregar más tipos de captcha aquí si lo deseas
const captchaTypes = [StringCaptcha];
const captchaComponent = ref(captchaTypes[Math.floor(Math.random() * captchaTypes.length)]);

function onCaptchaSuccess() {
  // Aquí puedes emitir un evento o manejar el éxito del captcha
  // Por ahora solo cierra el popup (deberás integrar con tu sistema de popups)
}
</script>
