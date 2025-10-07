<template>
  <div v-if="show" class="fixed inset-0 z-50 p-4" style="background: rgba(0,0,0,0.5);" @click="emit('close')">
    <!-- Ventana del visor de cita -->
    <div 
      class="bg-white shadow-2xl w-full max-w-2xl flex flex-col animate-popup border-2 border-gray-400 absolute"
      :style="{ top: '15%', left: '50%', transform: 'translateX(-50%)' }"
      @click.stop
    >
      <!-- Barra superior del navegador -->
      <div class="bg-gray-200 px-3 py-2 flex items-center gap-2 border-b border-gray-300">
        <!-- Barra de navegación -->
        <div class="flex-1 flex items-center gap-2">
          <button class="text-gray-600 hover:text-gray-800 px-2">⟳</button>
          
          <!-- Barra de URL -->
          <div class="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-700 border border-gray-300 flex items-center gap-2">
            <span class="text-green-600">🔒</span>
            <span class="truncate">{{ displayUrl }}</span>
          </div>
        </div>
        
        <!-- Botón de cerrar -->
        <button 
          @click="emit('close')" 
          class="text-gray-600 hover:text-gray-900 text-xl font-bold px-2 cursor-pointer"
          title="Cerrar"
        >
          ×
        </button>
      </div>
      
      <!-- Contenido del visor -->
      <div class="flex-1 overflow-auto bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div class="bg-white rounded-lg shadow-xl p-5 max-w-lg mx-auto">
          <div class="text-center mb-4">
            <div class="text-4xl mb-2">📅</div>
            <h2 class="text-xl font-bold text-gray-800 mb-1">Confirmación de Cita</h2>
            <p class="text-sm text-gray-600">{{ companyName }}</p>
          </div>
          
          <div class="space-y-2 mb-4">
            <div class="bg-gray-50 p-3 rounded-lg">
              <div class="flex items-center gap-2">
                <span class="text-xl">📋</span>
                <div>
                  <p class="text-xs text-gray-500">Título de el evento</p>
                  <p class="text-base font-semibold text-gray-800">{{ appointmentTitle }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 p-3 rounded-lg">
              <div class="flex items-center gap-2">
                <span class="text-xl">📆</span>
                <div>
                  <p class="text-xs text-gray-500">Fecha</p>
                  <p class="text-base font-semibold text-gray-800">{{ appointmentDate }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 p-3 rounded-lg">
              <div class="flex items-center gap-2">
                <span class="text-xl">⏰</span>
                <div>
                  <p class="text-xs text-gray-500">Hora</p>
                  <p class="text-base font-semibold text-gray-800">{{ appointmentTime }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex gap-2">
            <button 
              @click="confirmAppointment"
              class="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <span>✓</span>
              <span>Confirmar</span>
            </button>
            <button 
              @click="emit('close')"
              class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Cerrar
            </button>
          </div>
          
          <p v-if="confirmed" class="mt-3 text-center text-green-600 font-semibold text-sm">
            ✓ Confirmación registrada
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  show: Boolean,
  url: {
    type: String,
    default: ''
  },
  companyName: {
    type: String,
    default: 'Empresa'
  }
});

const emit = defineEmits(['close']);
const confirmed = ref(false);

// Parsear la URL para extraer parámetros
const urlParams = computed(() => {
  if (!props.url) return {};
  
  try {
    const url = new URL(props.url);
    return {
      day: url.searchParams.get('day'),
      time: url.searchParams.get('time'),
      title: url.searchParams.get('title') || url.searchParams.get('meeting')
    };
  } catch (e) {
    return {};
  }
});

// URL simplificada para mostrar
const displayUrl = computed(() => {
  if (!props.url) return 'Confirmación de reunión';
  try {
    const url = new URL(props.url);
    return url.hostname + url.pathname;
  } catch (e) {
    return props.url;
  }
});

// Título de la cita
const appointmentTitle = computed(() => {
  return decodeURIComponent(urlParams.value.title || 'Reunión').replace(/\+/g, ' ');
});

// Calcular fecha basada en los días desde hoy
const appointmentDate = computed(() => {
  const daysFromNow = parseInt(urlParams.value.day) || 0;
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('es-ES', options);
});

// Hora de la cita
const appointmentTime = computed(() => {
  return urlParams.value.time || 'Por confirmar';
});

function confirmAppointment() {
  confirmed.value = true;
  setTimeout(() => {
    emit('close');
  }, 1500);
}
</script>

<style scoped>
@keyframes popup {
  from {
    opacity: 0;
    transform: translateX(-50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
}

.animate-popup {
  animation: popup 0.3s ease-out;
}
</style>
