<template>
  <div class="flex flex-col align-items-center justify-center gap-4">
    <h2 class="text-center font-bold text-lg">BBA Verificación de seguridad</h2>
    <CaptchaPopup @close="closePopup" />
  </div>
</template>

<script setup>
import CaptchaPopup from '../CaptchaPopup.vue';
import { defineEmits } from 'vue';
const emit = defineEmits(['close']);
function closePopup() {
  emit('close');
}
</script>
