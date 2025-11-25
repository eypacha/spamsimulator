<template>
  <component :is="captchaComponent" @submit="onCaptchaSuccess" />
</template>

<script setup>

import { ref, markRaw } from 'vue';
import { CAPTCHA_COMPONENTS } from './captchas/index.js';
const captchaComponent = ref(markRaw(CAPTCHA_COMPONENTS[Math.floor(Math.random() * CAPTCHA_COMPONENTS.length)]));

function onCaptchaSuccess() {
  window.alert('Captcha completado con éxito.');
}
</script>
