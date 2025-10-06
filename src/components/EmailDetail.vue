<template>
  <div class="max-w-xl mx-auto bg-white rounded-lg shadow p-6 mt-8">
    <div class="mb-4">
      <h2 class="text-2xl font-bold mb-2">{{ email.subject }}</h2>
      <div class="text-gray-500 text-sm mb-1">De: <span class="font-semibold">{{ email.fromName }}</span></div>
      <div v-if="email.fromEmail" class="text-gray-400 text-xs mb-1">&lt;{{ email.fromEmail }}&gt;</div>
      <div class="text-gray-500 text-sm mb-1">Para: <span class="font-semibold">{{ email.sender || 'tú' }}</span></div>
      <div class="text-gray-400 text-xs mb-2">Fecha: {{ formatDate(email.id) }}</div>
    </div>
    <div class="mb-6">
      <div class="text-base whitespace-pre-line" v-html="parsedBody" @click="handleLinkClick"></div>
    </div>
    <GoogleAd v-if="shouldShowAds" />
    <div class="flex gap-4 border-t pt-4">
      <button v-if="!email.trash" @click="onDelete" class="px-4 py-2 rounded bg-red-100 text-red-700 hover:bg-red-200"><i class="fas fa-trash"></i> Eliminar</button>
      <button v-else @click="onDeletePermanent" class="px-4 py-2 rounded bg-red-100 text-red-700 hover:bg-red-200"><i class="fas fa-times"></i> Eliminar para siempre</button>
      <button v-if="!email.trash" @click="onArchive" class="px-4 py-2 rounded bg-green-100 text-green-700 hover:bg-green-200"><i class="fas fa-archive"></i> Archivar</button>
      <button v-if="!email.trash && statsStore.starredUnlocked" @click="onStar" class="px-4 py-2 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200"><i :class="email.starred ? 'fas fa-star' : 'far fa-star'" ></i> {{ email.starred ? 'Destacado' : 'Destacar' }}</button>
    </div>
    
    <!-- Browser Popup -->
    <BrowserPopup 
      :show="showBrowser" 
      :url="clickedUrl" 
      @close="showBrowser = false"
    />
    
    <!-- Content Viewer for legitimate links -->
    <ContentViewer
      :show="showContent"
      :content-type="contentType"
      :content-data="contentData"
      :url="clickedUrl"
      @close="showContent = false"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref } from 'vue';
import '@fortawesome/fontawesome-free/css/all.css';
import { formatDate } from '@/utils/date';
import { shouldShowAds as checkShouldShowAds } from '@/utils/ads';
import GoogleAd from './GoogleAd.vue';
import BrowserPopup from './BrowserPopup.vue';
import ContentViewer from './ContentViewer.vue';
import { useStatsStore } from '../store/stats.js';

const statsStore = useStatsStore();
const props = defineProps({ email: Object });
const emit = defineEmits(['delete', 'star', 'deletePermanent', 'archive']);

const showBrowser = ref(false);
const clickedUrl = ref('');
const showContent = ref(false);
const contentType = ref('');
const contentData = ref('');

const shouldShowAds = computed(() => checkShouldShowAds(props.email));

function onDelete() {
  emit('delete', props.email.id);
}
function onDeletePermanent() {
  emit('deletePermanent', props.email.id);
}
function onArchive() {
  emit('archive', props.email.id);
}
function onStar() {
  emit('star', props.email.id);
}

function handleLinkClick(event) {
  const target = event.target;
  if (target.tagName === 'SPAN' && target.dataset.url) {
    event.preventDefault();
    const url = target.dataset.url;
    
    console.log('[DEBUG] Link clicked:', url);
    console.log('[DEBUG] Email isSpam:', props.email.isSpam);
    console.log('[DEBUG] Email content:', props.email.content);
    console.log('[DEBUG] Email url:', props.email.url);
    
    // Guardar la URL clicada
    clickedUrl.value = url;
    
    // Si el email es spam, abrir ventana de spam browser
    if (props.email.isSpam) {
      showBrowser.value = true;
    } else {
      // Si es legítimo, procesar el contenido según el campo content del email
      handleLegitimateContent();
    }
  }
}

function handleLegitimateContent() {
  // Usar el campo content del email para determinar qué mostrar
  const content = props.email.content;
  
  console.log('[DEBUG] handleLegitimateContent called');
  console.log('[DEBUG] content:', content);
  console.log('[DEBUG] props.email.url:', props.email.url);
  
  if (content === 'picture' && props.email.url) {
    // Mostrar imagen usando la URL especificada en el email
    contentType.value = 'image';
    contentData.value = `images/${props.email.url}`;
    showContent.value = true;
    
    // Si es una foto de gato (cats/XX.jpg), marcar como vista
    const catMatch = props.email.url.match(/cats\/(\d+)\.jpg/);
    if (catMatch) {
      const catNumber = parseInt(catMatch[1]);
      statsStore.markCatPictureViewed(catNumber);
      console.log('[DEBUG] Cat picture viewed:', catNumber);
    }
    
    console.log('[DEBUG] Modal should open now with:', contentData.value);
  } else {
    console.log('[DEBUG] Condition not met. content:', content, 'url:', props.email.url);
  }
  // Para cualquier otro tipo de contenido, simplemente no hacer nada
}

// Regex para URLs (simplificado)
const urlRegex = /(https?:\/\/[^\s]+)/g;
// Regex para markdown [texto](url)
const mdLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
// Regex para detectar links markdown [texto](url) con mayor robustez
const mdLinkRegexRobust = /\[([^\]]+)\]\((https?:\/\/[^\s)]+(?:\([^)]*\)[^)]*)*)\)/g;
// Regex para bold **texto** o __texto__
const boldRegex = /\*\*([^*]+)\*\*|__([^_]+)__/g;
// Regex para italic *texto* o _texto_
const italicRegex = /\*([^*]+)\*|_([^_]+)_/g;

const parsedBody = computed(() => {
  if (!props.email.body) return '';
  let body = props.email.body;
  // Links markdown: guardamos los URLs para no parsearlos dos veces
  const markdownLinks = [];
  // Usar regex robusto
  body = body.replace(mdLinkRegexRobust, (match, text, url) => {
    console.log('[DEBUG] Markdown link match:', { match, text, url });
    markdownLinks.push(url);
    return `<span data-url="${url}" style='color:#2563eb;text-decoration:underline;cursor:pointer'>${text}</span>`;
  });
  // URLs sueltas, pero ignoramos las que ya están en markdownLinks
  body = body.replace(urlRegex, url => {
    if (markdownLinks.includes(url)) return url; // ya parseado
    return `<span data-url="${url}" style='color:#2563eb;text-decoration:underline;cursor:pointer'>${url}</span>`;
  });
  // Bold
  body = body.replace(boldRegex, (match, g1, g2) => `<span style='font-weight:bold;'>${g1 || g2}</span>`);
  // Italic
  body = body.replace(italicRegex, (match, g1, g2) => `<span style='font-style:italic;'>${g1 || g2}</span>`);
  // Encabezados markdown ###, ## y #
  body = body.replace(/(^|<br>)###\s*(.*?)(?=<br>|$)/g, (match, br, text) => `${br}<span style='font-size:1.1em;font-weight:bold;color:#5e35b1;'>${text}</span>`);
  body = body.replace(/(^|<br>)##\s*(.*?)(?=<br>|$)/g, (match, br, text) => `${br}<span style='font-size:1.3em;font-weight:bold;color:#142c96;'>${text}</span>`);
  body = body.replace(/(^|<br>)#\s*(.*?)(?=<br>|$)/g, (match, br, text) => `${br}<span style='font-size:1.6em;font-weight:bold;color:#f9490d;'>${text}</span>`);
  // Listas con puntitos si la línea empieza con '-'
  body = body.replace(/(^|<br>)-\s*(.*?)(?=<br>|$)/g, (match, br, item) => `${br}<span style='display:inline-block;width:1em;text-align:center;'>•</span> ${item}`);
  // Saltos de línea
  body = body.replace(/\n/g, '<br>');
  console.log('[DEBUG] Email body original:', props.email.body);
  console.log('[DEBUG] Email body parsed:', body);
  return body;
});

</script>
