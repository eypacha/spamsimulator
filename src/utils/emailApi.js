// utils/emailApi.js

export async function fetchEmailFromLLM(spamType = 'legit', emailType = 'office', lang = 'es') {
    try {
        const systemContent = `sendemail: ${spamType}; type: ${emailType}; lang: ${lang}; emojis: true`;
        const res = await fetch('http://localhost:1234/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: [{ role: 'system', content: systemContent }] })
        });
        const data = await res.json();
        if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
            let parsed;
            try {
                parsed = JSON.parse(data.choices[0].message.content);
            } catch (e) {
                parsed = { subject: data.choices[0].message.content, body: data.choices[0].message.content, fromName: 'LLM', fromEmail: '' };
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
    console.log("🚀 ~ newEmail ~ parsed:", parsed)
    return {
        id: Date.now(),
        subject: parsed.subject || '(Sin asunto)',
        fromName: parsed.fromName || 'Unknown',
        fromEmail: parsed.fromEmail || '',
        date: new Date().toLocaleDateString(),
        body: parsed.body || parsed.subject || '',
        isSpam: parsed.isSpam ?? false,
        starred: false,
        read: false,
        trash: false
    };
}
