// src/utils/statsStorage.js
// Helpers for loading and saving stats to localStorage

export const STATS_STORAGE_KEY = 'spambot_stats';

export function loadStats() {
  const saved = localStorage.getItem(STATS_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
}

export function saveStats(stats) {
  localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
}
