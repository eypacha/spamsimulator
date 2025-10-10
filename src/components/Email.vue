<template>
  <li :class="[
    'flex items-center px-6 py-4 md:py-2 cursor-pointer',
    email.virusFlash ? 'bg-[#ffd9d9] animate-pulse' : (email.read ? 'bg-white hover:bg-gray-50' : 'bg-blue-50 font-bold hover:bg-blue-100'),
    swipeActive && swipeDirection === 'left' ? 'border-r-8 border-red-500' : '',
    swipeActive && swipeDirection === 'right' ? 'border-l-8 border-green-500' : ''
  ]" :style="swipeStyle" @click="$emit('open')" v-if="isTouchDevice" @touchstart.passive="onTouchStart" @touchmove.passive="onTouchMove"
    @touchend="onTouchEnd">
    <input v-if="showCheckbox" type="checkbox" :checked="modelValue.includes(email.id)" :value="email.id" @click.stop
      @change="onChange" class="mr-4 h-4 w-4 text-blue-600 rounded focus:ring-0" />
    <span v-if="statsStore.starredUnlocked" class="mr-2 cursor-pointer" @click.stop="toggleStar">
      <i :class="email.starred ? 'fas fa-star text-yellow-400' : 'far fa-star text-gray-400'" aria-label="Destacar"></i>
    </span>
    <span class="w-50 truncate whitespace-nowrap mr-3"
      :style="shouldShowSpamColor ? 'color: #e53935; font-weight: bold;' : 'color: #6b7280;'">
      {{ email.fromName }}
    </span>
    <span class="flex-1 min-w-0 truncate whitespace-nowrap w-0">{{ email.subject }}</span>
    <span class="w-32 flex-shrink-0 text-right text-gray-400">{{ formatDate(email.id) }}</span>
  </li>
  <li :class="[
    'flex items-center px-6 py-4 md:py-2 cursor-pointer',
    email.virusFlash ? 'bg-[#ffd9d9] animate-pulse' : (email.read ? 'bg-white hover:bg-gray-50' : 'bg-blue-50 font-bold hover:bg-blue-100')
  ]" @click="$emit('open')" v-else>
    <input v-if="showCheckbox" type="checkbox" :checked="modelValue.includes(email.id)" :value="email.id" @click.stop
      @change="onChange" class="mr-4 h-4 w-4 text-blue-600 rounded focus:ring-0" />
    <span v-if="statsStore.starredUnlocked" class="mr-2 cursor-pointer" @click.stop="toggleStar">
      <i :class="email.starred ? 'fas fa-star text-yellow-400' : 'far fa-star text-gray-400'" aria-label="Destacar"></i>
    </span>
    <span class="w-50 truncate whitespace-nowrap mr-3"
      :style="shouldShowSpamColor ? 'color: #e53935; font-weight: bold;' : 'color: #6b7280;'">
      {{ email.fromName }}
    </span>
    <span class="flex-1 min-w-0 truncate whitespace-nowrap w-0">{{ email.subject }}</span>
    <span class="w-32 flex-shrink-0 text-right text-gray-400">{{ formatDate(email.id) }}</span>
  </li>
  <div v-if="showTrashFull" class="fixed inset-0 flex items-center justify-center z-50"
    style="background: rgba(0,0,0,0.4);">
    <div class="bg-white rounded-lg shadow-lg p-8 text-center">
      <div class="mb-4 text-lg">No puedes eliminar este correo, papelera llena</div>
      <div class="flex gap-4 justify-center">
        <button @click="showTrashFull = false"
          class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Aceptar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref } from 'vue';
import { storeToRefs } from 'pinia';

// Swipe state y animación elástica
const swipeStartX = ref(null);
const swipeActive = ref(false);
const swipeDirection = ref(null);
const swipeDeltaX = ref(0);
const swipeAnimatingBack = ref(false);

const swipeStyle = computed(() => {
  let style = '';
  if (swipeActive.value || swipeAnimatingBack.value) {
    style += `transform: translateX(${swipeDeltaX.value}px);`;
    style += 'transition: none;';
  } else {
    style += 'transform: translateX(0);';
    style += 'transition: transform 0.3s;';
  }
  return style;
});

// Detectar si es dispositivo táctil
const isTouchDevice = ref('ontouchstart' in window || navigator.maxTouchPoints > 0);

function onTouchStart(e) {
  if (!mobileFriendlyUnlocked.value) return;
  swipeStartX.value = e.touches[0].clientX;
  swipeActive.value = true;
  swipeDirection.value = null;
  swipeDeltaX.value = 0;
  swipeAnimatingBack.value = false;
}

function onTouchMove(e) {
  if (!mobileFriendlyUnlocked.value || swipeStartX.value === null) return;
  const deltaX = e.touches[0].clientX - swipeStartX.value;
  swipeDeltaX.value = deltaX;
  if (Math.abs(deltaX) > 20) {
    // Prevenir scroll del body solo cuando se detecta un swipe
    e.preventDefault();
    swipeDirection.value = deltaX < 0 ? 'left' : 'right';
  } else {
    swipeDirection.value = null;
  }
}

function onTouchEnd(e) {
  if (!mobileFriendlyUnlocked.value || swipeStartX.value === null) {
    swipeActive.value = false;
    swipeDirection.value = null;
    swipeDeltaX.value = 0;
    return;
  }
  const endX = e.changedTouches[0].clientX;
  const deltaX = endX - swipeStartX.value;
  const threshold = 60;
  if (Math.abs(deltaX) > threshold) {
    if (deltaX < 0) {
      // Verificar si la papelera está llena
      if (trashCount.value >= maxTrash.value) {
        showTrashFull.value = true;
      } else {
        emailStore.moveToTrash(props.email.id);
      }
    } else {
      if (!props.email.trash) {
        emailStore.archiveEmail(props.email.id);
      }
    }
    // Animar fuera de pantalla
    swipeDeltaX.value = deltaX < 0 ? -300 : 300;
    setTimeout(() => {
      swipeActive.value = false;
      swipeDirection.value = null;
      swipeDeltaX.value = 0;
    }, 200);
  } else {
    // Animar regreso a posición original
    swipeAnimatingBack.value = true;
    swipeDeltaX.value = 0;
    setTimeout(() => {
      swipeActive.value = false;
      swipeDirection.value = null;
      swipeAnimatingBack.value = false;
    }, 300);
  }
  swipeStartX.value = null;
}
import '@fortawesome/fontawesome-free/css/all.css';
import { formatDate } from '@/utils/date';
import { useStatsStore } from '../store/stats.js';
import { useEmailStore } from '../store/email.js';

const statsStore = useStatsStore();
const emailStore = useEmailStore();
const { maxTrash } = storeToRefs(statsStore);
const trashCount = computed(() => emailStore.emails.filter(e => e.trash).length);
const showTrashFull = ref(false);

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
const emit = defineEmits(['update:modelValue', 'update:starred', 'open', 'toggle-star']);

// Solo mostrar el color rojo si el detector está activo Y es spam
const shouldShowSpamColor = computed(() => {
  return props.email.isSpam && statsStore.spamDetectorActive;
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
  const visibleEmails = emailStore.emails.filter(e => !e.trash).slice().reverse();

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
  emit('toggle-star', props.email.id);
}
</script>
