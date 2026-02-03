// src/components/HistoryTable.tsx - Enhanced modern design
import React from 'react';
import { DailyRecord } from '../types';

interface HistoryTableProps {
  history: DailyRecord[];
  currentDate: string;
  onDateSelect: (date: string) => void;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ history, currentDate, onDateSelect }) => {
  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getProgressColorClass = (progress: number, isSaved: boolean) => {
    if (!isSaved) return 'bg-gray-100 text-gray-700 border-gray-300';
    if (progress >= 80) return 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border-emerald-300';
    if (progress >= 60) return 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-amber-300';
    return 'bg-gradient-to-r from-rose-50 to-rose-100 text-rose-800 border-rose-300';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDayStatusIcon = (progress: number, isSaved: boolean) => {
    if (!isSaved) return '✏️';
    if (progress >= 80) return '✅';
    if (progress >= 60) return '⚠️';
    return '❌';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">HISTORY LOG</h2>
            <p className="text-gray-300 mt-1 text-sm">Track your discipline journey over time</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{history.length}</div>
            <div className="text-gray-300 text-sm">Days Tracked</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  DATE
                </th>
                <th className="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  DAY
                </th>
                <th className="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  PROGRESS
                </th>
                <th className="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedHistory.map((record, index) => {
                const isToday = record.date === currentDate;
                const streakCount = record.isStreakDay ? 
                  Math.min(index + 1, history.filter(h => h.isStreakDay).length) : 0;
                
                return (
                  <tr 
                    key={record.date}
                    className={`transition-all cursor-pointer hover:bg-gray-50 ${
                      isToday ? 'bg-gradient-to-r from-blue-50 to-indigo-50' : ''
                    }`}
                    onClick={() => onDateSelect(record.date)}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isToday 
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {formatDate(record.date).split(' ')[1]}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatDate(record.date)}
                          </div>
                          {isToday && (
                            <div className="text-xs font-bold text-blue-600 mt-0.5">SELECTED</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm font-bold text-gray-700">
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
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center">
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
                              ? 'text-emerald-600' 
                              : record.progress >= 60 
                                ? 'text-amber-600' 
                                : 'text-rose-600'
                            : 'text-blue-600'
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
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
            <div className="text-xs font-bold text-gray-600 mb-1">TOTAL DAYS</div>
            <div className="text-2xl font-bold text-gray-900">{history.length}</div>
          </div>
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4">
            <div className="text-xs font-bold text-emerald-600 mb-1">STREAK DAYS</div>
            <div className="text-2xl font-bold text-emerald-800">
              {history.filter(h => h.isStreakDay).length}
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
            <div className="text-xs font-bold text-blue-600 mb-1">AVG. PROGRESS</div>
            <div className="text-2xl font-bold text-blue-800">
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