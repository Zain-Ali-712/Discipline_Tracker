// src/components/HistoryTable.tsx - Clean design without emojis
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
    if (progress >= 80) return 'bg-emerald-50 text-emerald-800 border-emerald-300';
    if (progress >= 60) return 'bg-amber-50 text-amber-800 border-amber-300';
    return 'bg-rose-50 text-rose-800 border-rose-300';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">History</h3>
          <div className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full">
            {history.length} days
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="py-3 px-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Day
                </th>
                <th className="py-3 px-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Progress
                </th>
                <th className="py-3 px-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
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
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                      isToday ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => onDateSelect(record.date)}
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(record.date)}
                        </span>
                        {isToday && (
                          <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded">
                            TODAY
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="text-sm text-gray-600 font-medium">
                        {record.dayOfWeek}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${getProgressColorClass(record.progress, record.isSaved || false)}`}>
                        {record.progress}%
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      {record.isStreakDay && streakCount > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900">{streakCount} day streak</span>
                        </div>
                      ) : record.isSaved ? (
                        <span className="text-gray-500 text-sm font-medium">Saved</span>
                      ) : (
                        <span className="text-amber-500 text-sm font-medium">Editable</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-3">Progress</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs text-gray-600">≥80% (Streak)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-xs text-gray-600">60-79%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <span className="text-xs text-gray-600">&lt;60%</span>
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-3">Status</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <span className="text-xs text-gray-600">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs text-gray-600">Saved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-xs text-gray-600">Editable</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryTable;