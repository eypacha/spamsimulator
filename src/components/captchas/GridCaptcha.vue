<template>
  <Popup>
    <div class="flex flex-col items-center gap-4 w-80 h-85">
      <div class="mb-2 text-gray-700 text-sm text-center">
        <span v-if="captchaType === 'dog'">Selecciona todos los perros y presiona "Verificar".</span>
        <span v-else>Selecciona todos los muffins y presiona "Verificar".</span>
      </div>
      <div class="grid grid-cols-4 grid-rows-4 gap-1">
        <div
          v-for="(selected, idx) in grid"
          :key="idx"
          @click="toggleCell(idx)"
          :class="[
            'w-12 h-12 border rounded cursor-pointer flex items-center justify-center overflow-hidden',
            selected ? 'bg-blue-500 border-blue-700 border-3' : 'bg-gray-200 border-gray-400',
            (props.verified || props.disabled) ? 'pointer-events-none opacity-60' : ''
          ]"
        >
          <img
            :src="shuffledImages[idx]"
            alt="Captcha Image"
            class="w-full h-full object-cover rounded"
          />
        </div>
      </div>
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        @click="verify"
        :disabled="props.verified || props.disabled"
      >
        Verificar
      </button>
      <div v-if="props.verified" class="text-green-600 mt-2 text-sm">¡Verificado!</div>
      <div v-if="error" class="text-red-600 mt-2 text-sm">
        Selección incorrecta, por favor intenta de nuevo.
      </div>
    </div>
  </Popup>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const emit = defineEmits(['submit']);
const props = defineProps({
  verified: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const captchaType = ref(Math.random() < 0.5 ? 'dog' : 'muffin');
const grid = ref(Array(16).fill(false));
const error = ref(false);

const imagePaths = [
  ...Array(8).fill().map((_, i) => 'images/imageCaptcha/dog-' + i + '.jpg'),
  ...Array(8).fill().map((_, i) => 'images/imageCaptcha/muffing-' + i + '.jpg')
];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const shuffledImages = ref([]);

onMounted(() => {
  shuffledImages.value = shuffle([...imagePaths]);
});

function toggleCell(idx) {
  if (props.verified || props.disabled) return;
  grid.value[idx] = !grid.value[idx];
}

function verify() {
  if (props.verified || props.disabled) return;
  error.value = false;
  let allTargetSelected = true;
  let anyOtherSelected = false;
  for (let i = 0; i < shuffledImages.value.length; i++) {
    const isDog = shuffledImages.value[i].includes('dog-');
    const isMuffin = shuffledImages.value[i].includes('muffing-');
    if (captchaType.value === 'dog') {
      if (isDog && !grid.value[i]) {
        allTargetSelected = false;
      }
      if (isMuffin && grid.value[i]) {
        anyOtherSelected = true;
      }
    } else {
      if (isMuffin && !grid.value[i]) {
        allTargetSelected = false;
      }
      if (isDog && grid.value[i]) {
        anyOtherSelected = true;
      }
    }
  }
  if (allTargetSelected && !anyOtherSelected) {
    emit('submit');
  } else {
    error.value = true;
  }
}
</script>
