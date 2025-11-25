<template>
  <div class="flex flex-col align-items-center justify-center gap-4">
    <h2 class="text-center font-bold text-lg">BNA Verificación de seguridad</h2>
    <component
      v-if="captchaComponent"
      :is="captchaComponent"
      @submit="onCaptchaSuccess"
      :verified="isVerified"
      :disabled="isVerified"
    />
    <div v-if="captchaSuccess" class="text-center">
      <h3 class="text-green-600 font-semibold ">¡Captcha completado con éxito!</h3>
      <p>No eres un robot. Su trámite bancario ha sido verificado correctamente.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, markRaw, onMounted, computed } from 'vue';
import PuzzleCaptcha from '../captchas/PuzzleCaptcha.vue';
import StringCaptcha from '../captchas/StringCaptcha.vue';
import GridCaptcha from '../captchas/GridCaptcha.vue';
import { useCaptchaStore } from '../../store/captcha.js';
import { useStatsStore } from '../../store/stats.js';

const captchaComponents = [PuzzleCaptcha, StringCaptcha, GridCaptcha];
const captchaComponent = ref(null);
const captchaSuccess = ref(false);

// Supongamos que recibimos un id único por props (por ejemplo, el id del email)
const props = defineProps({
  captchaId: {
    type: [String, Number],
    required: true
  },
  email: {
    type: Object,
    required: false
  }
});

const captchaStore = useCaptchaStore();
const statsStore = useStatsStore();
const isVerified = computed(() => captchaStore.isVerified(props.captchaId));

function pickRandomCaptcha() {
  captchaComponent.value = markRaw(captchaComponents[Math.floor(Math.random() * captchaComponents.length)]);
}

function onCaptchaSuccess() {
  if (!captchaStore.isVerified(props.captchaId)) {
    captchaStore.markVerified(props.captchaId);
    statsStore.addScore(statsStore.pointsPerSpam * 5);
  }
  captchaComponent.value = null;
  captchaSuccess.value = true;
  console.log('Captcha completado con éxito');
}

onMounted(() => {
  if (isVerified.value) {
    captchaComponent.value = null;
    captchaSuccess.value = true;
  } else {
    pickRandomCaptcha();
  }
});
</script>
