<template>
  <section class="h-full flex flex-col">
    <div class="flex items-center justify-between px-6 py-4 bg-gray-50 border-b">
      <span class="text-lg font-semibold text-gray-700">Tienda</span>
    </div>
    <div class="flex-1 overflow-y-auto p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div v-for="card in cards" :key="card.title" class="bg-white p-4 shadow flex flex-col h-full gap-5"
          :class="card.rounded ? 'rounded-lg' : ''">
          <div>
            <h3 class="text-lg font-semibold">{{ card.title }}</h3>
            <p class="text-gray-600">{{ card.description }}</p>
            <template v-for="(line, idx) in card.details" :key="idx">
              <p class="text-sm">{{ line }}</p>
            </template>
          </div>
          <button @click="card.onClick" :disabled="card.disabled"
            class="mt-2 px-4 py-2 bg-green-500 cursor-pointer text-white rounded hover:bg-green-600 disabled:bg-gray-400 mt-auto">
            Comprar
          </button>
        </div>
      </div>
    </div>
    <VirusManager screen="store" />
  </section>
</template>

<script setup>
import { useStatsStore } from '../store/stats.js';
import { computed } from 'vue';
import VirusManager from './VirusManager.vue';

const statsStore = useStatsStore();

const cards = computed(() => [
  {
    title: 'Dinero, dame dinero',
    description: '💰 Aumenta los puntos lo que ganas por eliminar spam.',
    details: [
      `Actual: ${statsStore.pointsPerSpam} puntos`,
      `Costo: ${statsStore.upgradeCost} 🪙`,
    ],
    onClick: () => statsStore.buyUpgrade(),
    disabled: statsStore.score < statsStore.upgradeCost,
  },
  {
    title: 'Basura espacial',
    description: '🗑️ Aumenta el límite de emails en la papelera.',
    details: [
      `Actual: ${statsStore.getSpaceString(statsStore.maxTrash, 3)}`,
      `Costo: ${statsStore.trashUpgradeCost} 🪙`,
    ],
    onClick: () => statsStore.buyTrashUpgrade(),
    disabled: statsStore.score < statsStore.trashUpgradeCost,
  },
  {
    title: 'Come disco',
    description: '📥 Aumenta el límite de emails en la bandeja de entrada.',
    details: [
      `Actual: ${statsStore.getSpaceString(statsStore.maxInbox)}`,
      `Costo: ${statsStore.inboxUpgradeCost} 🪙`,
    ],
    onClick: () => statsStore.buyInboxUpgrade(),
    disabled: statsStore.score < statsStore.inboxUpgradeCost,
  },
  {
    title: 'Selección múltiple',
    description: '☑️ Aumenta el número de emails que puedes seleccionar a la vez.',
    details: [
      `Actual: ${statsStore.maxSelectable} emails`,
      `Costo: ${statsStore.selectionUpgradeCost} 🪙`,
    ],
    onClick: () => statsStore.buySelectionUpgrade(),
    disabled: statsStore.score < statsStore.selectionUpgradeCost,
    rounded: true,
  },
  {
    title: 'Detector de Spam',
    description: '🔴 Marca visualmente los emails de spam en color rojo.',
    details: [
      statsStore.spamDetectorUnlocked ? '¡Desbloqueado!' : `Costo: ${statsStore.spamDetectorUpgradeCost} 🪙`,
      statsStore.spamDetectorUnlocked ? 'Los spam ahora se ven en rojo' : 'Todos los emails se ven iguales'
    ],
    onClick: () => statsStore.buySpamDetectorUpgrade(),
    disabled: statsStore.score < statsStore.spamDetectorUpgradeCost || statsStore.spamDetectorUnlocked,
    rounded: true,
  },
  {
    title: 'Redactar',
    description: '✍️ Desbloquea la capacidad de redactar y enviar emails.',
    details: [
      statsStore.composeUnlocked ? '¡Desbloqueado!' : `Costo: ${statsStore.composeUpgradeCost} 🪙`,
      statsStore.composeUnlocked ? 'Puedes enviar emails' : 'No puedes enviar emails'
    ],
    onClick: () => statsStore.buyComposeUpgrade(),
    disabled: statsStore.score < statsStore.composeUpgradeCost || statsStore.composeUnlocked,
    rounded: true,
  },
  {
    title: 'Destacar',
    description: '⭐ Desbloquea la capacidad de marcar emails como destacados.',
    details: [
      statsStore.starredUnlocked ? '¡Desbloqueado!' : `Costo: ${statsStore.starredUpgradeCost} 🪙`,
      statsStore.starredUnlocked ? 'Puedes destacar emails' : 'No puedes destacar emails'
    ],
    onClick: () => statsStore.buyStarredUpgrade(),
    disabled: statsStore.score < statsStore.starredUpgradeCost || statsStore.starredUnlocked,
    rounded: true,
  },
  {
    title: 'Barra de espacio',
    description: '📊 Desbloquea la barra de progreso de espacio en la bandeja de entrada.',
    details: [
      statsStore.spaceBarUnlocked ? '¡Desbloqueado!' : `Costo: ${statsStore.spaceBarUpgradeCost} 🪙`,
    ],
    onClick: () => statsStore.buySpaceBarUpgrade(),
    disabled: statsStore.score < statsStore.spaceBarUpgradeCost || statsStore.spaceBarUnlocked,
    rounded: true,
  },
  {
    title: 'Barra de papelera',
    description: '📊 Desbloquea la barra de progreso de espacio en la papelera.',
    details: [
      statsStore.trashBarUnlocked ? '¡Desbloqueado!' : `Costo: ${statsStore.trashBarUpgradeCost} 🪙`,
    ],
    onClick: () => statsStore.buyTrashBarUpgrade(),
    disabled: statsStore.score < statsStore.trashBarUpgradeCost || statsStore.trashBarUnlocked,
    rounded: true,
  },
  {
    title: 'TurboSpam',
    description: '⚡ Reduce el intervalo de llegada de emails un 10% (mínimo 0.5s).',
    details: [
      `Actual: ${(statsStore.turboSpamInterval / 1000).toFixed(2)} s`,
      `Costo: ${statsStore.turboSpamUpgradeCost} 🪙`,
    ],
    onClick: () => statsStore.buyTurboSpamUpgrade(),
    disabled: statsStore.score < statsStore.turboSpamUpgradeCost || statsStore.turboSpamInterval <= 500,
  },
  {
    title: 'Combos',
    description: '🔥 ¡Gana multiplicador de puntos por eliminar spam sin equivocarte!',
    details: [
      `Combo actual: x${statsStore.comboMultiplier ?? 1}`,
      `Costo: ${statsStore.comboUpgradeCost} 🪙`,
    ],
    onClick: () => statsStore.buyComboUpgrade(),
    disabled: statsStore.score < statsStore.comboUpgradeCost || statsStore.comboUnlocked,
    rounded: true,
  },
  {
    title: 'Spam Frenzy',
    description: '💥 Activa un modo especial donde el spam llega más rápido.',
    details: [
      statsStore.spamFrenzyUnlocked ? '¡Desbloqueado!' : `Costo: ${statsStore.spamFrenzyUpgradeCost} 🪙`,
    ],
    onClick: () => statsStore.buySpamFrenzyUpgrade(),
    disabled: statsStore.score < statsStore.spamFrenzyUpgradeCost || statsStore.spamFrenzyUnlocked,
    rounded: true,
  },
  {
    title: 'Virus Bomb',
    description: '💣 Convierte 5 emails legítimos en spam. Cooldown: 60s.',
    details: [
      statsStore.virusBombUnlocked ? '¡Desbloqueado!' : `Costo: ${statsStore.virusBombUpgradeCost} 🪙`,
      statsStore.virusBombUnlocked ? 'Habilidad activa' : 'Más puntos, más caos'
    ],
    onClick: () => statsStore.buyVirusBombUpgrade(),
    disabled: statsStore.score < statsStore.virusBombUpgradeCost || statsStore.virusBombUnlocked,
    rounded: true,
  },
  {
    title: 'Zordon Antivirus',
    description: '🛡️ Elimina 1 virus activo. Cooldown: 20s.',
    details: [
      statsStore.antivirusUnlocked ? '¡Desbloqueado!' : `Costo: ${statsStore.antivirusUpgradeCost} 🪙`,
      statsStore.antivirusUnlocked ? 'Remueve virus' : 'Virus sin control'
    ],
    onClick: () => statsStore.buyAntivirusUpgrade(),
    disabled: statsStore.score < statsStore.antivirusUpgradeCost || statsStore.antivirusUnlocked,
    rounded: true,
  },
  {
    title: 'Selección Grupal',
    description: '📦 Al seleccionar un email, selecciona todo el grupo consecutivo del mismo tipo (SPAM/NO SPAM).',
    details: [
      statsStore.groupSelectUnlocked ? '¡Desbloqueado!' : `Costo: ${statsStore.groupSelectUpgradeCost} 🪙`,
      statsStore.groupSelectUnlocked ? 'Grupos activados' : 'Selecciona por grupos'
    ],
    onClick: () => statsStore.buyGroupSelectUpgrade(),
    disabled: statsStore.score < statsStore.groupSelectUpgradeCost || statsStore.groupSelectUnlocked,
    rounded: true,
  },
  {
    title: 'Atajos de Teclado',
    description: '⌨️ Desbloquea atajos de teclado para navegar más rápido entre secciones.',
    details: [
      statsStore.keyboardShortcutsUnlocked ? '¡Desbloqueado!' : `Costo: ${statsStore.keyboardShortcutsUpgradeCost} 🪙`,
      statsStore.keyboardShortcutsUnlocked ? 'Atajos activados' : 'Navega más rápido'
    ],
    onClick: () => statsStore.buyKeyboardShortcutsUpgrade(),
    disabled: statsStore.score < statsStore.keyboardShortcutsUpgradeCost || statsStore.keyboardShortcutsUnlocked,
    rounded: true,
  },
  {
    title: 'Eliminar Seleccionados',
    description: '🗑️ Desbloquea el botón para eliminar múltiples emails seleccionados a la vez.',
    details: [
      statsStore.bulkDeleteUnlocked ? '¡Desbloqueado!' : `Costo: ${statsStore.bulkDeleteUpgradeCost} 🪙`,
      statsStore.bulkDeleteUnlocked ? 'Elimina en masa' : 'Borra varios a la vez'
    ],
    onClick: () => statsStore.buyBulkDeleteUpgrade(),
    disabled: statsStore.score < statsStore.bulkDeleteUpgradeCost || statsStore.bulkDeleteUnlocked,
    rounded: true,
  },
  {
    title: 'Archivar Seleccionados',
    description: '📂 Desbloquea el botón para archivar múltiples emails seleccionados a la vez.',
    details: [
      statsStore.bulkArchiveUnlocked ? '¡Desbloqueado!' : `Costo: ${statsStore.bulkArchiveUpgradeCost} 🪙`,
      statsStore.bulkArchiveUnlocked ? 'Archiva en masa' : 'Archiva varios a la vez'
    ],
    onClick: () => statsStore.buyBulkArchiveUpgrade(),
    disabled: statsStore.score < statsStore.bulkArchiveUpgradeCost || statsStore.bulkArchiveUnlocked,
    rounded: true,
  },
  {
    title: 'Mobile Friendly',
    description: '📱 Desliza hacia la derecha para archivar, hacia la izquierda para eliminar.',
    details: [
      statsStore.mobileFriendlyUnlocked ? '¡Desbloqueado!' : `Costo: ${statsStore.mobileFriendlyUpgradeCost} 🪙`,
      statsStore.mobileFriendlyUnlocked ? 'Gestos táctiles activados' : 'Navega con deslizamientos'
    ],
    onClick: () => statsStore.buyMobileFriendlyUpgrade(),
    disabled: statsStore.score < statsStore.mobileFriendlyUpgradeCost || statsStore.mobileFriendlyUnlocked,
    rounded: true,
  },
]);
</script>