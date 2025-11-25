import { ref } from 'vue';
import { defineStore } from 'pinia';

export const usePopupsStore = defineStore('popups', () => {
  const browsers = ref([]);

  function addBrowser(options) {
    // options puede ser { url } o { component }
    const popup = {
      id: Date.now() + Math.random(),
      show: true,
      url: options.url || '',
      component: options.component || null
    };
    browsers.value.push(popup);
  }

  function closeBrowser(id) {
    const index = browsers.value.findIndex(b => b.id === id);
    if (index !== -1) {
      browsers.value.splice(index, 1);
    }
  }

  function createAdditional() {

    addBrowser('https://ejemplo.com');
  }

  function addCaptchaPopup(captchaId) {
    browsers.value.push({
      id: Date.now() + Math.random(),
      show: true,
      url: 'captcha',
      captchaId
    });
  }

  return {
    browsers,
    addBrowser,
    closeBrowser,
    createAdditional,
    addCaptchaPopup
  };
});