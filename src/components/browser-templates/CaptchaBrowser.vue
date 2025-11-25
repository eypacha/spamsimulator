<template>
  <div class="flex flex-col align-items-center justify-center gap-4">
    <h2 class="text-center font-bold text-lg">BNA Verificación de seguridad</h2>
    <component v-if="captchaComponent" :is="captchaComponent" @submit="onCaptchaSuccess" />
    <div v-if="captchaSuccess" class="text-center">
      <h3 class="text-green-600 font-semibold ">¡Captcha completado con éxito!</h3>
      <p>No eres un robot. Su trámite bancario ha sido verificado correctamente.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, markRaw, onMounted } from 'vue';
import PuzzleCaptcha from '../captchas/PuzzleCaptcha.vue';
import StringCaptcha from '../captchas/StringCaptcha.vue';
import GridCaptcha from '../captchas/GridCaptcha.vue';

const captchaComponents = [PuzzleCaptcha, StringCaptcha, GridCaptcha];
const captchaComponent = ref(null);
const captchaSuccess = ref(false);

function pickRandomCaptcha() {
  captchaComponent.value = markRaw(captchaComponents[Math.floor(Math.random() * captchaComponents.length)]);
}

function onCaptchaSuccess() {
  captchaComponent.value = null;
  captchaSuccess.value = true;
  console.log('Captcha completado con éxito');
}

onMounted(() => {
  pickRandomCaptcha();
});
</script>
