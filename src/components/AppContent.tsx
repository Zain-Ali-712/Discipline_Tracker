// src/components/AppContent.tsx - Updated to create Project with start date
'use client';
import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import HistoryTable from './HistoryTable';
import TaskManager from './TaskManager';
import OutreachDetails from './OutreachDetails';
import ProjectManager from './ProjectManager';
import { Task, DailyRecord, Project } from '../types';
import {
  calculateDailyProgress,
  initializeDailyTasks,
  calculateStreak,
  calculateWeeklyProgress,
  calculateMonthlyProgress,
  calculateOverallProgress
} from '../utils/calculations';
import { loadData, saveData, loadTheme, saveTheme, loadFromLocalStorage, saveToLocalStorage } from '../utils/storage';
import { createBackup, downloadBackup, migrateToMongoDB, isMigrated } from '../utils/dataMigration';
import { FiSun, FiMoon } from 'react-icons/fi';

const App: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'migrating' | 'success' | 'error'>('idle');
  const [migrationMessage, setMigrationMessage] = useState('');

  useEffect(() => {
    setIsClient(true);
    setCurrentDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Migration effect - runs once on mount
  useEffect(() => {
    if (!isClient) return;

    const performMigration = async () => {
      // Check if migration is needed
      if (isMigrated()) {
        console.log('Data already migrated to MongoDB');
        setMigrationStatus('success');
        setMigrationMessage('Data already migrated');
        return;
      }

      setMigrationStatus('migrating');
      setMigrationMessage('Creating backup...');

      // Create backup first
      const backup = createBackup();
      if (!backup) {
        console.error('Failed to create backup');
        return;
      }

      console.log('Created backup of localStorage data');
      setMigrationMessage('Migrating to MongoDB...');

      // Attempt migration
      const migrationSuccess = await migrateToMongoDB(backup);
      if (migrationSuccess) {
        console.log('Successfully migrated data to MongoDB');
        console.log('Your localStorage data remains as a backup');
        setMigrationStatus('success');
        setMigrationMessage('Migration successful!');
      } else {
        console.error('Migration failed - data remains in localStorage');
        setMigrationStatus('error');
        setMigrationMessage('Migration failed. Data is safe in localStorage.');
      }
    };

    performMigration();
  }, [isClient]);

  const [history, setHistory] = useState<DailyRecord[]>(() => {
    return loadFromLocalStorage<DailyRecord[]>('history') || [];
  });

  const [currentDate, setCurrentDate] = useState<string>(''); // Initialize empty for hydration fix

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return loadTheme() || 'dark';
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    return loadFromLocalStorage<Project[]>('projects') || [];
  });

  // Load all-time pitch counts from storage
  const [allTimePitches, setAllTimePitches] = useState<Record<string, number>>(() => {
    return loadFromLocalStorage<Record<string, number>>('allTimePitches') || {
      instagram: 0,
      linkedin: 0,
      twitter: 0,
      facebook: 0
    };
  });

  const currentDayRecord = history.find(record => record.date === currentDate);
  // Current Day State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [outreachPitches, setOutreachPitches] = useState<Record<string, number>>({
    instagram: 0,
    linkedin: 0,
    twitter: 0,
    facebook: 0,
    'google-search': 0
  });
  const [projectHours, setProjectHours] = useState(0);
  const [advanceProjectHours, setAdvanceProjectHours] = useState(0);

  // Load or initialize today's record
  useEffect(() => {
    // Only run on client and when currentDate is set
    if (!isClient || !currentDate) return;

    const todayRecord = history.find(record => record.date === currentDate);
    if (!todayRecord) {
      const newTasks = initializeDailyTasks(new Date(currentDate));
      const newRecord: DailyRecord = {
        date: currentDate,
        dayOfWeek: new Date(currentDate).toLocaleDateString('en-US', { weekday: 'short' }),
        progress: 0,
        tasks: newTasks,
        isStreakDay: false,
        isSaved: false,
        outreachPitches: {
          instagram: 0,
          linkedin: 0,
          twitter: 0,
          facebook: 0,
          'google-search': 0
        },
        projectHours: 0,
        advanceProjectHours: 0,
        customProjectHours: {}
      };
      setHistory(prev => {
        const filtered = prev.filter(record => record.date !== currentDate);
        // Ensure we don't have duplicates and add new record
        return [...filtered, newRecord];
      });
      setTasks(newTasks);
      setIsSaved(false);
      setOutreachPitches({
        instagram: 0,
        linkedin: 0,
        twitter: 0,
        facebook: 0,
        'google-search': 0
      });
      setProjectHours(0);
      setAdvanceProjectHours(0);
    } else {
      setTasks(todayRecord.tasks);
      setIsSaved(todayRecord.isSaved || false);
      setOutreachPitches(todayRecord.outreachPitches || {
        instagram: 0,
        linkedin: 0,
        twitter: 0,
        facebook: 0,
        'google-search': 0
      });
      setProjectHours(todayRecord.projectHours || 0);
      setAdvanceProjectHours(todayRecord.advanceProjectHours || 0);
    }
  }, [currentDate, history, isClient]);

  const toggleTask = (taskId: string) => {
    if (isSaved) return;

    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    setTasks(updatedTasks);

    const progress = calculateDailyProgress(
      updatedTasks,
      outreachPitches,
      projectHours,
      advanceProjectHours,
      projects
    );
    const isStreakDay = progress >= 80;

    const updatedHistory = history.map(record => {
      if (record.date === currentDate) {
        return {
          ...record,
          tasks: updatedTasks,
          progress,
          isStreakDay,
          outreachPitches,
          projectHours,
          advanceProjectHours,
          customProjectHours: getTodayProjectHours()
        };
      }
      return record;
    });

    const uniqueHistory = updatedHistory.filter((record, index, self) =>
      index === self.findIndex(r => r.date === record.date)
    );

    setHistory(uniqueHistory);
  };

  const updateOutreachPitches = (platform: string, count: number) => {
    if (isSaved) return;

    const updatedPitches = {
      ...outreachPitches,
      [platform]: Math.max(0, Math.min(10, count))
    };

    setOutreachPitches(updatedPitches);

    // Update all-time counts by the delta (handles adds and removes)
    const pitchChange = count - outreachPitches[platform];
    if (pitchChange !== 0) {
      const updatedAllTimePitches = {
        ...allTimePitches,
        [platform]: Math.max(0, (allTimePitches[platform] || 0) + pitchChange)
      };
      setAllTimePitches(updatedAllTimePitches);
      saveData('allTimePitches', updatedAllTimePitches);
    }

    const progress = calculateDailyProgress(
      tasks,
      updatedPitches,
      projectHours,
      advanceProjectHours,
      projects
    );
    const isStreakDay = progress >= 80;

    const updatedHistory = history.map(record => {
      if (record.date === currentDate) {
        return {
          ...record,
          tasks,
          progress,
          isStreakDay,
          outreachPitches: updatedPitches,
          projectHours,
          advanceProjectHours,
          customProjectHours: getTodayProjectHours()
        };
      }
      return record;
    });

    const uniqueHistory = updatedHistory.filter((record, index, self) =>
      index === self.findIndex(r => r.date === record.date)
    );

    setHistory(uniqueHistory);
  };

  const updateProjectHours = (hours: number) => {
    if (isSaved) return;

    setProjectHours(Math.max(0, Math.min(4, hours)));

    const progress = calculateDailyProgress(
      tasks,
      outreachPitches,
      Math.max(0, Math.min(4, hours)),
      advanceProjectHours,
      projects
    );
    const isStreakDay = progress >= 80;

    const updatedHistory = history.map(record => {
      if (record.date === currentDate) {
        return {
          ...record,
          tasks,
          progress,
          isStreakDay,
          outreachPitches,
          projectHours: Math.max(0, Math.min(4, hours)),
          advanceProjectHours,
          customProjectHours: getTodayProjectHours()
        };
      }
      return record;
    });

    const uniqueHistory = updatedHistory.filter((record, index, self) =>
      index === self.findIndex(r => r.date === record.date)
    );

    setHistory(uniqueHistory);
  };

  const updateAdvanceProjectHours = (hours: number) => {
    if (isSaved) return;

    setAdvanceProjectHours(Math.max(0, Math.min(4, hours)));

    const progress = calculateDailyProgress(
      tasks,
      outreachPitches,
      projectHours,
      Math.max(0, Math.min(4, hours)),
      projects
    );
    const isStreakDay = progress >= 80;

    const updatedHistory = history.map(record => {
      if (record.date === currentDate) {
        return {
          ...record,
          tasks,
          progress,
          isStreakDay,
          outreachPitches,
          projectHours,
          advanceProjectHours: Math.max(0, Math.min(4, hours)),
          customProjectHours: getTodayProjectHours()
        };
      }
      return record;
    });

    const uniqueHistory = updatedHistory.filter((record, index, self) =>
      index === self.findIndex(r => r.date === record.date)
    );

    setHistory(uniqueHistory);
  };

  const getTodayProjectHours = () => {
    const todayHours: Record<string, number> = {};
    projects.forEach(project => {
      const todayLog = project.hoursLog.find(log => log.date === currentDate);
      todayHours[project.id] = todayLog ? todayLog.hours : 0;
    });
    return todayHours;
  };

  const addProject = (project: Project) => {
    const newProjects = [...projects, project];
    setProjects(newProjects);
    saveToLocalStorage('projects', newProjects);
    saveData('projects', newProjects);
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return { ...project, ...updates };
      }
      return project;
    });
    setProjects(updatedProjects);
    saveToLocalStorage('projects', updatedProjects);
    saveData('projects', updatedProjects);
  };

  const deleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(project => project.id !== projectId);
    setProjects(updatedProjects);
    saveToLocalStorage('projects', updatedProjects);
    saveData('projects', updatedProjects);
  };

  const addProjectHours = (projectId: string, hours: number) => {
    if (isSaved) return;

    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        const existingLogIndex = project.hoursLog.findIndex(log => log.date === currentDate);
        let updatedLogs;

        if (existingLogIndex >= 0) {
          updatedLogs = [...project.hoursLog];
          updatedLogs[existingLogIndex] = {
            date: currentDate,
            hours: Math.max(0, Math.min(12, hours))
          };
        } else {
          updatedLogs = [...project.hoursLog, {
            date: currentDate,
            hours: Math.max(0, Math.min(12, hours))
          }];
        }

        return { ...project, hoursLog: updatedLogs };
      }
      return project;
    });

    setProjects(updatedProjects);
    saveData('projects', updatedProjects);

    // Update history
    const progress = calculateDailyProgress(
      tasks,
      outreachPitches,
      projectHours,
      advanceProjectHours,
      updatedProjects
    );
    const isStreakDay = progress >= 80;

    const updatedHistory = history.map(record => {
      if (record.date === currentDate) {
        return {
          ...record,
          tasks,
          progress,
          isStreakDay,
          outreachPitches,
          projectHours,
          advanceProjectHours,
          customProjectHours: getTodayProjectHours()
        };
      }
      return record;
    });

    const uniqueHistory = updatedHistory.filter((record, index, self) =>
      index === self.findIndex(r => r.date === record.date)
    );

    setHistory(uniqueHistory);
  };

  const saveDayProgress = () => {
    const progress = calculateDailyProgress(
      tasks,
      outreachPitches,
      projectHours,
      advanceProjectHours,
      projects
    );
    const isStreakDay = progress >= 80;

    const updatedHistory = history.map(record => {
      if (record.date === currentDate) {
        return {
          ...record,
          tasks: [...tasks],
          progress,
          isStreakDay,
          isSaved: true,
          outreachPitches,
          projectHours,
          advanceProjectHours,
          customProjectHours: getTodayProjectHours()
        };
      }
      return record;
    });

    const uniqueHistory = updatedHistory.filter((record, index, self) =>
      index === self.findIndex(r => r.date === record.date)
    );

    setHistory(uniqueHistory);
    setIsSaved(true);
    saveToLocalStorage('history', uniqueHistory);
    saveData('history', uniqueHistory);
  };

  const streak = calculateStreak(history);
  const weeklyProgress = calculateWeeklyProgress(history);
  const monthlyProgress = calculateMonthlyProgress(history);
  const overallProgress = calculateOverallProgress(history);
  const currentProgress = calculateDailyProgress(
    tasks,
    outreachPitches,
    projectHours,
    advanceProjectHours,
    projects
  );

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark'
      ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-gray-100'
      : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
      }`}>
      <header className={`transition-colors duration-300 ${theme === 'dark'
        ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white border-b border-gray-800'
        : 'bg-gradient-to-r from-gray-700 to-gray-800 text-white border-b border-gray-300'
        } shadow-xl`}>
        <div className="px-8 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h1 className={`text-4xl font-bold tracking-tight ${theme === 'dark'
                ? 'bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400'
                : 'bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300'
                }`}>
                DISCIPLINE TRACKER
              </h1>
              <p className={`mt-2 text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-300'
                }`}>
                Execution • Consistency • Progress
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Migration Button */}
              {migrationStatus !== 'success' && (
                <button
                  onClick={async () => {
                    setMigrationStatus('migrating');
                    setMigrationMessage('Starting migration...');
                    const backup = createBackup();
                    if (backup) {
                      const success = await migrateToMongoDB(backup);
                      if (success) {
                        setMigrationStatus('success');
                        setMigrationMessage('Migration complete!');
                      } else {
                        setMigrationStatus('error');
                        setMigrationMessage('Migration failed');
                      }
                    }
                  }}
                  disabled={migrationStatus === 'migrating'}
                  className={`p-3 rounded-xl transition-all duration-300 flex items-center gap-2 ${migrationStatus === 'migrating'
                      ? 'bg-yellow-600 text-white cursor-wait'
                      : migrationStatus === 'error'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : theme === 'dark'
                          ? 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-500'
                          : 'bg-blue-500 text-white hover:bg-blue-600 border border-blue-400'
                    }`}
                  title={migrationMessage || 'Migrate data to MongoDB'}
                >
                  <span className="text-base font-medium">
                    {migrationStatus === 'migrating' ? '⏳ Migrating...' : '📤 Migrate to DB'}
                  </span>
                </button>
              )}

              <button
                onClick={toggleTheme}
                className={`p-3 rounded-xl transition-all duration-300 flex items-center gap-2 ${theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  : 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600'
                  }`}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              >
                {theme === 'dark' ? (
                  <>
                    <FiSun className="w-6 h-6" />
                    <span className="text-base font-medium">Light Mode</span>
                  </>
                ) : (
                  <>
                    <FiMoon className="w-6 h-6" />
                    <span className="text-base font-medium">Dark Mode</span>
                  </>
                )}
              </button>

              <div className={`backdrop-blur-sm rounded-xl px-4 py-3 text-center border ${theme === 'dark'
                ? 'bg-black/30 border-gray-700'
                : 'bg-white/10 border-white/30'
                }`}>
                <div className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-200'
                  }`}>
                  DAILY WEIGHTS
                </div>
                <div className="text-base text-white font-bold mt-1">
                  25% • 25% • 30% • 12% • 8%
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-8 py-8">
        {!isClient || !currentDate ? (
          <div className="flex items-center justify-center h-64">
            <div className={`text-xl ${theme === 'dark' ? 'text-gray-400 animate-pulse' : 'text-gray-600 animate-pulse'}`}>
              Loading...
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">{/* Left Column - Dashboard & Outreach */}
              <div className="xl:col-span-8 space-y-8">
                <Dashboard
                  currentDate={currentDate}
                  progress={overallProgress}
                  streak={streak}
                  weeklyProgress={weeklyProgress}
                  monthlyProgress={monthlyProgress}
                  theme={theme}
                  history={history}
                />

                <OutreachDetails
                  pitches={outreachPitches}
                  allTimePitches={allTimePitches}
                  onUpdatePitches={updateOutreachPitches}
                  isSaved={isSaved}
                  theme={theme}
                  date={currentDate}
                />
              </div>

              {/* Right Column - Tasks & Projects */}
              <div className="xl:col-span-4 space-y-8">
                <TaskManager
                  tasks={tasks}
                  onToggleTask={toggleTask}
                  progress={currentProgress}
                  date={currentDate}
                  isSaved={isSaved}
                  onSave={saveDayProgress}
                  theme={theme}
                  projectHours={projectHours}
                  advanceProjectHours={advanceProjectHours}
                  onUpdateProjectHours={updateProjectHours}
                  onUpdateAdvanceProjectHours={updateAdvanceProjectHours}
                />

                <ProjectManager
                  projects={projects}
                  onAddProject={addProject}
                  onUpdateProject={updateProject}
                  onDeleteProject={deleteProject}
                  onAddHours={addProjectHours}
                  currentDate={currentDate}
                  isSaved={isSaved}
                  theme={theme}
                />
              </div>
            </div>

            {/* Full Width History Log */}
            <div className="mt-8">
              <HistoryTable
                history={history}
                currentDate={currentDate}
                onDateSelect={setCurrentDate}
                theme={theme}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;