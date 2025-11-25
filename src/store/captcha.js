// src/store/captcha.js
import { ref } from 'vue';

const verifiedCaptchas = ref(new Set());

export function useCaptchaStore() {
  function isVerified(id) {
    return verifiedCaptchas.value.has(id);
  }
  function markVerified(id) {
    verifiedCaptchas.value.add(id);
  }
  function reset() {
    verifiedCaptchas.value.clear();
  }
  return {
    isVerified,
    markVerified,
    reset,
    verifiedCaptchas,
  };
}
