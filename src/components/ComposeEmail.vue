<template>
  <div class="compose-modal">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-auto">
      <div class="flex items-center justify-between mb-4">
        <span class="text-lg font-semibold text-gray-700">Redactar correo</span>
        <button @click="$emit('close')" class="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">✕</button>
      </div>
      <form @submit.prevent="sendEmail">
        <div class="mb-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">Para</label>
          <input v-model="to" type="email" required class="w-full border rounded px-3 py-2" placeholder="destinatario@email.com" />
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
          <input v-model="subject" type="text" required class="w-full border rounded px-3 py-2" placeholder="Asunto del correo" />
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
          <textarea v-model="body" required class="w-full border rounded px-3 py-2 min-h-[120px]" placeholder="Escribe tu mensaje..."></textarea>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Enviar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const to = ref('');
const subject = ref('');
const body = ref('');

function sendEmail() {
  // Aquí se puede emitir el evento o llamar a la lógica de envío
  // Por ahora solo emitimos los datos
  // Se puede mejorar para integrarse con la store
  
  // Emitir evento con los datos del correo
  // El padre debe escuchar 'send' y cerrar el modal
  // Ejemplo: <ComposeEmail @send="onSendEmail" @close="showCompose = false" />
  
  // Limpiar campos
  const emailData = { to: to.value, subject: subject.value, body: body.value };
  to.value = '';
  subject.value = '';
  body.value = '';
  
  // Emitir evento
  emit('send', emailData);
  emit('close');
}

const emit = defineEmits(['send', 'close']);
</script>

<style scoped>
.compose-modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.25);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
