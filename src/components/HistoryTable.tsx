// src/components/HistoryTable.tsx - Updated with theme prop
import React from 'react';
import { DailyRecord } from '../types';

interface HistoryTableProps {
  history: DailyRecord[];
  currentDate: string;
  onDateSelect: (date: string) => void;
  theme: 'light' | 'dark';
}

const HistoryTable: React.FC<HistoryTableProps> = ({ history, currentDate, onDateSelect, theme }) => {
  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getProgressColorClass = (progress: number, isSaved: boolean) => {
    if (!isSaved) {
      return theme === 'dark' 
        ? 'bg-gray-800 text-gray-300 border-gray-700' 
        : 'bg-gray-100 text-gray-700 border-gray-300';
    }
    if (progress >= 80) {
      return theme === 'dark'
        ? 'bg-gradient-to-r from-emerald-900/40 to-emerald-800/30 text-emerald-300 border-emerald-800'
        : 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border-emerald-300';
    }
    if (progress >= 60) {
      return theme === 'dark'
        ? 'bg-gradient-to-r from-amber-900/40 to-amber-800/30 text-amber-300 border-amber-800'
        : 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-amber-300';
    }
    return theme === 'dark'
      ? 'bg-gradient-to-r from-rose-900/40 to-rose-800/30 text-rose-300 border-rose-800'
      : 'bg-gradient-to-r from-rose-50 to-rose-100 text-rose-800 border-rose-300';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`rounded-2xl shadow-xl border h-full transition-colors duration-300 ${
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
            <h2 className="text-2xl font-bold text-white">HISTORY LOG</h2>
            <p className={`mt-1 text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-300'
            }`}>
              Track your discipline journey over time
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{history.length}</div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-300'
            }`}>
              Days Tracked
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Table */}
        <div className={`overflow-x-auto rounded-xl border ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <table className="min-w-full divide-y">
            <thead className={`${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-gray-800 to-gray-900 divide-gray-700' 
                : 'bg-gradient-to-r from-gray-50 to-gray-100 divide-gray-200'
            }`}>
              <tr>
                <th className={`py-4 px-4 text-left text-xs font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  DATE
                </th>
                <th className={`py-4 px-4 text-left text-xs font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  DAY
                </th>
                <th className={`py-4 px-4 text-left text-xs font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  PROGRESS
                </th>
                <th className={`py-4 px-4 text-left text-xs font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
            }`}>
              {sortedHistory.map((record, index) => {
                const isToday = record.date === currentDate;
                const streakCount = record.isStreakDay ? 
                  Math.min(index + 1, history.filter(h => h.isStreakDay).length) : 0;
                
                return (
                  <tr 
                    key={record.date}
                    className={`transition-all cursor-pointer hover:opacity-90 ${
                      isToday 
                        ? theme === 'dark'
                          ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30'
                          : 'bg-gradient-to-r from-blue-50 to-indigo-50'
                        : ''
                    }`}
                    onClick={() => onDateSelect(record.date)}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isToday 
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold' 
                            : theme === 'dark'
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-100 text-gray-600'
                        }`}>
                          {formatDate(record.date).split(' ')[1]}
                        </div>
                        <div>
                          <div className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {formatDate(record.date)}
                          </div>
                          {isToday && (
                            <div className={`text-xs font-bold mt-0.5 ${
                              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                            }`}>
                              SELECTED
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className={`text-sm font-bold ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {record.dayOfWeek.toUpperCase()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getProgressColorClass(record.progress, record.isSaved || false)}`}>
                          {record.progress}%
                        </span>
                        {record.isStreakDay && streakCount > 0 && (
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 flex items-center justify-center">
                              <span className="text-xs font-bold text-white">{streakCount}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-between">
                        <div className={`text-sm font-bold ${
                          record.isSaved 
                            ? record.progress >= 80 
                              ? theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                              : record.progress >= 60 
                                ? theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                                : theme === 'dark' ? 'text-rose-400' : 'text-rose-600'
                            : theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                        }`}>
                          {record.isSaved 
                            ? record.progress >= 80 
                              ? 'COMPLETED' 
                              : record.progress >= 60 
                                ? 'PARTIAL' 
                                : 'INCOMPLETE'
                            : 'EDITABLE'}
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          record.isSaved 
                            ? record.progress >= 80 
                              ? 'bg-emerald-500' 
                              : record.progress >= 60 
                                ? 'bg-amber-500' 
                                : 'bg-rose-500'
                            : 'bg-blue-500'
                        }`}></div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Stats Summary */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className={`rounded-xl p-4 border ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700'
              : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
          }`}>
            <div className={`text-xs font-bold mb-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              TOTAL DAYS
            </div>
            <div className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {history.length}
            </div>
          </div>
          <div className={`rounded-xl p-4 border ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-emerald-900/40 to-emerald-800/30 border-emerald-800'
              : 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-300'
          }`}>
            <div className={`text-xs font-bold mb-1 ${
              theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
            }`}>
              STREAK DAYS
            </div>
            <div className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-emerald-300' : 'text-emerald-800'
            }`}>
              {history.filter(h => h.isStreakDay).length}
            </div>
          </div>
          <div className={`rounded-xl p-4 border ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-blue-900/40 to-blue-800/30 border-blue-800'
              : 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300'
          }`}>
            <div className={`text-xs font-bold mb-1 ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}>
              AVG. PROGRESS
            </div>
            <div className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-800'
            }`}>
              {history.length > 0 
                ? Math.round(history.reduce((sum, h) => sum + h.progress, 0) / history.length) 
                : 0}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryTable;