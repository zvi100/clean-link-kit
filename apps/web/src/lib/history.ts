import type { LinkHistoryItem } from '../types';

const HISTORY_KEY = 'clean-link-kit:history:v1';
const MAX_HISTORY_ITEMS = 10;

export function readHistory(): LinkHistoryItem[] {
  try {
    const rawHistory = localStorage.getItem(HISTORY_KEY);

    if (!rawHistory) {
      return [];
    }

    const parsedHistory = JSON.parse(rawHistory);

    if (!Array.isArray(parsedHistory)) {
      return [];
    }

    return parsedHistory.filter(isHistoryItem).slice(0, MAX_HISTORY_ITEMS);
  } catch {
    return [];
  }
}

export function saveHistoryItem(item: Omit<LinkHistoryItem, 'id' | 'createdAt'>): LinkHistoryItem[] {
  const nextItem: LinkHistoryItem = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...item
  };

  const nextHistory = [nextItem, ...readHistory().filter((historyItem) => historyItem.cleanUrl !== item.cleanUrl)].slice(0, MAX_HISTORY_ITEMS);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));

  return nextHistory;
}

export function clearHistory(): LinkHistoryItem[] {
  localStorage.removeItem(HISTORY_KEY);
  return [];
}

function isHistoryItem(value: unknown): value is LinkHistoryItem {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const item = value as Record<string, unknown>;

  return typeof item.id === 'string' &&
    typeof item.originalUrl === 'string' &&
    typeof item.cleanUrl === 'string' &&
    typeof item.removedCount === 'number' &&
    typeof item.createdAt === 'string';
}
