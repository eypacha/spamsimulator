  <template>
  <div class="hud-bar bg-blue-600 text-white px-6 py-2 flex justify-between items-center relative">
    <div class="flex items-center space-x-4">
      <!-- Hamburguesa solo en mobile -->
      <button @click="$emit('openSidebar')" class="md:hidden mr-2 text-white rounded shadow-lg focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <span class="font-bold">Spam Simulator</span>
    </div>
    <div class="flex items-center space-x-4">
      <span v-if="comboUnlocked && comboMultiplier > 1" class="font-bold text-yellow-300  animate-pulse pulse-fast">x{{
        comboMultiplier }}</span>
      <span v-if="virusCount > 0"
        :class="['inline-block transition-all duration-300', { 'scale-150 text-red-500': virusAnimating }]">🦠 {{ virusCount
        }}</span>
      <span
        :class="['transition-all duration-300', { 'scale-150': scoreAnimating, 'text-red-500': scoreDecreasing }]">🪙 {{
          score }}</span>
      <span>🗑️ {{ totalScore }}</span>
      <span :class="['transition-all duration-300', { 'scale-150 text-green-300': workAnimating }]">💼 {{
        workAppointments }}</span>
      <span :class="['transition-all duration-300', { 'scale-150 text-pink-300': medicalAnimating }]">🫀 {{ medicalAppointments }}</span>
      <span :class="['transition-transform duration-300', { 'scale-150': achievementsAnimating }]">🏅 {{
        unlockedAchievements }}</span>
      <span
        :class="['font-bold text-green-300 transition-transform duration-300', { 'scale-150': levelAnimating }]">Nivel
        {{ level }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useStatsStore } from '../store/stats.js';
import { useVirusStore } from '../store/virus.js';
import { useSoundStore } from '../store/sound.js';

const statsStore = useStatsStore();
const virusStore = useVirusStore();
const soundStore = useSoundStore();



const score = computed(() => statsStore.score);
const virusCount = computed(() => virusStore.virusCount);
const totalScore = computed(() => statsStore.totalScore);
const unlockedAchievements = computed(() => statsStore.unlockedAchievements);
const comboUnlocked = computed(() => statsStore.comboUnlocked);
const comboMultiplier = computed(() => statsStore.comboMultiplier);
const level = computed(() => statsStore.level);
const workAppointments = computed(() => statsStore.confirmedWorkAppointments?.size || 0);
const medicalAppointments = computed(() => statsStore.confirmedMedicalAppointments?.size || 0);
const medicalAnimating = ref(false);

watch(medicalAppointments, (newValue, oldValue) => {
  if (oldValue !== undefined && newValue > oldValue) {
    medicalAnimating.value = true;
    setTimeout(() => {
      medicalAnimating.value = false;
    }, 300);
  }
});
const workAnimating = ref(false);

watch(workAppointments, (newValue, oldValue) => {
  if (oldValue !== undefined && newValue > oldValue) {
    workAnimating.value = true;
    setTimeout(() => {
      workAnimating.value = false;
    }, 300);
  }
});
const scoreAnimating = ref(false);
const scoreDecreasing = ref(false);
const achievementsAnimating = ref(false);
const virusAnimating = ref(false);
const levelAnimating = ref(false);

watch(score, (newValue, oldValue) => {
  scoreAnimating.value = true;
  // Detectar si el score está decreciendo
  if (oldValue !== undefined && newValue < oldValue) {
    scoreDecreasing.value = true;
  } else {
    scoreDecreasing.value = false;
  }
  setTimeout(() => {
    scoreAnimating.value = false;
    scoreDecreasing.value = false;
  }, 300);
});

watch(unlockedAchievements, () => {
  achievementsAnimating.value = true;
  setTimeout(() => {
    achievementsAnimating.value = false;
  }, 300);
});

watch(virusCount, () => {
  virusAnimating.value = true;
  setTimeout(() => {
    virusAnimating.value = false;
  }, 300);
});

watch(level, (newValue, oldValue) => {
  if (oldValue !== undefined && newValue > oldValue) {
    console.log('Level up! Playing sound...');
    soundStore.playLevelupSound();
    levelAnimating.value = true;
    setTimeout(() => {
      levelAnimating.value = false;
    }, 300);
  }
});
</script>