// utils/emailApi.js


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
        type: parsed.type || '',
        starred: false,
        read: false,
        trash: false,
        content: parsed.content,
        url: parsed.url
    };
}
