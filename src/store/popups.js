import { ref } from 'vue';
import { defineStore } from 'pinia';

export const usePopupsStore = defineStore('popups', () => {
  const browsers = ref([]);

  function addBrowser(url) {
    browsers.value.push({
      id: Date.now() + Math.random(),
      show: true,
      url: url
    });
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

  return {
    browsers,
    addBrowser,
    closeBrowser,
    createAdditional
  };
});