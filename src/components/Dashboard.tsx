// src/components/Dashboard.tsx - Clean modern design without emojis
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
    if (value >= 80) return 'bg-emerald-50 border-emerald-200';
    if (value >= 60) return 'bg-amber-50 border-amber-200';
    return 'bg-rose-50 border-rose-200';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
      <div className="p-6">
        <div className="flex flex-col mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Today's Progress</h2>
          <p className="text-gray-600 text-lg">
            {new Date(currentDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Main Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="text-lg font-medium text-gray-700">Daily Completion</div>
            <div className={`text-3xl font-bold ${getProgressColor(progress)}`}>
              {progress}%
            </div>
          </div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-700 ${
                progress >= 80 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                  : progress >= 60 
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600' 
                    : 'bg-gradient-to-r from-rose-500 to-rose-600'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>0%</span>
            <span className={progress >= 80 ? 'text-emerald-600 font-medium' : ''}>80% Streak</span>
            <span>100%</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* Streak */}
          <div className={`rounded-xl p-4 border ${getProgressBgColor(progress)}`}>
            <div className="text-sm text-gray-600 font-medium mb-1">Streak</div>
            <div className="text-2xl font-bold text-gray-900">{streak} days</div>
            <div className="text-xs text-gray-500 mt-1">≥80% maintains</div>
          </div>

          {/* Weekly */}
          <div className={`rounded-xl p-4 border ${getProgressBgColor(weeklyProgress)}`}>
            <div className="text-sm text-gray-600 font-medium mb-1">Weekly</div>
            <div className={`text-2xl font-bold ${getProgressColor(weeklyProgress)}`}>
              {weeklyProgress}%
            </div>
            <div className="text-xs text-gray-500 mt-1">7-day avg</div>
          </div>

          {/* Monthly */}
          <div className={`rounded-xl p-4 border ${getProgressBgColor(monthlyProgress)}`}>
            <div className="text-sm text-gray-600 font-medium mb-1">Monthly</div>
            <div className={`text-2xl font-bold ${getProgressColor(monthlyProgress)}`}>
              {monthlyProgress}%
            </div>
            <div className="text-xs text-gray-500 mt-1">Current month</div>
          </div>
        </div>

        {/* Save Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {isSaved ? 'Day Locked' : 'Ready to Save'}
              </h3>
              <p className="text-gray-600 text-sm">
                {isSaved 
                  ? "Progress saved and locked for editing" 
                  : "Save to lock today's progress"}
              </p>
            </div>
            
            <button
              onClick={onSave}
              disabled={isSaved}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                isSaved 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
              }`}
            >
              {isSaved ? 'Locked' : 'Save Progress'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;