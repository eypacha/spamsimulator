// utils/emailApi.js

export async function fetchEmailFromLLM() {
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
        parsed = { subject: data.choices[0].message.content, body: data.choices[0].message.content, from: 'LLM' };
      }
      return parsed;
    } else {
      throw new Error('Respuesta inesperada: ' + JSON.stringify(data));
    }
  } catch (err) {
    throw err;
  }
}

export function newEmail(parsed) {
  return {
    id: Date.now(),
    subject: parsed.subject || '(Sin asunto)',
    from: parsed.fromName || 'Unknown',
    date: new Date().toLocaleDateString(),
    body: parsed.body || parsed.subject || '',
    isSpam: false,
    starred: false,
    read: false,
    trash: false
  };
}
