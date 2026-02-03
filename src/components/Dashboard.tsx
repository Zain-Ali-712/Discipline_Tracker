// src/components/Dashboard.tsx - Updated with theme prop
import React from 'react';
import ProgressRing from './ProgressRing';

interface DashboardProps {
  currentDate: string;
  progress: number;
  streak: number;
  weeklyProgress: number;
  monthlyProgress: number;
  isSaved: boolean;
  onSave: () => void;
  theme: 'light' | 'dark';
}

const Dashboard: React.FC<DashboardProps> = ({
  currentDate,
  progress,
  streak,
  weeklyProgress,
  monthlyProgress,
  isSaved,
  onSave,
  theme
}) => {
  const getProgressColor = (value: number) => {
    if (value >= 80) return theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';
    if (value >= 60) return theme === 'dark' ? 'text-amber-400' : 'text-amber-600';
    return theme === 'dark' ? 'text-rose-400' : 'text-rose-600';
  };

  const getProgressBgColor = (value: number) => {
    if (value >= 80) return theme === 'dark' ? 'bg-gradient-to-br from-emerald-900/30 to-emerald-800/20' : 'bg-gradient-to-br from-emerald-50 to-emerald-100';
    if (value >= 60) return theme === 'dark' ? 'bg-gradient-to-br from-amber-900/30 to-amber-800/20' : 'bg-gradient-to-br from-amber-50 to-amber-100';
    return theme === 'dark' ? 'bg-gradient-to-br from-rose-900/30 to-rose-800/20' : 'bg-gradient-to-br from-rose-50 to-rose-100';
  };

  const getProgressBorderColor = (value: number) => {
    if (value >= 80) return theme === 'dark' ? 'border-emerald-800' : 'border-emerald-200';
    if (value >= 60) return theme === 'dark' ? 'border-amber-800' : 'border-amber-200';
    return theme === 'dark' ? 'border-rose-800' : 'border-rose-200';
  };

  return (
    <div className={`rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className={`p-6 border-b transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white border-gray-700'
          : 'bg-gradient-to-r from-gray-900 to-gray-800 text-white border-gray-200'
      }`}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">PROGRESS DASHBOARD</h2>
            <p className={`mt-1 text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-300'
            }`}>
              {new Date(currentDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${getProgressColor(progress)}`}>
              {progress}%
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-300'
            }`}>
              Daily Score
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Main Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <div className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
            }`}>
              Completion Progress
            </div>
            <div className="flex items-center space-x-3">
              <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                progress >= 80 
                  ? theme === 'dark' ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                  : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}>
                {progress >= 80 ? 'Streak Active' : 'Streak Inactive'}
              </div>
            </div>
          </div>
          <div className={`h-4 rounded-full overflow-hidden shadow-inner ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div 
              className={`h-full transition-all duration-1000 ease-out ${
                progress >= 80 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                  : progress >= 60 
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600' 
                    : 'bg-gradient-to-r from-rose-500 to-rose-600'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className={`flex justify-between text-sm mt-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <span>0%</span>
            <span className={`${progress >= 80 ? 'font-bold' : 'font-medium'} ${
              progress >= 80 ? getProgressColor(progress) : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              80% Threshold
            </span>
            <span>100%</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* Streak Card */}
          <div className={`rounded-xl p-5 border transition-transform hover:scale-[1.02] ${getProgressBorderColor(progress)} ${getProgressBgColor(progress)}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  CURRENT STREAK
                </div>
                <div className={`text-3xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {streak} days
                </div>
                <div className={`text-xs mt-2 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  ≥80% daily required
                </div>
              </div>
              <div className={`text-3xl ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-700'
              }`}>
                →
              </div>
            </div>
          </div>

          {/* Weekly Card */}
          <div className={`rounded-xl p-5 border transition-transform hover:scale-[1.02] ${getProgressBorderColor(weeklyProgress)} ${getProgressBgColor(weeklyProgress)}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  WEEKLY AVERAGE
                </div>
                <div className={`text-3xl font-bold ${getProgressColor(weeklyProgress)}`}>
                  {weeklyProgress}%
                </div>
                <div className={`text-xs mt-2 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  Last 7 days
                </div>
              </div>
              <ProgressRing progress={weeklyProgress} size={48} strokeWidth={6} theme={theme} />
            </div>
          </div>

          {/* Monthly Card */}
          <div className={`rounded-xl p-5 border transition-transform hover:scale-[1.02] ${getProgressBorderColor(monthlyProgress)} ${getProgressBgColor(monthlyProgress)}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  MONTHLY AVERAGE
                </div>
                <div className={`text-3xl font-bold ${getProgressColor(monthlyProgress)}`}>
                  {monthlyProgress}%
                </div>
                <div className={`text-xs mt-2 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  Current month
                </div>
              </div>
              <ProgressRing progress={monthlyProgress} size={48} strokeWidth={6} theme={theme} />
            </div>
          </div>
        </div>

        {/* Save Section */}
        <div className={`rounded-xl border p-5 transition-colors duration-300 ${
          isSaved 
            ? theme === 'dark' 
              ? 'bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-gray-600' 
              : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300'
            : theme === 'dark'
              ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-blue-800'
              : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex-1">
              <h3 className={`text-lg font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {isSaved ? 'DAY LOCKED' : 'READY TO LOCK DAY'}
              </h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {isSaved 
                  ? "Today's progress has been saved and locked. No further changes can be made." 
                  : "Once locked, today's progress becomes permanent. Make sure all tasks are correctly marked."}
              </p>
            </div>
            
            <button
              onClick={onSave}
              disabled={isSaved}
              className={`px-8 py-3 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 min-w-[140px] ${
                isSaved 
                  ? theme === 'dark'
                    ? 'bg-gradient-to-r from-gray-700 to-gray-800 cursor-not-allowed shadow-inner border border-gray-600'
                    : 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed shadow-inner'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-200 border border-indigo-700'
              }`}
            >
              {isSaved ? 'LOCKED' : 'LOCK DAY'}
            </button>
          </div>
          
          {!isSaved && (
            <div className={`mt-4 text-sm font-medium flex items-center ${
              theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
            }`}>
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              This action cannot be undone
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;