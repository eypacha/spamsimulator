<template>
  <li :class="[
    'flex items-center px-6 py-2 cursor-pointer transition',
    email.read ? 'bg-white hover:bg-gray-50' : 'bg-blue-50 font-bold hover:bg-blue-100'
  ]">
    <input type="checkbox" :checked="modelValue.includes(email.id)" :value="email.id" @change="onChange" class="mr-4 h-4 w-4 text-blue-600 rounded focus:ring-0" />
    <span class="mr-2 cursor-pointer" @click="toggleStar">
      <i :class="email.starred ? 'fas fa-star text-yellow-400' : 'far fa-star text-gray-400'" aria-label="Destacar"></i>
    </span>
    <span class="w-50 text-gray-500">{{ email.from }}</span>
    <span class="flex-1 truncate whitespace-nowrap" style="max-width: 320px;">{{ email.subject }}</span>
    <span class="w-32 text-right text-gray-400">{{ email.date }}</span>
  </li>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
const props = defineProps({
  email: Object,
  modelValue: {
    type: Array,
    default: () => []
  }
});
const emit = defineEmits(['update:modelValue', 'update:starred']);

function onChange(event) {
  const checked = event.target.checked;
  const value = props.email.id;
  let newValue = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
  if (checked) {
    if (!newValue.includes(value)) newValue.push(value);
  } else {
    newValue = newValue.filter(id => id !== value);
  }
  emit('update:modelValue', newValue);
}

function toggleStar() {
  props.email.starred = !props.email.starred;
}
// Font Awesome import for icons
import '@fortawesome/fontawesome-free/css/all.css';
</script>
