// src/utils/dataMigration.ts - Data migration and backup utility

import { loadFromLocalStorage, saveToLocalStorage } from './storage';
import { DailyRecord, Project } from '../types';

export interface BackupData {
    timestamp: string;
    history: DailyRecord[];
    projects: Project[];
    allTimePitches: Record<string, number>;
    theme: 'light' | 'dark';
}

/**
 * Creates a backup of all localStorage data
 */
export const createBackup = (): BackupData | null => {
    try {
        const history = loadFromLocalStorage<DailyRecord[]>('history') || [];
        const projects = loadFromLocalStorage<Project[]>('projects') || [];
        const allTimePitches = loadFromLocalStorage<Record<string, number>>('allTimePitches') || {};
        const theme = loadFromLocalStorage<'light' | 'dark'>('theme') || 'dark';

        const backup: BackupData = {
            timestamp: new Date().toISOString(),
            history,
            projects,
            allTimePitches,
            theme
        };

        return backup;
    } catch (error) {
        console.error('Error creating backup:', error);
        return null;
    }
};

/**
 * Downloads the backup as a JSON file
 */
export const downloadBackup = (backup: BackupData): void => {
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `discipline-tracker-backup-${backup.timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

/**
 * Migrates data from localStorage to MongoDB
 */
export const migrateToMongoDB = async (backup: BackupData): Promise<boolean> => {
    try {
        // Migrate history
        if (backup.history.length > 0) {
            const historyResponse = await fetch('/api/history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(backup.history)
            });
            if (!historyResponse.ok) throw new Error('History migration failed');
        }

        // Migrate projects
        if (backup.projects.length > 0) {
            const projectsResponse = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(backup.projects)
            });
            if (!projectsResponse.ok) throw new Error('Projects migration failed');
        }

        // Migrate settings
        const settingsResponse = await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                theme: backup.theme,
                allTimePitches: backup.allTimePitches
            })
        });
        if (!settingsResponse.ok) throw new Error('Settings migration failed');

        // Save migration flag
        saveToLocalStorage('migrated', true);

        return true;
    } catch (error) {
        console.error('Migration error:', error);
        return false;
    }
};

/**
 * Check if migration has already been completed
 */
export const isMigrated = (): boolean => {
    return loadFromLocalStorage<boolean>('migrated') || false;
};
