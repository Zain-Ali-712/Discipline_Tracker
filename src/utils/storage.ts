// src/utils/storage.ts
export const loadData = <T,>(key: string): T | null => {
  try {
    const item = localStorage.getItem(`discipline-tracker-${key}`);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error loading data:', error);
    return null;
  }
};

export const saveData = <T,>(key: string, data: T): void => {
  try {
    localStorage.setItem(`discipline-tracker-${key}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};