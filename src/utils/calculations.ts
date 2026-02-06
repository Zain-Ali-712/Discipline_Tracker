// src/utils/calculations.ts - Fixed advanced project calculation
import { Task, DailyRecord, Project } from '../types';

export const TASK_WEIGHTS = {
  OUTREACH: 25,
  PROJECT: 25,
  ADVANCE_PROJECT: 30,
  LEARNING: 12,
  SCROLLING: 8
} as const;

export const initializeDailyTasks = (date: Date = new Date()): Task[] => {
  const isWeekend = date.getDay() === 0;

  return [
    {
      id: 'outreach',
      name: 'Outreaching',
      weight: isWeekend ? 0 : TASK_WEIGHTS.OUTREACH,
      completed: false,
      description: '5+ pitches daily',
      isExcluded: (checkDate: Date) => {
        const day = checkDate.getDay();
        return day === 0; // Excluded on Sundays only
      }
    },
    {
      id: 'project',
      name: 'Project Implementation',
      weight: TASK_WEIGHTS.PROJECT,
      completed: false,
      description: '2+ hours daily'
    },
    {
      id: 'advance-project',
      name: 'Advanced Project',
      weight: TASK_WEIGHTS.ADVANCE_PROJECT,
      completed: false,
      description: '3+ hours daily'
    },
    {
      id: 'learning',
      name: 'Skills Learning',
      weight: TASK_WEIGHTS.LEARNING,
      completed: false,
      description: 'Intentional learning'
    },
    {
      id: 'scrolling',
      name: 'Skill Scrolling',
      weight: TASK_WEIGHTS.SCROLLING,
      completed: false,
      description: 'Intentional content'
    }
  ];
};

export const calculateDailyProgress = (
  tasks: Task[],
  outreachPitches?: Record<string, number>,
  projectHours?: number,
  advanceProjectHours?: number,
  customProjects: Project[] = []
): number => {
  let totalWeight = TASK_WEIGHTS.PROJECT + TASK_WEIGHTS.ADVANCE_PROJECT +
    TASK_WEIGHTS.LEARNING + TASK_WEIGHTS.SCROLLING;
  let completedWeight = 0;

  // Calculate task weights (excluding outreach for weekends)
  const isWeekend = new Date().getDay() === 0;
  if (!isWeekend) {
    totalWeight += TASK_WEIGHTS.OUTREACH;
  }

  // Calculate completed weight from fixed tasks
  tasks.forEach(task => {
    switch (task.id) {
      case 'outreach':
        if (!isWeekend && outreachPitches) {
          const totalPitches = outreachPitches.instagram + outreachPitches.linkedin +
            outreachPitches.twitter + outreachPitches.facebook;
          const pitchRatio = Math.min(totalPitches / 5, 1.4); // Cap at 140% for extra work
          completedWeight += task.weight * pitchRatio;
        }
        break;

      case 'project':
        if (projectHours !== undefined) {
          const hourRatio = Math.min(projectHours / 2, 2); // 2 hours = 100%, cap at 200%
          completedWeight += task.weight * hourRatio;
        }
        break;

      case 'advance-project':
        if (advanceProjectHours !== undefined) {
          // Fixed: 1 hour = 1/3 of weight, 2 hours = 2/3, 3 hours = full weight, cap at 133%
          const hourRatio = Math.min(advanceProjectHours / 3, 1.33);
          completedWeight += task.weight * hourRatio;
        }
        break;

      default:
        if (task.completed) {
          completedWeight += task.weight;
        }
    }
  });

  // Add custom project weight (only if no fixed project hours tracked today)
  const activeCustomProjects = customProjects.filter(p => !p.completed);
  const hasFixedProjectHours = projectHours !== undefined && projectHours > 0;

  if (!hasFixedProjectHours && activeCustomProjects.length > 0) {
    // Distribute project weight among custom projects
    const projectWeightPerCustomProject = TASK_WEIGHTS.PROJECT / Math.max(activeCustomProjects.length, 1);

    activeCustomProjects.forEach(project => {
      const totalHours = project.hoursLog.reduce((sum, log) => sum + log.hours, 0);
      const hourRatio = Math.min(totalHours / Math.max(project.estimatedHours, 1), 1);
      completedWeight += projectWeightPerCustomProject * hourRatio;
    });
  }

  return totalWeight > 0 ? Math.min(Math.round((completedWeight / totalWeight) * 100), 100) : 0;
};

// Rest of the functions remain the same...
export const calculateStreak = (history: DailyRecord[]): number => {
  const sorted = [...history]
    .filter((record, index, self) =>
      index === self.findIndex(r => r.date === record.date)
    )
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
  const uniqueHistory = history.filter((record, index, self) =>
    index === self.findIndex(r => r.date === record.date)
  );

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const lastWeekRecords = uniqueHistory.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate >= oneWeekAgo && recordDate <= new Date();
  });

  if (lastWeekRecords.length === 0) return 0;

  const total = lastWeekRecords.reduce((sum, record) => sum + record.progress, 0);
  return Math.round(total / lastWeekRecords.length);
};

export const calculateMonthlyProgress = (history: DailyRecord[]): number => {
  const uniqueHistory = history.filter((record, index, self) =>
    index === self.findIndex(r => r.date === record.date)
  );

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthRecords = uniqueHistory.filter(record => {
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

export const calculateOverallProgress = (history: DailyRecord[]): number => {
  const uniqueHistory = history.filter((record, index, self) =>
    index === self.findIndex(r => r.date === record.date)
  );

  if (uniqueHistory.length === 0) return 0;

  const total = uniqueHistory.reduce((sum, record) => sum + record.progress, 0);
  return Math.round(total / uniqueHistory.length);
};