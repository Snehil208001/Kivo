import { create } from 'zustand';

const WISHLIST_KEY = 'kivo_wishlist';

function readHandles() {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function persistHandles(handles) {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(handles));
  } catch {
    /* ignore */
  }
}

export const useWishlistStore = create((set, get) => ({
  handles: readHandles(),

  toggle: (handle) => {
    if (!handle) return;
    const current = get().handles;
    const next = current.includes(handle)
      ? current.filter((h) => h !== handle)
      : [...current, handle];
    persistHandles(next);
    set({ handles: next });
  },

  has: (handle) => get().handles.includes(handle),

  remove: (handle) => {
    const next = get().handles.filter((h) => h !== handle);
    persistHandles(next);
    set({ handles: next });
  },
}));
