<template>
  <div class="flex flex-col align-items-center justify-center gap-4">
    <h2 class="text-center font-bold text-lg">BBA Verificación de seguridad</h2>
    <component :is="captchaComponent" @submit="closePopup" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
const emit = defineEmits(['close']);
const props = defineProps({ captchaComponent: Object });
const captchaComponent = props.captchaComponent;
console.log('[DEBUG] CaptchaBrowser captchaComponent:', captchaComponent);
function closePopup() {
  emit('close');
}
</script>
