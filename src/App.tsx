// src/App.tsx - Updated layout
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import HistoryTable from './components/HistoryTable';
import TaskManager from './components/TaskManager';
import { Task, DailyRecord } from './types';
import { 
  calculateDailyProgress, 
  initializeDailyTasks, 
  calculateStreak, 
  calculateWeeklyProgress, 
  calculateMonthlyProgress 
} from './utils/calculations';
import { loadData, saveData } from './utils/storage';

const App: React.FC = () => {
  const [history, setHistory] = useState<DailyRecord[]>(() => {
    return loadData<DailyRecord[]>('history') || [];
  });
  
  const [currentDate, setCurrentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg">
        <div className="px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h1 className="text-4xl font-bold tracking-tight">Discipline Tracker</h1>
              <p className="text-indigo-100 mt-2 text-lg">Track Consistency • Build Discipline</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-lg text-indigo-100 font-medium">Daily Weights</div>
              <div className="text-sm text-white font-semibold mt-1">
                15% • 25% • 20% • 25% • 15%
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Tasks (Full Height) */}
          <div className="xl:col-span-2">
            <TaskManager
              tasks={tasks}
              onToggleTask={toggleTask}
              progress={currentProgress}
              date={currentDate}
              isSaved={isSaved}
            />
          </div>
          
          {/* Right Column - Dashboard & History */}
          <div className="space-y-8">
            <Dashboard
              currentDate={currentDate}
              progress={currentProgress}
              streak={streak}
              weeklyProgress={weeklyProgress}
              monthlyProgress={monthlyProgress}
              isSaved={isSaved}
              onSave={saveDayProgress}
            />
            
            <HistoryTable
              history={history}
              currentDate={currentDate}
              onDateSelect={setCurrentDate}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;