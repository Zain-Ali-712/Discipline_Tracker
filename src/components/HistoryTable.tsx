// src/components/HistoryTable.tsx - Updated with full width and 7-day limit
import React, { useState } from 'react';
import { DailyRecord } from '../types';
import { FiCalendar, FiTrendingUp, FiTrendingDown, FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface HistoryTableProps {
  history: DailyRecord[];
  currentDate: string;
  onDateSelect: (date: string) => void;
  theme: 'light' | 'dark';
}

const HistoryTable: React.FC<HistoryTableProps> = ({ history, currentDate, onDateSelect, theme }) => {
  const [showAllHistory, setShowAllHistory] = useState(false);
  
  const uniqueHistory = history.filter((record, index, self) =>
    index === self.findIndex(r => r.date === record.date)
  ).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Get last 7 days or all history based on toggle
  const displayedHistory = showAllHistory ? uniqueHistory : uniqueHistory.slice(0, 7);

  const getProgressColorClass = (progress: number) => {
    if (progress >= 80) {
      return theme === 'dark'
        ? 'bg-emerald-900/30 text-emerald-300'
        : 'bg-emerald-100 text-emerald-800';
    }
    if (progress >= 60) {
      return theme === 'dark'
        ? 'bg-amber-900/30 text-amber-300'
        : 'bg-amber-100 text-amber-800';
    }
    return theme === 'dark'
      ? 'bg-rose-900/30 text-rose-300'
      : 'bg-rose-100 text-rose-800';
  };

  const getTaskProgressColor = (value: number) => {
    if (value >= 80) return theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';
    if (value >= 60) return theme === 'dark' ? 'text-amber-400' : 'text-amber-600';
    return theme === 'dark' ? 'text-rose-400' : 'text-rose-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Calculate task progress for each day
  const calculateTaskProgress = (record: DailyRecord, taskId: string) => {
    const task = record.tasks.find(t => t.id === taskId);
    if (!task) return 0;
    
    if (task.id === 'outreach' && record.outreachPitches) {
      const totalPitches = Object.values(record.outreachPitches).reduce((a, b) => a + b, 0);
      return Math.min((totalPitches / 5) * 100, 140);
    }
    
    if (task.id === 'project' && record.projectHours !== undefined) {
      return Math.min((record.projectHours / 2) * 100, 200);
    }
    
    if (task.id === 'advance-project' && record.advanceProjectHours !== undefined) {
      return Math.min((record.advanceProjectHours / 3) * 100, 133);
    }
    
    return task.completed ? 100 : 0;
  };

  return (
    <div className={`rounded-3xl border-2 shadow-xl transition-colors duration-300 ${
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FiCalendar className="w-6 h-6" />
            <div>
              <h3 className="text-xl font-bold">HISTORY LOG</h3>
              <p className={`text-lg mt-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-300'
              }`}>
                {uniqueHistory.length} days tracked • Showing {displayedHistory.length} days
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-300'
            }`}>
              Avg: {uniqueHistory.length > 0 
                ? Math.round(uniqueHistory.reduce((sum, h) => sum + h.progress, 0) / uniqueHistory.length) 
                : 0}%
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* History Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
              }`}>
                <th className={`text-left py-3 px-4 font-semibold ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>Date</th>
                <th className={`text-left py-3 px-4 font-semibold ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>Outreach</th>
                <th className={`text-left py-3 px-4 font-semibold ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>Project</th>
                <th className={`text-left py-3 px-4 font-semibold ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>Adv. Project</th>
                <th className={`text-left py-3 px-4 font-semibold ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>Learning</th>
                <th className={`text-left py-3 px-4 font-semibold ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>Scrolling</th>
                <th className={`text-left py-3 px-4 font-semibold ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>Overall</th>
                <th className={`text-left py-3 px-4 font-semibold ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>Trend</th>
              </tr>
            </thead>
            <tbody>
              {displayedHistory.length === 0 ? (
                <tr>
                  <td colSpan={8} className={`py-8 text-center ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    No history yet. Start tracking your progress!
                  </td>
                </tr>
              ) : (
                displayedHistory.map((record) => {
                  const isToday = record.date === currentDate;
                  const outreachProgress = calculateTaskProgress(record, 'outreach');
                  const projectProgress = calculateTaskProgress(record, 'project');
                  const advanceProgress = calculateTaskProgress(record, 'advance-project');
                  const learningTask = record.tasks.find(t => t.id === 'learning');
                  const scrollingTask = record.tasks.find(t => t.id === 'scrolling');
                  
                  return (
                    <tr 
                      key={record.date}
                      className={`cursor-pointer transition-all ${
                        isToday 
                          ? theme === 'dark'
                            ? 'bg-blue-900/20'
                            : 'bg-blue-50'
                          : `hover:${theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-50'}`
                      } ${record.date !== displayedHistory[displayedHistory.length - 1].date ? `border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}` : ''}`}
                      onClick={() => onDateSelect(record.date)}
                    >
                      <td className={`py-3 px-4 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                      }`}>
                        <div className="font-medium">{formatDate(record.date)}</div>
                        <div className={`text-sm ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          {getDayName(record.date)}
                        </div>
                      </td>
                      
                      {/* Outreach Column */}
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className={`w-16 h-2 rounded-full overflow-hidden ${
                            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                          }`}>
                            <div 
                              className={`h-full ${
                                outreachProgress >= 100 ? 'bg-emerald-500' : 
                                outreachProgress >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.min(outreachProgress, 100)}%` }}
                            ></div>
                          </div>
                          <span className={`ml-2 text-sm font-bold ${getTaskProgressColor(outreachProgress)}`}>
                            {Math.round(outreachProgress)}%
                          </span>
                        </div>
                      </td>
                      
                      {/* Project Column */}
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className={`w-16 h-2 rounded-full overflow-hidden ${
                            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                          }`}>
                            <div 
                              className={`h-full ${
                                projectProgress >= 100 ? 'bg-emerald-500' : 
                                projectProgress >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.min(projectProgress, 100)}%` }}
                            ></div>
                          </div>
                          <span className={`ml-2 text-sm font-bold ${getTaskProgressColor(projectProgress)}`}>
                            {Math.round(projectProgress)}%
                          </span>
                        </div>
                      </td>
                      
                      {/* Advanced Project Column */}
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className={`w-16 h-2 rounded-full overflow-hidden ${
                            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                          }`}>
                            <div 
                              className={`h-full ${
                                advanceProgress >= 100 ? 'bg-emerald-500' : 
                                advanceProgress >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.min(advanceProgress, 100)}%` }}
                            ></div>
                          </div>
                          <span className={`ml-2 text-sm font-bold ${getTaskProgressColor(advanceProgress)}`}>
                            {Math.round(advanceProgress)}%
                          </span>
                        </div>
                      </td>
                      
                      {/* Learning Column */}
                      <td className="py-3 px-4">
                        <div className={`text-lg ${
                          learningTask?.completed 
                            ? theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                            : theme === 'dark' ? 'text-rose-400' : 'text-rose-600'
                        }`}>
                          {learningTask?.completed ? '✓' : '✗'}
                        </div>
                      </td>
                      
                      {/* Scrolling Column */}
                      <td className="py-3 px-4">
                        <div className={`text-lg ${
                          scrollingTask?.completed 
                            ? theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                            : theme === 'dark' ? 'text-rose-400' : 'text-rose-600'
                        }`}>
                          {scrollingTask?.completed ? '✓' : '✗'}
                        </div>
                      </td>
                      
                      {/* Overall Progress Column */}
                      <td className="py-3 px-4">
                        <div className={`px-3 py-1 rounded-full text-sm font-bold ${getProgressColorClass(record.progress)}`}>
                          {record.progress}%
                        </div>
                      </td>
                      
                      {/* Trend Column */}
                      <td className="py-3 px-4">
                        <div className={`text-xl ${
                          record.progress >= 80 
                            ? theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                            : theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                        }`}>
                          {record.progress >= 80 ? <FiTrendingUp /> : <FiTrendingDown />}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Show More/Less Button */}
        {uniqueHistory.length > 7 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowAllHistory(!showAllHistory)}
              className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {showAllHistory ? (
                <>
                  <FiChevronUp className="w-5 h-5" />
                  Show Less (Last 7 Days)
                </>
              ) : (
                <>
                  <FiChevronDown className="w-5 h-5" />
                  Show All History ({uniqueHistory.length} Days)
                </>
              )}
            </button>
          </div>
        )}

        {/* Summary */}
        <div className={`mt-6 p-5 rounded-xl border-2 ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700'
            : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
        }`}>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <div className={`text-base font-bold mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                TOTAL DAYS
              </div>
              <div className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {uniqueHistory.length}
              </div>
            </div>
            <div>
              <div className={`text-base font-bold mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                STREAK DAYS
              </div>
              <div className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {uniqueHistory.filter(h => h.isStreakDay).length}
              </div>
            </div>
            <div>
              <div className={`text-base font-bold mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                BEST DAY
              </div>
              <div className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {uniqueHistory.length > 0 
                  ? Math.max(...uniqueHistory.map(h => h.progress)) 
                  : 0}%
              </div>
            </div>
            <div>
              <div className={`text-base font-bold mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                CONSISTENCY
              </div>
              <div className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {uniqueHistory.length > 0 
                  ? Math.round((uniqueHistory.filter(h => h.progress >= 80).length / uniqueHistory.length) * 100)
                  : 0}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryTable;