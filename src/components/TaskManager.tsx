// src/components/TaskManager.tsx - Updated with project implementation and advance project tasks
import React, { useState } from 'react';
import { Task } from '../types';
import { 
  FiPlus, 
  FiCheck, 
  FiMail, 
  FiBook, 
  FiSmartphone,
  FiBriefcase,
  FiTarget,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';

interface TaskManagerProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  progress: number;
  date: string;
  isSaved: boolean;
  onSave: () => void;
  theme: 'light' | 'dark';
  projectHours?: number;
  advanceProjectHours?: number;
  onUpdateProjectHours?: (hours: number) => void;
  onUpdateAdvanceProjectHours?: (hours: number) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({ 
  tasks, 
  onToggleTask, 
  progress, 
  date, 
  isSaved, 
  onSave,
  theme,
  projectHours = 0,
  advanceProjectHours = 0,
  onUpdateProjectHours,
  onUpdateAdvanceProjectHours
}) => {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const getTaskIcon = (taskId: string) => {
    switch(taskId) {
      case 'outreach': return <FiMail className="w-6 h-6" />;
      case 'project': return <FiBriefcase className="w-6 h-6" />;
      case 'advance-project': return <FiTarget className="w-6 h-6" />;
      case 'learning': return <FiBook className="w-6 h-6" />;
      case 'scrolling': return <FiSmartphone className="w-6 h-6" />;
      default: return <FiCheck className="w-6 h-6" />;
    }
  };

  const getTaskColor = (taskId: string) => {
    switch(taskId) {
      case 'outreach': return theme === 'dark' ? 'from-blue-500 to-cyan-500' : 'from-blue-400 to-cyan-400';
      case 'project': return theme === 'dark' ? 'from-purple-500 to-pink-500' : 'from-purple-400 to-pink-400';
      case 'advance-project': return theme === 'dark' ? 'from-orange-500 to-red-500' : 'from-orange-400 to-red-400';
      case 'learning': return theme === 'dark' ? 'from-emerald-500 to-green-500' : 'from-emerald-400 to-green-400';
      case 'scrolling': return theme === 'dark' ? 'from-indigo-500 to-blue-500' : 'from-indigo-400 to-blue-400';
      default: return theme === 'dark' ? 'from-gray-500 to-gray-600' : 'from-gray-400 to-gray-500';
    }
  };

  const getTaskDescription = (taskId: string) => {
    switch(taskId) {
      case 'outreach': return '5+ pitches daily (25% weight)';
      case 'project': return '2+ hours daily (25% weight)';
      case 'advance-project': return '3+ hours daily (30% weight)';
      case 'learning': return 'Intentional learning (12% weight)';
      case 'scrolling': return 'Intentional content (8% weight)';
      default: return 'Daily task';
    }
  };

  const toggleTaskExpand = (taskId: string) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const isWeekend = new Date(date).getDay() === 0;
  const outreachTask = tasks.find(t => t.id === 'outreach');
  const isOutreachExcluded = outreachTask?.isExcluded ? outreachTask.isExcluded(new Date(date)) : false;

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
            <h2 className="text-2xl font-bold">DAILY TASKS</h2>
            <p className={`text-lg mt-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-300'
            }`}>
              Mark tasks as complete
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-3">
            <div className={`text-3xl font-bold ${
              progress >= 80 
                ? 'text-emerald-400' 
                : progress >= 60 
                  ? 'text-amber-400' 
                  : 'text-rose-400'
            }`}>
              {progress}%
            </div>
            <button
              onClick={onSave}
              disabled={isSaved}
              className={`px-6 py-2.5 text-base rounded-xl font-bold transition-all flex items-center gap-2 ${
                isSaved 
                  ? theme === 'dark'
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : theme === 'dark'
                    ? 'bg-emerald-700 text-white hover:bg-emerald-600 hover:shadow-lg'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg'
              }`}
            >
              <FiCheck className="w-5 h-5" />
              {isSaved ? 'Day Locked' : 'Lock Day'}
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-5">
          <div className={`h-3 rounded-full overflow-hidden ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
          }`}>
            <div 
              className={`h-full transition-all duration-1000 ease-out ${
                progress >= 80 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' 
                  : progress >= 60 
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400' 
                    : 'bg-gradient-to-r from-rose-500 to-rose-400'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className={`flex justify-between text-base mt-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <span>0%</span>
            <span className="font-bold">80% Target</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.map(task => {
            const isDisabled = isSaved || (task.id === 'outreach' && isOutreachExcluded);
            const isExpanded = expandedTask === task.id;
            
            return (
              <div
                key={task.id}
                className={`rounded-xl border-2 transition-all ${
                  task.completed
                    ? theme === 'dark'
                      ? 'bg-emerald-900/20 border-emerald-700'
                      : 'bg-emerald-50 border-emerald-200'
                    : theme === 'dark'
                      ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getTaskColor(task.id)} flex items-center justify-center text-white`}>
                        {getTaskIcon(task.id)}
                      </div>
                      <div>
                        <div className={`text-lg font-bold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {task.name}
                        </div>
                        <div className={`text-base ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {getTaskDescription(task.id)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {(task.id === 'project' || task.id === 'advance-project') && (
                        <button
                          onClick={() => toggleTaskExpand(task.id)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            theme === 'dark'
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {isExpanded ? (
                            <FiChevronUp className="w-5 h-5" />
                          ) : (
                            <FiChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      )}
                      
                      <button
                        onClick={() => !isDisabled && onToggleTask(task.id)}
                        disabled={isDisabled}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                          task.completed
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                            : theme === 'dark'
                              ? 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-300'
                              : 'bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-gray-700'
                        }`}
                      >
                        {task.completed ? (
                          <FiCheck className="w-5 h-5" />
                        ) : (
                          <FiPlus className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Expandable Details for Project Tasks */}
                  {isExpanded && (task.id === 'project' || task.id === 'advance-project') && (
                    <div className={`mt-4 pt-4 border-t ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`text-base font-bold ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {task.id === 'project' ? 'Project Implementation Hours' : 'Advanced Project Hours'}
                        </div>
                        <div className={`text-xl font-bold ${
                          task.id === 'project' 
                            ? projectHours >= 2 
                              ? 'text-emerald-400' 
                              : projectHours >= 1 
                                ? 'text-amber-400' 
                                : 'text-rose-400'
                            : advanceProjectHours >= 3 
                              ? 'text-emerald-400' 
                              : advanceProjectHours >= 2 
                                ? 'text-amber-400' 
                                : 'text-rose-400'
                        }`}>
                          {task.id === 'project' ? projectHours : advanceProjectHours}h
                        </div>
                      </div>
                      
                      {/* Hour Controls */}
                      <div className="flex justify-center gap-2">
                        {[0, 1, 2, 3, 4].map(hour => (
                          <button
                            key={hour}
                            onClick={() => {
                              if (task.id === 'project' && onUpdateProjectHours) {
                                onUpdateProjectHours(hour);
                              } else if (task.id === 'advance-project' && onUpdateAdvanceProjectHours) {
                                onUpdateAdvanceProjectHours(hour);
                              }
                            }}
                            disabled={isSaved}
                            className={`px-4 py-2.5 rounded-lg text-base transition-all ${
                              (task.id === 'project' ? projectHours === hour : advanceProjectHours === hour)
                                ? task.id === 'project'
                                  ? theme === 'dark'
                                    ? 'bg-purple-600 text-white font-bold'
                                    : 'bg-purple-500 text-white font-bold'
                                  : theme === 'dark'
                                    ? 'bg-orange-600 text-white font-bold'
                                    : 'bg-orange-500 text-white font-bold'
                                : theme === 'dark'
                                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {hour}h
                          </button>
                        ))}
                      </div>
                      
                      <div className={`mt-3 text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Target: {task.id === 'project' ? '2 hours' : '3 hours'} • Max: 4 hours
                      </div>
                    </div>
                  )}
                  
                  {/* Special note for outreach on weekends */}
                  {task.id === 'outreach' && isOutreachExcluded && (
                    <div className={`mt-3 p-2 rounded-lg text-sm ${
                      theme === 'dark' ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700'
                    }`}>
                      Sunday - Outreach task excluded for today
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className={`mt-6 p-5 rounded-xl border-2 ${
          theme === 'dark'
            ? 'bg-gray-800/50 border-gray-700'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className={`text-base font-bold mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Tasks Completed
              </div>
              <div className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {tasks.filter(t => t.completed).length}/{tasks.length}
              </div>
              <div className={`text-sm mt-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {((tasks.filter(t => t.completed).length / tasks.length) * 100).toFixed(0)}% completion
              </div>
            </div>
            
            <div className="text-center">
              <div className={`text-base font-bold mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Daily Progress
              </div>
              <div className={`text-3xl font-bold ${
                progress >= 80 
                  ? 'text-emerald-500' 
                  : progress >= 60 
                    ? 'text-amber-500' 
                    : 'text-rose-500'
              }`}>
                {progress}%
              </div>
              <div className={`text-sm mt-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {progress >= 80 ? '🎯 Target Achieved' : progress >= 60 ? '📈 Good Progress' : '📉 Needs Improvement'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;