// src/constants/stats.js
// Constantes usadas en el store de stats

export const EMAIL_SIZE_KB = 5; // Simulated size per email

// TurboSpam upgrade
export const TURBO_MIN_INTERVAL = 500; // ms, mínimo permitido (0.5s)
export const TURBO_DEFAULT_INTERVAL = 3500; // ms, valor inicial
export const TURBO_DEFAULT_COST = 100;
export const TURBO_DECREASE = 0.9; // 10% menos por upgrade

// Costos iniciales de upgrades
export const UPGRADE_COST = 10;
export const TRASH_UPGRADE_COST = 20;
export const INBOX_UPGRADE_COST = 30;
export const SELECTION_UPGRADE_COST = 40;

// Otros valores por defecto
export const MAX_TRASH = 10;
export const MAX_INBOX = 20;
export const MAX_SELECTABLE = 3;
