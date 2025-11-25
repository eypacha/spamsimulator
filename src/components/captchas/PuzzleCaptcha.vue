<template>
    <div class="flex flex-col items-center gap-4">
        <div class="mb-2 text-gray-700 text-sm text-center">Verifica la imagen para continuar.</div>
        <div class="relative w-[400px] h-[250px]">
            <canvas ref="puzzleCanvas" width="400" height="250" class="border rounded absolute top-0 left-0 z-1 bg-transparent" />
            <div class="piece-movil" :style="{
                position: 'absolute',
                left: pieceX2 + 'px',
                top: pieceY2 + 'px',
                width: pieceWidth + 'px',
                height: pieceHeight + 'px',
                backgroundImage: `url(images/puzzleCaptcha/piece-white.png), url(${image.src})`,
                backgroundPosition: `center center, -${pieceX}px -${pieceY}px`,
                backgroundSize: `100% 100%, 400px 250px`,
                zIndex: 2,
                WebkitMaskImage: `url(images/puzzleCaptcha/piece-black.png)`,
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskSize: '100% 100%',
                maskImage: `url(images/puzzleCaptcha/piece-black.png)`,
                maskRepeat: 'no-repeat',
                maskSize: '100% 100%'
            }">
            </div>
            <span v-if="isAligned || props.verified" class="absolute top-2 right-3 text-2xl z-20 pointer-events-none">✅</span>
        </div>
        <div class="w-full flex justify-center mt-2">
            <input type="range" min="0" max="350" v-model="sliderValue" class="w-[calc(100%-20px)]" :disabled="props.verified || props.disabled" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
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

let alignTimer = null;
const captchaValid = ref(false);

const margin = 2;
const puzzleCanvas = ref(null);
const sliderValue = ref(0);
const pieceWidth = 50;
const pieceHeight = 50;

const pieceX = ref(0);
const pieceY = ref(0);
const pieceX2 = ref(10);
const pieceY2 = ref(0);

const image = new window.Image();
image.src = 'images/puzzleCaptcha/image0.jpg';
const imageLoaded = ref(false);
image.onload = () => {
    imageLoaded.value = true;
    console.log('Imagen cargada correctamente:', image.src);
};
image.onerror = () => {
    imageLoaded.value = false;
    console.error('Error al cargar la imagen:', image.src);
};

const pieceBlackImg = new window.Image();
pieceBlackImg.src = 'images/puzzleCaptcha/piece-black.png';
const pieceWhiteImg = new window.Image();
pieceWhiteImg.src = 'images/puzzleCaptcha/piece-white.png';

const isAligned = computed(() => {
    return (
        Math.abs(pieceX2.value - pieceX.value) <= margin &&
        Math.abs(pieceY2.value - pieceY.value) <= margin
    );
});

// Watcher para detectar alineación y slider quieto
watch([isAligned, sliderValue], ([aligned, value], [prevAligned, prevValue]) => {
    if (alignTimer) clearTimeout(alignTimer);
    if (aligned && !props.verified && !props.disabled) {
        // Si el slider no se mueve por 1 segundo y está alineado, validar captcha
        alignTimer = setTimeout(() => {
            // Si sigue alineado y el slider no se movió
            if (isAligned.value && sliderValue.value === value && !captchaValid.value) {
                captchaValid.value = true;
                emit('submit');
            }
        }, 1000);
    }
});

function setRandomPiecePosition(canvas) {
    const paddingLeft = 50;
    const paddingRight = 10;
    const paddingBlockTop = 10;
    const maxX = canvas.width - pieceWidth - paddingRight;
    const maxY = canvas.height - pieceHeight - paddingBlockTop;
    pieceX.value = Math.floor(Math.random() * (maxX - paddingLeft + 1)) + paddingLeft;
    pieceY.value = Math.floor(Math.random() * (maxY - paddingBlockTop + 1)) + paddingBlockTop;
    pieceX2.value = 0;
    pieceY2.value = pieceY.value;
}

function updatePiece2Position() {
    pieceX2.value = sliderValue.value;
}

function drawImage() {
    const canvas = puzzleCanvas.value;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (image.complete && image.naturalWidth > 0) {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        drawPiece(ctx);
    } else {
        console.warn('La imagen aún no está lista para dibujar:', image.src);
        image.onload = () => {
            if (image.naturalWidth > 0) {
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                drawPiece(ctx);
                console.log('Imagen dibujada tras cargar:', image.src);
            } else {
                console.error('La imagen sigue sin poder dibujarse:', image.src);
            }
        };
    }
}

function drawPiece(ctx) {
    if (pieceBlackImg.complete) {
        ctx.drawImage(pieceBlackImg, pieceX.value, pieceY.value, pieceWidth, pieceHeight);
    } else {
        pieceBlackImg.onload = () => {
            ctx.drawImage(pieceBlackImg, pieceX.value, pieceY.value, pieceWidth, pieceHeight);
        };
    }
    if (pieceWhiteImg.complete) {
        ctx.drawImage(pieceWhiteImg, pieceX.value, pieceY.value, pieceWidth, pieceHeight);
    } else {
        pieceWhiteImg.onload = () => {
            ctx.drawImage(pieceWhiteImg, pieceX.value, pieceY.value, pieceWidth, pieceHeight);
        };
    }
}

onMounted(() => {
    const canvas = puzzleCanvas.value;
    if (canvas) setRandomPiecePosition(canvas);
    drawImage();
});

watch(sliderValue, () => {
    updatePiece2Position();
    drawImage();
});
</script>
