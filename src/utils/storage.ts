// src/utils/storage.ts - Updated with theme storage
export const loadData = <T,>(key: string): T | null => {
  try {
    if (typeof window === 'undefined') return null;
    const item = localStorage.getItem(`discipline-tracker-${key}`);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error loading data:', error);
    return null;
  }
};

export const saveData = <T,>(key: string, data: T): void => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`discipline-tracker-${key}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export const loadTheme = (): 'light' | 'dark' | null => {
  try {
    if (typeof window === 'undefined') return null;
    const theme = localStorage.getItem('discipline-tracker-theme');
    return theme as 'light' | 'dark' || null;
  } catch (error) {
    console.error('Error loading theme:', error);
    return null;
  }
};

export const saveTheme = (theme: 'light' | 'dark'): void => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem('discipline-tracker-theme', theme);
  } catch (error) {
    console.error('Error saving theme:', error);
  }
};