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
  window.alert('Captcha completado con éxito.');
}
</script>
