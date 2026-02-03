// src/components/TaskManager.tsx - Clean design without emojis
import React, { useState } from 'react';
import { Task } from '../types';

interface TaskManagerProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  progress: number;
  date: string;
  isSaved: boolean;
}

const TaskManager: React.FC<TaskManagerProps> = ({ tasks, onToggleTask, progress, date, isSaved }) => {
  const [hours, setHours] = useState<Record<string, number>>({});
  
  const isWeekend = () => {
    const day = new Date(date).getDay();
    return day === 0 || day === 6;
  };

  const handleHoursChange = (taskId: string, value: string) => {
    if (isSaved) return;
    
    const numValue = parseInt(value) || 0;
    setHours(prev => ({ ...prev, [taskId]: numValue }));
    
    const task = tasks.find(t => t.id === taskId);
    if (task?.minHours && numValue >= task.minHours) {
      onToggleTask(taskId);
    } else if (task?.minHours && numValue < task.minHours) {
      if (task.completed) {
        onToggleTask(taskId);
      }
    }
  };

  const getTaskIcon = (taskId: string) => {
    switch(taskId) {
      case 'workout': return 'W';
      case 'outreach': return 'O';
      case 'project': return 'P';
      case 'portfolio': return 'S';
      case 'learning': return 'L';
      default: return 'T';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 h-full">
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Daily Tasks</h2>
            <p className="text-gray-600 mt-2">Mark tasks as complete or track hours</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 font-medium">Completed</div>
            <div className="text-2xl font-bold text-gray-900">
              {tasks.filter(t => t.completed).length}/{tasks.length}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {tasks.map(task => {
            const isExcluded = task.isExcluded ? task.isExcluded(new Date(date)) : false;
            const isDisabled = isExcluded || isSaved;
            const showHoursInput = task.minHours !== undefined;
            const currentHours = hours[task.id] || 0;
            const meetsRequirement = showHoursInput ? currentHours >= (task.minHours || 0) : true;
            
            return (
              <div
                key={task.id}
                className={`p-5 rounded-xl border transition-all ${
                  task.completed && meetsRequirement
                    ? 'bg-emerald-50 border-emerald-300' 
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                } ${isDisabled ? 'opacity-60' : 'cursor-pointer'}`}
                onClick={() => !isDisabled && !showHoursInput && onToggleTask(task.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Icon Badge */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
                    task.completed && meetsRequirement
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                      : 'bg-gradient-to-r from-gray-600 to-gray-700'
                  }`}>
                    {getTaskIcon(task.id)}
                  </div>
                  
                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-bold text-lg text-gray-900">{task.name}</h4>
                          <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold rounded">
                            {task.weight}%
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                      </div>
                      
                      {isExcluded && (
                        <span className="px-3 py-1 text-xs bg-gray-100 text-gray-600 font-medium rounded-full">
                          Weekend Excluded
                        </span>
                      )}
                    </div>
                    
                    {/* Hours Input */}
                    {showHoursInput && !isExcluded && (
                      <div className="mt-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <label className="text-sm font-medium text-gray-700">Hours:</label>
                              <input
                                type="number"
                                min="0"
                                max="24"
                                value={currentHours}
                                onChange={(e) => handleHoursChange(task.id, e.target.value)}
                                disabled={isSaved}
                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <div className="text-sm">
                              {task.minHours && currentHours >= task.minHours ? (
                                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                  ✓ Minimum {task.minHours}h met
                                </span>
                              ) : (
                                <span className="text-amber-600 font-medium">
                                  Need {task.minHours ? task.minHours - currentHours : 0}h more
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="w-full md:w-64">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>0h</span>
                              <span>{task.minHours}h required</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-500 ${
                                  currentHours >= (task.minHours || 0) 
                                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                                    : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                                }`}
                                style={{ 
                                  width: `${Math.min((currentHours / (task.minHours || 1)) * 100, 100)}%` 
                                }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 text-center">
                              {currentHours}/{task.minHours}h completed
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Checkbox */}
                  <div className="flex-shrink-0 flex items-center justify-center">
                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${
                      task.completed && meetsRequirement
                        ? 'bg-emerald-500 border-emerald-500' 
                        : 'border-gray-300'
                    }`}>
                      {task.completed && meetsRequirement && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Summary */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex-1">
              <div className="text-lg font-semibold text-gray-900 mb-2">Daily Summary</div>
              <div className={`text-3xl font-bold ${progress >= 80 ? 'text-emerald-600' : progress >= 60 ? 'text-amber-600' : 'text-rose-600'}`}>
                {progress}% Complete
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {progress >= 80 
                  ? 'Streak will be maintained' 
                  : progress >= 60 
                    ? 'Good progress, aim for 80%+' 
                    : 'Focus on completing more tasks'}
              </div>
            </div>
            
            <div className="w-full md:w-64">
              <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                <span>0%</span>
                <span>Progress</span>
                <span>100%</span>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;