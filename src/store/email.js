import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';

export const useEmailStore = defineStore('email', () => {
  // Inicializa la bandeja vacía
  const emails = ref([]);

  async function fetchEmail() {
    try {
      const res = await fetch('http://localhost:1234/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'system', content: 'sendemail' }] })
      });
      const data = await res.json();
      if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
        let parsed;
        try {
          parsed = JSON.parse(data.choices[0].message.content);
        } catch (e) {
          console.warn('No se pudo parsear el email como JSON, usando texto plano.');
          parsed = { subject: data.choices[0].message.content, body: data.choices[0].message.content, from: 'LLM' };
        }
        emails.value.push({
          id: Date.now(),
          subject: parsed.subject || 'Sin asunto',
          from: parsed.fromName || 'LLM',
          date: new Date().toLocaleDateString(),
          body: parsed.body || parsed.subject || '',
          isSpam: false,
          starred: false,
          read: false,
          trash: false
        });
      } else {
        console.log('Respuesta inesperada:', data);
      }
    } catch (err) {
      console.error('Error al pedir email:', err);
    }
  }

  onMounted(() => {
    fetchEmail();
  });

  function toggleStar(id) {
    const email = emails.value.find(e => e.id === id);
    if (email) email.starred = !email.starred;
  }

  function setRead(id, value = true) {
    const email = emails.value.find(e => e.id === id);
    if (email) email.read = value;
  }

  function moveToTrash(id) {
    const email = emails.value.find(e => e.id === id);
    if (email) email.trash = true;
  }

  return { emails, toggleStar, setRead, moveToTrash, fetchEmail };
});
