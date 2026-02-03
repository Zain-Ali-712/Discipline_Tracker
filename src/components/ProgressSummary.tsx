// components/ProgressSummary.tsx - New component for daily breakdown
import React from 'react';
import { Task } from '../types';

interface ProgressSummaryProps {
  tasks: Task[];
}

const ProgressSummary: React.FC<ProgressSummaryProps> = ({ tasks }) => {
  const completedWeight = tasks
    .filter(task => task.completed)
    .reduce((sum, task) => sum + task.weight, 0);
  
  const totalWeight = tasks.reduce((sum, task) => sum + task.weight, 0);
  
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <h4 className="font-semibold mb-3">Daily Weight Breakdown</h4>
      <div className="space-y-3">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                task.completed ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <span className="text-sm">{task.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{task.weight}%</span>
              {task.completed && (
                <span className="text-xs text-green-600">✓</span>
              )}
            </div>
          </div>
        ))}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex justify-between font-semibold">
            <span>Total Progress:</span>
            <span>{Math.round((completedWeight / totalWeight) * 100)}%</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {completedWeight}/{totalWeight} weight units completed
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressSummary;