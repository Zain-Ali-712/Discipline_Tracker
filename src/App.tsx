// src/App.tsx - With theme switching
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import HistoryTable from './components/HistoryTable';
import TaskManager from './components/TaskManager';
import ThemeToggle from './components/ThemeToggle';
import { Task, DailyRecord } from './types';
import { 
  calculateDailyProgress, 
  initializeDailyTasks, 
  calculateStreak, 
  calculateWeeklyProgress, 
  calculateMonthlyProgress 
} from './utils/calculations';
import { loadData, saveData, loadTheme, saveTheme } from './utils/storage';

const App: React.FC = () => {
  const [history, setHistory] = useState<DailyRecord[]>(() => {
    return loadData<DailyRecord[]>('history') || [];
  });
  
  const [currentDate, setCurrentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return loadTheme() || 'dark'; // Default to dark
  });

  const currentDayRecord = history.find(record => record.date === currentDate);
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (currentDayRecord) {
      return currentDayRecord.tasks;
    }
    return initializeDailyTasks(new Date(currentDate));
  });

  const [isSaved, setIsSaved] = useState<boolean>(() => {
    return currentDayRecord?.isSaved || false;
  });

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  // Load or initialize today's record
  useEffect(() => {
    const todayRecord = history.find(record => record.date === currentDate);
    if (!todayRecord) {
      const newTasks = initializeDailyTasks(new Date(currentDate));
      const newRecord: DailyRecord = {
        date: currentDate,
        dayOfWeek: new Date(currentDate).toLocaleDateString('en-US', { weekday: 'short' }),
        progress: 0,
        tasks: newTasks,
        isStreakDay: false,
        isSaved: false
      };
      setHistory(prev => [...prev, newRecord]);
      setTasks(newTasks);
      setIsSaved(false);
    } else {
      setTasks(todayRecord.tasks);
      setIsSaved(todayRecord.isSaved || false);
    }
  }, [currentDate, history]);

  const toggleTask = (taskId: string) => {
    if (isSaved) return;
    
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    setTasks(updatedTasks);
    
    const progress = calculateDailyProgress(updatedTasks);
    const isStreakDay = progress >= 80;
    
    const updatedHistory = history.map(record => {
      if (record.date === currentDate) {
        return {
          ...record,
          tasks: updatedTasks,
          progress,
          isStreakDay
        };
      }
      return record;
    });
    
    setHistory(updatedHistory);
  };

  const saveDayProgress = () => {
    const progress = calculateDailyProgress(tasks);
    const isStreakDay = progress >= 80;
    
    const updatedHistory = history.map(record => {
      if (record.date === currentDate) {
        return {
          ...record,
          tasks: [...tasks],
          progress,
          isStreakDay,
          isSaved: true
        };
      }
      return record;
    });
    
    setHistory(updatedHistory);
    setIsSaved(true);
    saveData('history', updatedHistory);
  };

  const streak = calculateStreak(history);
  const weeklyProgress = calculateWeeklyProgress(history);
  const monthlyProgress = calculateMonthlyProgress(history);
  const currentProgress = calculateDailyProgress(tasks);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100' 
        : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900'
    }`}>
      <header className={`transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white border-b border-gray-800'
          : 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white border-b border-gray-200'
      } shadow-2xl`}>
        <div className="px-6 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-3 md:mb-0">
              <h1 className={`text-3xl font-bold tracking-tight ${
                theme === 'dark'
                  ? 'bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300'
                  : 'bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-purple-100'
              }`}>
                DISCIPLINE TRACKER
              </h1>
              <p className={`mt-1 text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-indigo-200'
              }`}>
                Consistency • Execution • Discipline
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              
              <div className={`backdrop-blur-sm rounded-lg p-3 text-center border ${
                theme === 'dark'
                  ? 'bg-black/30 border-gray-700'
                  : 'bg-white/10 border-white/20'
              }`}>
                <div className={`text-xs font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-indigo-100'
                }`}>
                  DAILY WEIGHTS
                </div>
                <div className="text-sm text-white font-bold mt-0.5">
                  15 • 25 • 20 • 25 • 15
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Column - Dashboard & History (60% width) */}
          <div className="xl:col-span-7 space-y-6">
            <Dashboard
              currentDate={currentDate}
              progress={currentProgress}
              streak={streak}
              weeklyProgress={weeklyProgress}
              monthlyProgress={monthlyProgress}
              isSaved={isSaved}
              onSave={saveDayProgress}
              theme={theme}
            />
            
            <HistoryTable
              history={history}
              currentDate={currentDate}
              onDateSelect={setCurrentDate}
              theme={theme}
            />
          </div>
          
          {/* Right Column - Tasks (40% width) */}
          <div className="xl:col-span-5">
            <TaskManager
              tasks={tasks}
              onToggleTask={toggleTask}
              progress={currentProgress}
              date={currentDate}
              isSaved={isSaved}
              theme={theme}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;