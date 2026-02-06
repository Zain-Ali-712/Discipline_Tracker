// src/components/Dashboard.tsx - Updated with weekly chart labels
import React from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { DailyRecord } from '../types';

interface DashboardProps {
  currentDate: string;
  progress: number;
  streak: number;
  weeklyProgress: number;
  monthlyProgress: number;
  theme: 'light' | 'dark';
  history: DailyRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({
  currentDate,
  progress,
  streak,
  weeklyProgress,
  monthlyProgress,
  theme,
  history
}) => {
  const getProgressColor = (value: number) => {
    if (value >= 80) return theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';
    if (value >= 60) return theme === 'dark' ? 'text-amber-400' : 'text-amber-600';
    return theme === 'dark' ? 'text-rose-400' : 'text-rose-600';
  };

  const getTrendIcon = (value: number) => {
    return value >= 80 ? <FiTrendingUp className="w-6 h-6" /> : <FiTrendingDown className="w-6 h-6" />;
  };

  const getTrendColor = (value: number) => {
    if (value >= 80) return theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';
    return theme === 'dark' ? 'text-rose-400' : 'text-rose-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get last 7 days of progress data for the chart
  const getChartData = () => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6); // Get 7 days total including today
    
    const filteredHistory = history
      .filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= sevenDaysAgo && recordDate <= today;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Fill in missing days with 0% progress
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const record = filteredHistory.find(r => r.date === dateStr);
      
      chartData.push({
        date: dateStr,
        displayDate: date.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        progress: record ? record.progress : 0
      });
    }
    
    return chartData;
  };

  const chartData = getChartData();
  const maxProgress = Math.max(...chartData.map(d => d.progress), 100);

  return (
    <div className={`rounded-3xl border-2 shadow-2xl transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
        : 'bg-gradient-to-br from-white to-gray-50 border-gray-300'
    }`}>
      {/* Header */}
      <div className={`p-6 border-b ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white border-gray-700'
          : 'bg-gradient-to-r from-gray-700 to-gray-800 text-white border-gray-200'
      }`}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">PROGRESS DASHBOARD</h2>
            <p className={`text-lg mt-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-300'
            }`}>
              {formatDate(currentDate)}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${getProgressColor(progress)}`}>
              {progress}%
            </div>
            <div className={`text-base ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-300'
            }`}>
              Overall Progress
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Main Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <div className={`text-lg font-bold ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}>
              Today's Progress
            </div>
            <div className={`text-xl font-bold flex items-center gap-2 ${getProgressColor(progress)}`}>
              {progress}% {getTrendIcon(progress)}
            </div>
          </div>
          <div className={`h-4 rounded-full overflow-hidden ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
          }`}>
            <div 
              className={`h-full transition-all duration-1000 ease-out ${
                progress >= 80 
                  ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300' 
                  : progress >= 60 
                    ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300' 
                    : 'bg-gradient-to-r from-rose-500 via-rose-400 to-rose-300'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className={`flex justify-between text-base mt-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <span>0%</span>
            <span className="font-bold">80% Target</span>
            <span>100%</span>
          </div>
        </div>

        {/* 7-Day Progress Chart - Filled Area Chart */}
        <div className={`mb-8 p-5 rounded-2xl border ${
          theme === 'dark' 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-xl font-bold mb-4 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`}>
            Weekly Progress Chart
          </h3>
          <div className="h-48">
            {/* Y-axis labels */}
            <div className="flex h-full">
              <div className={`flex flex-col justify-between mr-3 text-right ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {[100, 80, 60, 40, 20, 0].map(value => (
                  <div key={value} className="text-sm font-medium">
                    {value}%
                  </div>
                ))}
              </div>
              
              {/* Chart area */}
              <div className="flex-1 relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`h-px w-full ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                    }`}></div>
                  ))}
                </div>
                
                {/* Filled area chart */}
                <div className="absolute inset-0">
                  {/* Create SVG path for filled area */}
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    {/* Background fill area */}
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={progress >= 80 ? "#10B981" : progress >= 60 ? "#F59E0B" : "#EF4444"} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={progress >= 80 ? "#10B981" : progress >= 60 ? "#F59E0B" : "#EF4444"} stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                    
                    {/* Create path for area fill */}
                    {chartData.length > 0 && (
                      <>
                        {/* Area fill */}
                        <path
                          d={(() => {
                            const points = chartData.map((data, index) => {
                              const x = (index / (chartData.length - 1)) * 100;
                              const y = 100 - (data.progress / maxProgress) * 100;
                              return `${x},${y}`;
                            }).join(' ');
                            
                            return `M 0,100 L ${points} L 100,100 Z`;
                          })()}
                          fill="url(#progressGradient)"
                          stroke="none"
                        />
                        
                        {/* Line */}
                        <path
                          d={(() => {
                            const points = chartData.map((data, index) => {
                              const x = (index / (chartData.length - 1)) * 100;
                              const y = 100 - (data.progress / maxProgress) * 100;
                              return `${x},${y}`;
                            }).join(' ');
                            
                            return `M ${points}`;
                          })()}
                          fill="none"
                          stroke={progress >= 80 ? "#10B981" : progress >= 60 ? "#F59E0B" : "#EF4444"}
                          strokeWidth="0.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        
                        {/* Data points */}
                        {chartData.map((data, index) => {
                          const x = (index / (chartData.length - 1)) * 100;
                          const y = 100 - (data.progress / maxProgress) * 100;

                          return (
                            <circle
                              key={data.date}
                              cx={x}
                              cy={y}
                              r="1"
                              fill={data.progress >= 80 ? "#10B981" : data.progress >= 60 ? "#F59E0B" : "#EF4444"}
                              stroke={theme === 'dark' ? "#1F2937" : "#FFFFFF"}
                              strokeWidth="0.5"
                            />
                          );
                        })}
                      </>
                    )}
                  </svg>
                </div>
              </div>
            </div>
            
            {/* X-axis labels */}
            <div className={`flex justify-between mt-2 px-0  ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {chartData.map((data, index) => (
                <div key={data.date} className="text-center" style={{ width: `${100 / chartData.length}%` }}>
                  <div className="text-s font-medium">
                    {data.displayDate}
                  </div>
                  <div className="text-s">
                    {data.fullDate}
                  </div>
                  <div className={`text-s font-bold mt-1 ${
                    data.progress >= 80 ? 'text-emerald-500' : 
                    data.progress >= 60 ? 'text-amber-500' : 
                    'text-rose-500'
                  }`}>
                    {data.progress}%
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Summary stats below chart */}
          <div className={`grid grid-cols-3 gap-4 mt-24 pt-4 border-t ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
          }`}>
            <div className="text-center">
              <div className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Week Avg
              </div>
              <div className={`text-lg font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {chartData.length > 0 
                  ? Math.round(chartData.reduce((sum, d) => sum + d.progress, 0) / chartData.length)
                  : 0}%
              </div>
            </div>
            <div className="text-center">
              <div className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Best Day
              </div>
              <div className={`text-lg font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {Math.max(...chartData.map(d => d.progress))}%
              </div>
            </div>
            <div className="text-center">
              <div className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Active Days
              </div>
              <div className={`text-lg font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {chartData.filter(d => d.progress > 0).length}/7
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Streak */}
          <div className={`rounded-xl p-5 border-2 ${
            streak > 0 
              ? theme === 'dark' 
                ? 'border-emerald-700 bg-emerald-900/20' 
                : 'border-emerald-300 bg-emerald-50'
              : theme === 'dark' 
                ? 'border-gray-700 bg-gray-800/50' 
                : 'border-gray-300 bg-gray-100'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`text-base font-bold ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                STREAK
              </div>
              <div className={`text-lg ${getTrendColor(streak > 0 ? 80 : 0)}`}>
                {getTrendIcon(streak > 0 ? 80 : 0)}
              </div>
            </div>
            <div className={`text-3xl font-bold mb-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {streak}
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {streak === 1 ? 'Active day' : 'Consecutive days'}
            </div>
          </div>

          {/* Weekly */}
          <div className={`rounded-xl p-5 border-2 ${
            weeklyProgress >= 80 
              ? theme === 'dark' 
                ? 'border-emerald-700 bg-emerald-900/20' 
                : 'border-emerald-300 bg-emerald-50'
              : weeklyProgress >= 60 
                ? theme === 'dark' 
                  ? 'border-amber-700 bg-amber-900/20' 
                  : 'border-amber-300 bg-amber-50'
                : theme === 'dark' 
                  ? 'border-rose-700 bg-rose-900/20' 
                  : 'border-rose-300 bg-rose-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`text-base font-bold ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                WEEKLY
              </div>
              <div className={`text-lg ${getTrendColor(weeklyProgress)}`}>
                {getTrendIcon(weeklyProgress)}
              </div>
            </div>
            <div className={`text-3xl font-bold mb-1 ${getProgressColor(weeklyProgress)}`}>
              {weeklyProgress}%
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              7-day average
            </div>
          </div>

          {/* Monthly */}
          <div className={`rounded-xl p-5 border-2 ${
            monthlyProgress >= 80 
              ? theme === 'dark' 
                ? 'border-emerald-700 bg-emerald-900/20' 
                : 'border-emerald-300 bg-emerald-50'
              : monthlyProgress >= 60 
                ? theme === 'dark' 
                  ? 'border-amber-700 bg-amber-900/20' 
                  : 'border-amber-300 bg-amber-50'
                : theme === 'dark' 
                  ? 'border-rose-700 bg-rose-900/20' 
                  : 'border-rose-300 bg-rose-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`text-base font-bold ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                MONTHLY
              </div>
              <div className={`text-lg ${getTrendColor(monthlyProgress)}`}>
                {getTrendIcon(monthlyProgress)}
              </div>
            </div>
            <div className={`text-3xl font-bold mb-1 ${getProgressColor(monthlyProgress)}`}>
              {monthlyProgress}%
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Current month
            </div>
          </div>

          {/* Consistency */}
          <div className={`rounded-xl p-5 border-2 ${
            progress >= 80 
              ? theme === 'dark' 
                ? 'border-emerald-700 bg-emerald-900/20' 
                : 'border-emerald-300 bg-emerald-50'
              : progress >= 60 
                ? theme === 'dark' 
                  ? 'border-amber-700 bg-amber-900/20' 
                  : 'border-amber-300 bg-amber-50'
                : theme === 'dark' 
                  ? 'border-rose-700 bg-rose-900/20' 
                  : 'border-rose-300 bg-rose-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`text-base font-bold ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                OVERALL
              </div>
              <div className={`text-lg ${getTrendColor(progress)}`}>
                {getTrendIcon(progress)}
              </div>
            </div>
            <div className={`text-3xl font-bold mb-1 ${getProgressColor(progress)}`}>
              {progress}%
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              All-time average
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;