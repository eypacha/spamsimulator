const BANK_NAME = 'Banco Nación';

export const EMAILS_BANK_SPAM = [
    { subject: 'Reembolso disponible 💰', fromName: BANK_NAME, fromEmail: 'refunds@bnna.com.ar', body: 'Podés reclamar tu reembolso desde: https://bancofederal-support.org/refund', isSpam: true, type: 'finance' },
    { subject: 'Reembolso pendiente', fromName: BANK_NAME, fromEmail: 'payments@bbna.com.ar', body: 'Hay un reembolso a tu nombre, ingresá tus datos: https://banco-express.club/refund', isSpam: true, type: 'finance' },
    { subject: 'Confirmación de pago pendiente', fromName: BANK_NAME, fromEmail: 'notificaciones@bna.xyz', body: 'Debés validar tu transferencia para evitar suspensión: https://bancoprivado-pay.co/validar', isSpam: true, type: 'finance' },
    { subject: 'Reembolso disponible 💰', fromName: BANK_NAME, fromEmail: 'notificaciones@bna.co.ar', body: 'Reclamá tu reembolso ingresando a: https://bancofederal-support.org/refund', isSpam: true, type: 'finance' },
]