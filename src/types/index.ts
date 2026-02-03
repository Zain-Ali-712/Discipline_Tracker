// src/types/index.ts
export interface Task {
  id: string;
  name: string;
  weight: number;
  completed: boolean;
  description: string;
  minHours?: number;
  isExcluded?: (date: Date) => boolean;
}

export interface DailyRecord {
  date: string;
  dayOfWeek: string;
  progress: number;
  tasks: Task[];
  isStreakDay: boolean;
}

export interface DashboardStats {
  currentProgress: number;
  streak: number;
  weeklyAverage: number;
  monthlyAverage: number;
}

export interface DailyRecord {
  date: string;
  dayOfWeek: string;
  progress: number;
  tasks: Task[];
  isStreakDay: boolean;
  isSaved?: boolean; 
}

export const TASK_WEIGHTS = {
  WORKOUT: 15,
  OUTREACH: 25,
  PROJECT: 20,
  PORTFOLIO: 25,
  LEARNING: 15
} as const;