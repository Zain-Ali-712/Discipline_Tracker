// src/components/Dashboard.tsx - Enhanced modern design
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
}

const Dashboard: React.FC<DashboardProps> = ({
  currentDate,
  progress,
  streak,
  weeklyProgress,
  monthlyProgress,
  isSaved,
  onSave
}) => {
  const getProgressColor = (value: number) => {
    if (value >= 80) return 'text-emerald-600';
    if (value >= 60) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getProgressBgColor = (value: number) => {
    if (value >= 80) return 'bg-gradient-to-br from-emerald-50 to-emerald-100';
    if (value >= 60) return 'bg-gradient-to-br from-amber-50 to-amber-100';
    return 'bg-gradient-to-br from-rose-50 to-rose-100';
  };

  const getProgressBorderColor = (value: number) => {
    if (value >= 80) return 'border-emerald-200';
    if (value >= 60) return 'border-amber-200';
    return 'border-rose-200';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">PROGRESS DASHBOARD</h2>
            <p className="text-gray-300 mt-1 text-sm">
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
            <div className="text-gray-300 text-sm">Daily Score</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Main Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <div className="text-lg font-semibold text-gray-800">Completion Progress</div>
            <div className="flex items-center space-x-3">
              <div className={`text-sm font-medium px-3 py-1 rounded-full ${progress >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'}`}>
                {progress >= 80 ? 'Streak Active' : 'Streak Inactive'}
              </div>
            </div>
          </div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
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
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>0%</span>
            <span className={progress >= 80 ? 'text-emerald-600 font-bold' : 'font-medium'}>80% Threshold</span>
            <span>100%</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* Streak Card */}
          <div className={`rounded-xl p-5 border ${getProgressBorderColor(progress)} ${getProgressBgColor(progress)} transition-transform hover:scale-[1.02]`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">CURRENT STREAK</div>
                <div className="text-3xl font-bold text-gray-900">{streak} days</div>
                <div className="text-xs text-gray-500 mt-2">≥80% daily required</div>
              </div>
              <div className="text-3xl text-gray-700">→</div>
            </div>
          </div>

          {/* Weekly Card */}
          <div className={`rounded-xl p-5 border ${getProgressBorderColor(weeklyProgress)} ${getProgressBgColor(weeklyProgress)} transition-transform hover:scale-[1.02]`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">WEEKLY AVERAGE</div>
                <div className={`text-3xl font-bold ${getProgressColor(weeklyProgress)}`}>
                  {weeklyProgress}%
                </div>
                <div className="text-xs text-gray-500 mt-2">Last 7 days</div>
              </div>
              <ProgressRing progress={weeklyProgress} size={48} strokeWidth={6} />
            </div>
          </div>

          {/* Monthly Card */}
          <div className={`rounded-xl p-5 border ${getProgressBorderColor(monthlyProgress)} ${getProgressBgColor(monthlyProgress)} transition-transform hover:scale-[1.02]`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">MONTHLY AVERAGE</div>
                <div className={`text-3xl font-bold ${getProgressColor(monthlyProgress)}`}>
                  {monthlyProgress}%
                </div>
                <div className="text-xs text-gray-500 mt-2">Current month</div>
              </div>
              <ProgressRing progress={monthlyProgress} size={48} strokeWidth={6} />
            </div>
          </div>
        </div>

        {/* Save Section */}
        <div className={`rounded-xl border p-5 ${isSaved ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'}`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {isSaved ? 'DAY LOCKED' : 'READY TO LOCK DAY'}
              </h3>
              <p className="text-gray-600 text-sm">
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
                  ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed shadow-inner' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-200'
              }`}
            >
              {isSaved ? 'LOCKED' : 'LOCK DAY'}
            </button>
          </div>
          
          {!isSaved && (
            <div className="mt-4 text-sm text-amber-600 font-medium flex items-center">
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