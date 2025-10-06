<template>
  <li :class="[
    'flex items-center px-6 py-2 cursor-pointer transition-all duration-300',
    email.virusFlash ? 'bg-[#ffd9d9] animate-pulse' : (email.read ? 'bg-white hover:bg-gray-50' : 'bg-blue-50 font-bold hover:bg-blue-100')
  ]" @click="$emit('open')">
    <input
      v-if="showCheckbox"
      type="checkbox"
      :checked="modelValue.includes(email.id)"
      :value="email.id"
      @click.stop
      @change="onChange"
      class="mr-4 h-4 w-4 text-blue-600 rounded focus:ring-0" />
    <span v-if="statsStore.starredUnlocked" class="mr-2 cursor-pointer" @click.stop="toggleStar">
      <i :class="email.starred ? 'fas fa-star text-yellow-400' : 'far fa-star text-gray-400'" aria-label="Destacar"></i>
    </span>
    <span
      class="w-50 truncate whitespace-nowrap mr-3"
      :style="shouldShowSpamColor ? 'color: #e53935; font-weight: bold;' : 'color: #6b7280;'"
    >
      {{ email.fromName }}
    </span>
    <span class="flex-1 min-w-0 truncate whitespace-nowrap w-0">{{ email.subject }}</span>
    <span class="w-32 flex-shrink-0 text-right text-gray-400">{{ formatDate(email.id) }}</span>
  </li>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';
import '@fortawesome/fontawesome-free/css/all.css';
import { formatDate } from '@/utils/date';
import { useStatsStore } from '../store/stats.js';
import { useEmailStore } from '../store/email.js';

const statsStore = useStatsStore();
const emailStore = useEmailStore();

const props = defineProps({
  email: Object,
  modelValue: {
    type: Array,
    default: () => []
  },
  showCheckbox: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['update:modelValue', 'update:starred', 'open']);

// Solo mostrar el color rojo si el detector está desbloqueado Y es spam
const shouldShowSpamColor = computed(() => {
  return props.email.isSpam && statsStore.spamDetectorUnlocked;
});

function onChange(event) {
  const checked = event.target.checked;
  const value = props.email.id;
  let newValue = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
  
  if (checked) {
    // Si Group Select está desbloqueado, seleccionar todo el grupo
    if (statsStore.groupSelectUnlocked) {
      const groupEmails = getEmailGroup(value);
      groupEmails.forEach(id => {
        if (!newValue.includes(id)) newValue.push(id);
      });
    } else {
      // Comportamiento normal
      if (!newValue.includes(value)) newValue.push(value);
    }
  } else {
    // Al deseleccionar, siempre eliminar solo el email individual
    newValue = newValue.filter(id => id !== value);
  }
  
  emit('update:modelValue', newValue);
}

function getEmailGroup(emailId) {
  // Obtener todos los emails visibles
  const visibleEmails = emailStore.emails.filter(e => !e.trash).reverse();
  
  // Encontrar el índice del email actual
  const index = visibleEmails.findIndex(e => e.id === emailId);
  if (index === -1) return [emailId];
  
  const currentEmail = visibleEmails[index];
  const isSpam = currentEmail.isSpam;
  const group = [emailId];
  
  // Buscar hacia arriba (emails anteriores)
  for (let i = index - 1; i >= 0; i--) {
    if (visibleEmails[i].isSpam === isSpam) {
      group.unshift(visibleEmails[i].id);
    } else {
      break;
    }
  }
  
  // Buscar hacia abajo (emails siguientes)
  for (let i = index + 1; i < visibleEmails.length; i++) {
    if (visibleEmails[i].isSpam === isSpam) {
      group.push(visibleEmails[i].id);
    } else {
      break;
    }
  }
  
  return group;
}


function toggleStar() {
  props.email.starred = !props.email.starred;
}
</script>
