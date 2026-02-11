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
  // Use current date for context if needed, but the caller usually handles day-specific data
  // For week-relative logic or weekend checks, let's rely on the passed-in context or current day if generic
  // For now, we'll assume the caller passes relevant data or we check against "today" for immediate feedback
  const now = new Date();
  const isWeekend = now.getDay() === 0 || now.getDay() === 6;

  let totalWeight = TASK_WEIGHTS.PROJECT + TASK_WEIGHTS.ADVANCE_PROJECT +
    TASK_WEIGHTS.LEARNING + TASK_WEIGHTS.SCROLLING;

  // If strict weekend logic is required and we are on a weekend, outreach is auto-credited
  // But we need to be careful not to break historical data if we just check "now"
  // Let's assume this function is called for the *current* context mostly.
  // Ideally, we'd pass a date string. Let's add it as an optional param or rely on external `isWeekend` logic passed in.
  // Actually, standardizing on 365-day history, we should probably pass the date.
  // But to minimize signature changes breaking everything, let's stick to the requested "Sat/Sun" logic for now which implies "current day" for the dashboard.
  // For history, the `DailyRecord` already contains the calculated progress, so this function is mainly for "today's" updates.

  if (!isWeekend) {
    totalWeight += TASK_WEIGHTS.OUTREACH;
  } else {
    // On weekends, outreach is excluded from the *denominator* but we want to credit it as "done" or "bonus"?
    // The user said: "25% weifghtage of outreaching will be marked automaticlly"
    // So distinct from "excluded". It means it counts as 25% completed.
    totalWeight += TASK_WEIGHTS.OUTREACH;
  }

  let completedWeight = 0;

  // Outreach Logic
  if (isWeekend) {
    completedWeight += TASK_WEIGHTS.OUTREACH; // Auto-credit 25%
  } else if (outreachPitches) {
    const totalPitches = (outreachPitches.instagram || 0) + (outreachPitches.linkedin || 0) +
      (outreachPitches.twitter || 0) + (outreachPitches.facebook || 0) + (outreachPitches['google-search'] || 0);

    // 5 pitches = 100% (ratio 1.0). Cap at 1.4 (7 pitches).
    const pitchRatio = Math.min(totalPitches / 5, 1.4);
    completedWeight += TASK_WEIGHTS.OUTREACH * pitchRatio;
  }

  tasks.forEach(task => {
    switch (task.id) {
      case 'project':
        if (projectHours !== undefined && projectHours > 0) {
          // Target 2 hours. 
          // If <= 2: simple ratio.
          // If > 2: (2 + (hours - 2) * 0.5)
          let effectiveHours = projectHours;
          if (projectHours > 2) {
            effectiveHours = 2 + (projectHours - 2) * 0.5;
          }
          // Base weight is for 2 hours.
          const ratio = Math.min(effectiveHours / 2, 2); // Cap at 200% just in case, or let it ride? User didn't specify cap for bonus, but let's be safe.
          // Actually user said "mark 2.5/2", so that implies 1.25x weight.
          completedWeight += TASK_WEIGHTS.PROJECT * ratio;
        }
        break;

      case 'advance-project':
        if (advanceProjectHours !== undefined && advanceProjectHours > 0) {
          // Target 3 hours.
          // If <= 3: ratio.
          // If > 3: (3 + (hours - 3) * 0.5)
          let effectiveHours = advanceProjectHours;
          if (advanceProjectHours > 3) {
            effectiveHours = 3 + (advanceProjectHours - 3) * 0.5;
          }
          const ratio = Math.min(effectiveHours / 3, 2);
          completedWeight += TASK_WEIGHTS.ADVANCE_PROJECT * ratio;
        }
        break;

      case 'learning':
        if (task.completed) completedWeight += TASK_WEIGHTS.LEARNING;
        break;

      case 'scrolling':
        if (task.completed) completedWeight += TASK_WEIGHTS.SCROLLING;
        break;

      default:
        // Outreach is handled above. 
        break;
    }
  });

  // Custom Projects Fallback (only if no fixed project hours)
  const hasFixedHours = (projectHours || 0) > 0 || (advanceProjectHours || 0) > 0;
  if (!hasFixedHours && customProjects.length > 0) {
    const active = customProjects.filter(p => !p.completed);
    if (active.length > 0) {
      const weightPerProject = TASK_WEIGHTS.PROJECT / active.length;
      active.forEach(p => {
        const logged = p.hoursLog.reduce((a, b) => a + b.hours, 0);
        const ratio = Math.min(logged / Math.max(p.estimatedHours, 1), 1);
        completedWeight += weightPerProject * ratio;
      });
    }
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