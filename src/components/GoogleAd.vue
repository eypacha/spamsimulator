<template>
  <div class="google-ad-container">
    <ins
      class="adsbygoogle"
      style="display:block"
      data-ad-client="ca-pub-5517650651187408"
      data-ad-slot="XXXXXXXXXX"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // Push the ad when component is mounted
  if (window.adsbygoogle) {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }
});
</script>

<style scoped>
.google-ad-container {
  margin: 1rem 0;
  text-align: center;
}
</style>