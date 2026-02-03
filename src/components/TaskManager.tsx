// src/components/TaskManager.tsx - Complete with theme support
import React, { useState } from 'react';
import { Task } from '../types';

interface TaskManagerProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  progress: number;
  date: string;
  isSaved: boolean;
  theme: 'light' | 'dark';
}

const TaskManager: React.FC<TaskManagerProps> = ({ 
  tasks, 
  onToggleTask, 
  progress, 
  date, 
  isSaved, 
  theme 
}) => {
  const [hours, setHours] = useState<Record<string, number>>({});
  
  const isWeekend = () => {
    const day = new Date(date).getDay();
    return day === 0 || day === 6;
  };

  const handleHourToggle = (taskId: string, hour: number) => {
    if (isSaved) return;
    
    const currentTaskHours = hours[taskId] || 0;
    let newHours = currentTaskHours;
    
    if (currentTaskHours === hour) {
      newHours = 0;
    } else {
      newHours = hour;
    }
    
    setHours(prev => ({ ...prev, [taskId]: newHours }));
    
    const task = tasks.find(t => t.id === taskId);
    if (task?.minHours && newHours >= task.minHours) {
      if (!task.completed) onToggleTask(taskId);
    } else if (task?.minHours && newHours < task.minHours) {
      if (task.completed) onToggleTask(taskId);
    }
  };

  const getTaskIcon = (taskId: string) => {
    switch(taskId) {
      case 'workout': return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
      case 'outreach': return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
      case 'project': return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      );
      case 'portfolio': return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
      case 'learning': return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
      default: return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      );
    }
  };

  const getTaskColor = (taskId: string) => {
    switch(taskId) {
      case 'workout': return 'bg-gradient-to-r from-blue-600 to-cyan-600';
      case 'outreach': return 'bg-gradient-to-r from-emerald-600 to-green-600';
      case 'project': return 'bg-gradient-to-r from-purple-600 to-pink-600';
      case 'portfolio': return 'bg-gradient-to-r from-orange-600 to-red-600';
      case 'learning': return 'bg-gradient-to-r from-indigo-600 to-blue-600';
      default: return 'bg-gradient-to-r from-gray-600 to-gray-700';
    }
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
            <h2 className="text-2xl font-bold text-white">DAILY TASKS</h2>
            <p className={`mt-1 text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-300'
            }`}>
              Complete your daily discipline requirements
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">
              {tasks.filter(t => t.completed).length}/{tasks.length}
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-300'
            }`}>
              Completed
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Tasks List */}
        <div className="space-y-6">
          {tasks.map(task => {
            const isExcluded = task.isExcluded ? task.isExcluded(new Date(date)) : false;
            const isDisabled = isExcluded || isSaved;
            const showHoursInput = task.minHours !== undefined;
            const currentHours = hours[task.id] || 0;
            const meetsRequirement = showHoursInput ? currentHours >= (task.minHours || 0) : true;
            const taskColor = getTaskColor(task.id);
            
            return (
              <div
                key={task.id}
                className={`rounded-xl border transition-all duration-300 ${
                  task.completed && meetsRequirement
                    ? theme === 'dark'
                      ? 'bg-gradient-to-br from-emerald-900/20 to-gray-800 border-emerald-800'
                      : 'bg-gradient-to-br from-emerald-50 to-white border-emerald-300'
                    : theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                } ${isDisabled ? 'opacity-60' : ''}`}
              >
                {/* Task Header */}
                <div className={`p-5 border-b ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
                }`}>
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${taskColor} flex items-center justify-center text-white`}>
                      {getTaskIcon(task.id)}
                    </div>
                    
                    {/* Task Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className={`text-xl font-bold ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {task.name}
                            </h3>
                            <span className={`px-3 py-1 ${taskColor} text-white text-xs font-bold rounded-full`}>
                              {task.weight}% WEIGHT
                            </span>
                          </div>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {task.description}
                          </p>
                        </div>
                        
                        {isExcluded && (
                          <span className={`px-3 py-1 text-xs font-medium rounded-full self-start ${
                            theme === 'dark'
                              ? 'bg-gray-900 text-gray-400'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            WEEKEND EXCLUDED
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Main Checkbox */}
                    {!showHoursInput && !isExcluded && (
                      <button
                        onClick={() => !isDisabled && onToggleTask(task.id)}
                        disabled={isDisabled}
                        className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                          task.completed
                            ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-sm'
                            : theme === 'dark'
                              ? 'bg-gray-700 text-gray-500 hover:bg-gray-600 hover:text-gray-300'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                        }`}
                      >
                        {task.completed ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Hours Selection */}
                {showHoursInput && !isExcluded && (
                  <div className={`p-5 rounded-b-xl ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-gray-800/50 to-gray-900/50'
                      : 'bg-gradient-to-r from-gray-50 to-white'
                  }`}>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`text-sm font-semibold ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          HOURS COMPLETED
                        </div>
                        <div className={`text-sm font-bold ${
                          meetsRequirement 
                            ? theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                            : theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                        }`}>
                          {currentHours}/{task.minHours}h {meetsRequirement ? '✓' : ''}
                        </div>
                      </div>
                      
                      {/* Hour Checkboxes */}
                      <div className="flex space-x-3 mb-4">
                        {[1, 2, 3].map(hour => (
                          <button
                            key={hour}
                            onClick={() => !isDisabled && handleHourToggle(task.id, hour)}
                            disabled={isDisabled || hour > (task.minHours || 3)}
                            className={`flex-1 py-3 rounded-lg border-2 transition-all transform hover:scale-105 ${
                              currentHours === hour
                                ? theme === 'dark'
                                  ? 'border-blue-500 bg-blue-900/30 text-blue-300 font-bold'
                                  : 'border-blue-500 bg-blue-50 text-blue-700 font-bold'
                                : theme === 'dark'
                                  ? 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-700'
                            } ${hour > (task.minHours || 3) ? 'opacity-40 cursor-not-allowed' : ''}`}
                          >
                            <div className="text-lg font-bold">{hour}h</div>
                            <div className="text-xs mt-1">{hour === 1 ? 'Minimum' : hour === 2 ? 'Good' : 'Excellent'}</div>
                          </button>
                        ))}
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full">
                        <div className={`flex justify-between text-sm mb-2 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <span className="font-medium">0 hours</span>
                          <span className={`font-bold ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Progress: {((currentHours / (task.minHours || 1)) * 100).toFixed(0)}%
                          </span>
                          <span className="font-medium">{task.minHours} hours required</span>
                        </div>
                        <div className={`h-3 rounded-full overflow-hidden shadow-inner ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                          <div 
                            className={`h-full transition-all duration-700 ease-out ${
                              meetsRequirement 
                                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                                : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                            }`}
                            style={{ 
                              width: `${Math.min((currentHours / (task.minHours || 1)) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-2">
                          <div className={`text-xs ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            Not started
                          </div>
                          <div className={`text-xs font-bold ${
                            meetsRequirement 
                              ? theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                              : theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                          }`}>
                            {meetsRequirement ? 'Requirement met!' : `${task.minHours! - currentHours}h to go`}
                          </div>
                          <div className={`text-xs ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            Fully completed
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Completion Status */}
                    <div className={`flex items-center justify-between pt-4 border-t ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <div className={`text-sm font-bold ${
                        meetsRequirement 
                          ? theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                          : theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                      }`}>
                        {meetsRequirement 
                          ? '✓ Minimum hours requirement satisfied' 
                          : `⚠ Minimum ${task.minHours} hours not yet completed`}
                      </div>
                      {task.completed && meetsRequirement && (
                        <div className={`px-3 py-1 text-xs font-bold rounded-full ${
                          theme === 'dark'
                            ? 'bg-emerald-900/50 text-emerald-300'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          TASK COMPLETE
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Task Completion Status for non-hour tasks */}
                {!showHoursInput && !isExcluded && (
                  <div className={`px-5 py-3 rounded-b-xl ${
                    theme === 'dark' ? 'bg-gray-900/30' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className={`text-sm font-bold ${
                        task.completed 
                          ? theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                          : theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                      }`}>
                        {task.completed 
                          ? '✓ Task marked as complete' 
                          : 'Pending completion'}
                      </div>
                      {task.completed && (
                        <div className={`px-3 py-1 text-xs font-bold rounded-full ${
                          theme === 'dark'
                            ? 'bg-emerald-900/50 text-emerald-300'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          COMPLETED
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Daily Summary */}
        <div className={`mt-8 pt-8 border-t ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className={`rounded-xl p-5 border ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700'
              : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
          }`}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex-1">
                <div className={`text-lg font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  DAILY PERFORMANCE SUMMARY
                </div>
                <div className={`text-4xl font-bold ${
                  progress >= 80 
                    ? theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                    : progress >= 60 
                      ? theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                      : theme === 'dark' ? 'text-rose-400' : 'text-rose-600'
                }`}>
                  {progress}%
                </div>
                <div className={`text-sm mt-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {progress >= 80 
                    ? 'Excellent discipline maintained. Streak continues.' 
                    : progress >= 60 
                      ? 'Good progress. Aim for 80% to maintain streak.' 
                      : 'Focus required. Increase task completion to build discipline.'}
                </div>
              </div>
              
              <div className="w-full md:w-72">
                <div className={`flex justify-between text-sm font-bold mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <span>START</span>
                  <span>PROGRESS</span>
                  <span>TARGET</span>
                </div>
                <div className={`h-4 rounded-full overflow-hidden shadow-inner ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
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
                <div className={`flex justify-between text-xs mt-2 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  <span>0%</span>
                  <span className={`${
                    progress >= 80 ? 'font-bold' : ''
                  } ${
                    progress >= 80 
                      ? theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                      : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    80% Streak Line
                  </span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;