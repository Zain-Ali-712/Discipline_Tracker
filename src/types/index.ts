// src/types/index.ts - Updated with start and completed dates
export interface Task {
  id: string;
  name: string;
  weight: number;
  completed: boolean;
  description: string;
  isExcluded?: (date: Date) => boolean;
}

export interface Project {
  id: string;
  name: string;
  estimatedHours: number;
  completed: boolean;
  startDate: string; // New: When project was started
  completedDate?: string; // New: When project was completed
  hoursLog: Array<{
    date: string;
    hours: number;
  }>;
  createdAt: string;
}

export interface DailyRecord {
  date: string;
  dayOfWeek: string;
  progress: number;
  tasks: Task[];
  isStreakDay: boolean;
  isSaved?: boolean;
  outreachPitches?: {
    instagram: number;
    linkedin: number;
    twitter: number;
    facebook: number;
  };
  projectHours?: number;
  advanceProjectHours?: number;
  customProjectHours?: Record<string, number>;
}

export interface DashboardStats {
  currentProgress: number;
  streak: number;
  weeklyAverage: number;
  monthlyAverage: number;
  overallAverage: number;
}

export const TASK_WEIGHTS = {
  OUTREACH: 25,
  PROJECT: 25,
  ADVANCE_PROJECT: 30,
  LEARNING: 12,
  SCROLLING: 8
} as const;