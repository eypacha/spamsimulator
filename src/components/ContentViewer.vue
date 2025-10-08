<template>
  <div v-if="show" class="fixed inset-0 z-50" style="background: rgba(0,0,0,0.5);" @click="emit('close')">
    <!-- Ventana del visor de contenido -->
    <div 
      class="bg-white shadow-2xl w-full max-w-3xl aspect-[4/3] flex flex-col animate-popup border-2 border-gray-400 absolute"
      :style="{ top: '10%', left: '50%', transform: 'translateX(-50%)' }"
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
            <span class="truncate">{{ url || 'Contenido legítimo' }}</span>
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
      <div class="flex-1 overflow-auto bg-white p-3 flex items-center justify-center">
        <!-- Imagen -->
        <img v-if="contentType === 'image'" :src="contentData" alt="Contenido" class="w-full max-h-full object-cover rounded shadow-lg" />
        
        <!-- Iframe (videos, etc) -->
        <iframe 
          v-else-if="contentType === 'iframe'" 
          :src="getEmbedUrl(contentData)" 
          class="w-full h-full rounded shadow-lg" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen
        ></iframe>
        
        <!-- Texto u otros contenidos -->
        <div v-else class="text-gray-700 text-lg">
          {{ contentData }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  show: Boolean,
  contentType: {
    type: String,
    default: 'text'
  },
  contentData: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close']);

// Función para convertir URLs de YouTube a formato embed
function getEmbedUrl(url) {
  if (!url) return '';
  
  // Si ya es una URL embed, devolverla tal cual
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  
  // Extraer el video ID de diferentes formatos de YouTube
  let videoId = '';
  
  // Formato: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) {
    videoId = watchMatch[1];
  }
  
  // Formato: https://youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) {
    videoId = shortMatch[1];
  }
  
  // Si encontramos el video ID, devolver URL embed
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // Para otros tipos de iframes, devolver la URL tal cual
  return url;
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
