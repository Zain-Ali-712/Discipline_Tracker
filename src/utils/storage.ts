// src/utils/storage.ts - MongoDB API layer with localStorage backup/migration

// ===== LOCAL STORAGE HELPERS (For Backup & Migration) =====
export const loadFromLocalStorage = <T,>(key: string): T | null => {
  try {
    if (typeof window === 'undefined') return null;
    const item = localStorage.getItem(`discipline-tracker-${key}`);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

export const saveToLocalStorage = <T,>(key: string, data: T): void => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`discipline-tracker-${key}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// ===== MONGODB API HELPERS =====
export const loadData = async <T,>(key: string): Promise<T | null> => {
  try {
    const response = await fetch(`/api/${key}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`Error loading ${key} from API:`, error);
    return null;
  }
};

export const saveData = async <T,>(key: string, data: T): Promise<boolean> => {
  try {
    const response = await fetch(`/api/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.ok;
  } catch (error) {
    console.error(`Error saving ${key} to API:`, error);
    return false;
  }
};

export const loadTheme = (): 'light' | 'dark' | null => {
  // Load theme from localStorage for instant UI (no flicker)
  return loadFromLocalStorage<'light' | 'dark'>('theme');
};

export const saveTheme = async (theme: 'light' | 'dark'): Promise<void> => {
  // Save to both localStorage (for instant load) and DB
  saveToLocalStorage('theme', theme);
  await saveData('settings', { theme });
};