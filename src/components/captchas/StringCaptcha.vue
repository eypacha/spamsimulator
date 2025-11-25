<template>
  <div class="flex flex-col items-center gap-4 w-80 h-70">
    <div class="mb-2 text-gray-700 text-sm text-center">Completa el captcha para continuar</div>
    <canvas ref="captchaCanvas" width="200" height="60" class="border rounded" />
    <input v-model="inputValue" type="text" placeholder="Escribe el texto del captcha" class="border px-3 py-2 rounded w-full" />
    <div class="flex gap-2 w-full">
      <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex-1" @click="submit">Validar</button>
      <button class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 flex-1" @click="resetCaptcha">Regenerar</button>
    </div>
    <div v-if="error" class="text-red-600 mt-2 text-sm">Captcha incorrecto, intenta de nuevo.</div>
  </div>
</template>

<script setup>
import { ref, defineEmits, onMounted } from 'vue';
const emit = defineEmits(['submit']);
const captchaCanvas = ref(null);
const captchaText = ref('');
const inputValue = ref('');
const error = ref(false);

function randomString(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let str = '';
  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str;
}

function drawCaptcha() {
  const canvas = captchaCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#f3f3f3';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 8; i++) {
    ctx.strokeStyle = `rgba(44,62,80,${Math.random() * 0.5 + 0.2})`;
    ctx.beginPath();
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.stroke();
  }
  const text = captchaText.value;
  for (let i = 0; i < text.length; i++) {
    const fontSize = Math.floor(Math.random() * 12) + 28;
    const angle = (Math.random() - 0.5) * 0.6;
    ctx.save();
    ctx.font = `${fontSize}px Arial`;
    ctx.translate(30 + i * 28, 35 + Math.random() * 10);
    ctx.rotate(angle);
    ctx.fillStyle = `hsl(${Math.random() * 360},70%,40%)`;
    ctx.shadowColor = '#888';
    ctx.shadowBlur = 2;
    ctx.fillText(text[i], 0, 0);
    ctx.restore();
  }
  for (let i = 0; i < 60; i++) {
    ctx.fillStyle = `rgba(44,62,80,${Math.random() * 0.3})`;
    ctx.beginPath();
    ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2 + 1, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function resetCaptcha() {
  captchaText.value = randomString();
  inputValue.value = '';
  error.value = false;
  drawCaptcha();
}

onMounted(() => {
  resetCaptcha();
});

function submit() {
  if (inputValue.value.trim() === captchaText.value.trim()) {
    emit('submit');
    error.value = false;
  } else {
    error.value = true;
    resetCaptcha();
  }
}
</script>
