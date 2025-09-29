export function formatDate(timestamp) {
  const date = new Date(timestamp);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const emailDate = new Date(date);
  emailDate.setHours(0, 0, 0, 0);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}