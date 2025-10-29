<template>
    <!-- Canvas manual eliminado para usar el canvas por defecto de js-confetti -->
    <div class="flex flex-col bg-red-200 items-center justify-center h-full">
        <div class="roulette-container mb-6">
            <svg width="340" height="340" viewBox="0 0 340 340">
                <g>
                    <circle cx="170" cy="170" r="160" fill="#f9fafb" stroke="#e9ca4b" stroke-width="10" />
                    <g
                        :style="{ transform: `rotate(${rotation}deg)`, transformOrigin: '170px 170px', transition: spinning ? 'transform 2s cubic-bezier(.17,.67,.83,.67)' : 'transform 0.3s' }">
                        <g v-for="(segment, i) in segments" :key="i">
                            <path :d="getSegmentPath(i)" :fill="segment.color" />
                            <text class="text-4xl" :x="getTextX(i)" :y="getTextY(i)" text-anchor="middle"
                                alignment-baseline="middle" font-size="28" fill="#222">
                                {{ segment.label }}
                            </text>
                        </g>
                    </g>
                </g>
                   <polygon points="170,20 190,0 150,0" fill="#ef4444" />
            </svg>
        </div>
        <button class="bg-green-500 cursor-pointer hover:bg-green-600 text-white font-bold py-2 px-6 rounded shadow mb-4 transition"
            :disabled="spinning || statsStore.score < statsStore.pointsPerSpam" @click="() => { console.log('Botón presionado'); spinRoulette(); }">
            Girar ruleta por {{statsStore.pointsPerSpam}}🪙
        </button>
        <div v-if="result" class="mt-2 text-xl font-bold text-center">
            <span v-if="result === 'win'" class="text-green-600">¡Has ganado!</span>
            <span v-else class="text-red-500">Intenta de nuevo...</span>
        </div>
        <div v-else-if="spinning" class="mt-2 text-gray-500 text-xl italic">Girando...</div>
        <div v-else class="font-bold italic">Gira y ganá!!!</div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import JSConfetti from 'js-confetti';
import { useStatsStore } from '../../store/stats.js';

let jsConfetti = null;
onMounted(() => {
    jsConfetti = new JSConfetti(); // Usar canvas por defecto (body)
});

const segments = [
    { label: '🪙', color: '#cccccc', type: 'coin' },
    { label: '❌', color: '#dddddd', type: 'lose' },
    { label: '🪙', color: '#cccccc', type: 'coin' },
    { label: '❌', color: '#dddddd', type: 'lose' },
    { label: '❌', color: '#cccccc', type: 'lose' },
    { label: '🪙', color: '#dddddd', type: 'coin' },
    { label: '❌', color: '#cccccc', type: 'lose' },
    { label: '❌', color: '#dddddd', type: 'lose' },
];

const statsStore = useStatsStore();

const spinning = ref(false);
const result = ref(null);
const selectedIndex = ref(0);
const rotation = ref(0);

function getSegmentPath(i) {
    const angle = (2 * Math.PI) / segments.length;
    const startAngle = i * angle - Math.PI / 2;
    const endAngle = startAngle + angle;
    const r = 160;
    const x1 = 170 + r * Math.cos(startAngle);
    const y1 = 170 + r * Math.sin(startAngle);
    const x2 = 170 + r * Math.cos(endAngle);
    const y2 = 170 + r * Math.sin(endAngle);
    return `M170,170 L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`;
}

function getTextX(i) {
    const angle = ((i + 0.5) * 2 * Math.PI) / segments.length - Math.PI / 2;
    return 170 + 110 * Math.cos(angle);
}
function getTextY(i) {
    const angle = ((i + 0.5) * 2 * Math.PI) / segments.length - Math.PI / 2;
    return 170 + 110 * Math.sin(angle);
}

function spinRoulette() {
    console.log('spinRoulette llamada');
    // Coste de girar la ruleta
    const cost = statsStore.pointsPerSpam;
    console.log('score actual:', statsStore.score, 'coste:', cost, 'spinning:', spinning.value);
    if (statsStore.score < cost || spinning.value) {
        console.log('No se puede girar: score insuficiente o ya girando');
        return;
    }
    statsStore.addScore(-cost);
    spinning.value = true;
    result.value = null;
    const winner = Math.floor(Math.random() * segments.length);
    selectedIndex.value = winner;
    // Calcular rotación final: varias vueltas + ángulo ganador
    const baseRotations = 5; // vueltas completas
    const anglePerSegment = 360 / segments.length;
    const finalAngle = baseRotations * 360 + (360 - winner * anglePerSegment - anglePerSegment / 2);
    rotation.value = finalAngle;
    console.log('Rotación final:', finalAngle, 'Índice ganador:', winner);
    setTimeout(() => {
        spinning.value = false;
        const type = segments[winner].type;
        if (type === 'lose') {
            result.value = 'lose';
        } else if (type === 'coin') {
            result.value = 'win';
            statsStore.addScore(statsStore.pointsPerSpam);
            if (jsConfetti) {
                jsConfetti.addConfetti({
                    emojis: ['🎉', '🪙'],
                    emojiSize: 20,
                    confettiNumber: 50
                });
            }
        }
        // Ajustar rotación para que quede en el ángulo final (sin vueltas extra)
        rotation.value = (360 - winner * anglePerSegment - anglePerSegment / 2) % 360;
        console.log('Fin de giro, resultado:', result.value);
    }, 2000);
}
</script>

<style scoped>
.roulette-container {
    width: 340px;
    height: 340px;
    position: relative;
    margin-bottom: 1rem;
}

button[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>
