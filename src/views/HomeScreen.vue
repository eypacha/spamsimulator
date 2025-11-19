
<template>
  <div class="home-screen min-h-screen bg-gray-100 flex items-center justify-center bg-[url('images/backgrounds/doodle-email.jpg')] bg-[length:1200px]">
    <div class="w-full max-w-md mx-auto bg-white border border-gray-300 p-8 flex flex-col items-center">
      <h1 class="text-3xl font-bold mb-4 text-gray-800">Simulador de Spam</h1>
      <p class="text-base text-gray-600 mb-8 text-center">¡Bienvenido! Pon a prueba tu habilidad para detectar y gestionar correos sospechosos.</p>
      <router-link to="/game" class="w-full">
        <button class="w-full py-3 bg-blue-600 text-white rounded-none font-semibold text-lg hover:bg-blue-700 transition">
          Jugar
        </button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeScreen'
}
</script>

<style scoped>
.home-screen {
  min-height: 100vh;
}
</style>
