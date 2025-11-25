<template>
  <component
    :is="captchaComponent"
    @submit="onCaptchaSuccess"
    :verified="isVerified"
    :disabled="isVerified"
  />
</template>

<script setup>
import { ref, markRaw, computed } from 'vue';
import { CAPTCHA_COMPONENTS } from './captchas/index.js';
import { useCaptchaStore } from '../store/captcha.js';

const props = defineProps({
  captchaId: {
    type: [String, Number],
    required: true
  }
});

const captchaComponent = ref(markRaw(CAPTCHA_COMPONENTS[Math.floor(Math.random() * CAPTCHA_COMPONENTS.length)]));
const captchaStore = useCaptchaStore();
const isVerified = computed(() => captchaStore.isVerified(props.captchaId));

function onCaptchaSuccess() {
  captchaStore.markVerified(props.captchaId);
  window.alert('Captcha completado con éxito.');
}
</script>
