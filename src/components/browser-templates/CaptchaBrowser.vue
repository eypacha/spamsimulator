<template>
  <CaptchaPopup @close="closePopup" />
</template>

<script setup>
import CaptchaPopup from '../CaptchaPopup.vue';
import { defineEmits } from 'vue';
const emit = defineEmits(['close']);
function closePopup() {
  emit('close');
}
</script>
