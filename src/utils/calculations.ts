// src/utils/calculations.ts
import { Task, DailyRecord } from '../types';

export const TASK_WEIGHTS = {
  WORKOUT: 15,
  OUTREACH: 25,
  PROJECT: 20,
  PORTFOLIO: 25,
  LEARNING: 15
} as const;

// Helper to check if within first 2 weeks
const isFirstTwoWeeks = (): boolean => {
  const startDate = new Date('2024-01-01');
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 14;
};

export const initializeDailyTasks = (date: Date = new Date()): Task[] => {
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const inFirstTwoWeeks = isFirstTwoWeeks();

  return [
    {
      id: 'workout',
      name: 'Workout',
      weight: TASK_WEIGHTS.WORKOUT,
      completed: false,
      description: 'Daily exercise routine'
    },
    {
      id: 'outreach',
      name: 'Outreaching Work',
      weight: isWeekend ? 0 : TASK_WEIGHTS.OUTREACH,
      completed: false,
      description: '1 hour minimum daily',
      minHours: 1,
      isExcluded: (checkDate: Date) => {
        const day = checkDate.getDay();
        return day === 0 || day === 6;
      }
    },
    {
      id: 'project',
      name: 'Project Implementation',
      weight: TASK_WEIGHTS.PROJECT,
      completed: false,
      description: '2+ hours minimum - Applying learned skills in real projects',
      minHours: 2
    },
    {
      id: 'portfolio',
      name: inFirstTwoWeeks ? 'Social Profiles/Portfolio Setup' : 'Advanced Project Work',
      weight: TASK_WEIGHTS.PORTFOLIO,
      completed: false,
      description: inFirstTwoWeeks 
        ? '3+ hours daily - Profile setup and portfolio building' 
        : '3+ hours daily - Fully project-focused work',
      minHours: 3
    },
    {
      id: 'learning',
      name: 'Intentional Scrolling / Skill Learning',
      weight: TASK_WEIGHTS.LEARNING,
      completed: false,
      description: 'Skill-related content only - Must be intentional'
    }
  ];
};

export const calculateDailyProgress = (tasks: Task[]): number => {
  const applicableTasks = tasks.filter(task => {
    if (task.isExcluded) {
      const today = new Date();
      return !task.isExcluded(today);
    }
    return true;
  });
  
  const totalWeight = applicableTasks.reduce((sum, task) => sum + task.weight, 0);
  const completedWeight = applicableTasks
    .filter(task => task.completed)
    .reduce((sum, task) => sum + task.weight, 0);
  
  return totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
};

export const calculateStreak = (history: DailyRecord[]): number => {
  const sorted = [...history]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter(record => record.progress > 0);

  let streak = 0;
  
  for (const record of sorted) {
    if (record.progress >= 80) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

export const calculateWeeklyProgress = (history: DailyRecord[]): number => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const lastWeekRecords = history.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate >= oneWeekAgo && recordDate <= new Date();
  });
  
  if (lastWeekRecords.length === 0) return 0;
  
  const total = lastWeekRecords.reduce((sum, record) => sum + record.progress, 0);
  return Math.round(total / lastWeekRecords.length);
};

export const calculateMonthlyProgress = (history: DailyRecord[]): number => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const monthRecords = history.filter(record => {
    const recordDate = new Date(record.date);
    return (
      recordDate.getMonth() === currentMonth &&
      recordDate.getFullYear() === currentYear
    );
  });
  
  if (monthRecords.length === 0) return 0;
  
  const total = monthRecords.reduce((sum, record) => sum + record.progress, 0);
  return Math.round(total / monthRecords.length);
};