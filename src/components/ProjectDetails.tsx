// src/components/ProjectDetails.tsx - Simplified version
import React from 'react';
import { FiClock, FiTarget, FiBriefcase } from 'react-icons/fi';

interface ProjectDetailsProps {
  projectHours: number;
  advanceProjectHours: number;
  onUpdateProjectHours: (hours: number) => void;
  onUpdateAdvanceProjectHours: (hours: number) => void;
  isSaved: boolean;
  theme: 'light' | 'dark';
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  projectHours,
  advanceProjectHours,
  onUpdateProjectHours,
  onUpdateAdvanceProjectHours,
  isSaved,
  theme
}) => {
  const projectTarget = 2;
  const advanceProjectTarget = 3;
  
  const projectProgress = Math.min((projectHours / projectTarget) * 100, 200);
  const advanceProjectProgress = Math.min((advanceProjectHours / advanceProjectTarget) * 100, 133);

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
          <div>
            <h3 className="text-xl font-bold">PROJECT HOURS SUMMARY</h3>
            <p className={`text-lg mt-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-300'
            }`}>
              Quick overview of today's work
            </p>
          </div>
          <FiClock className="w-8 h-8 text-white" />
        </div>
      </div>

      <div className="p-6">
        {/* Current Hours Display */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`p-4 rounded-xl border-2 ${
            theme === 'dark'
              ? 'bg-gray-800/50 border-gray-700'
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <FiBriefcase className={`w-6 h-6 ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }`} />
              <div>
                <div className={`text-lg font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Project
                </div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  25% weight
                </div>
              </div>
            </div>
            <div className={`text-3xl font-bold mb-2 ${
              projectHours >= projectTarget 
                ? 'text-emerald-400' 
                : projectHours >= 1 
                  ? 'text-amber-400' 
                  : 'text-rose-400'
            }`}>
              {projectHours}h
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Target: {projectTarget}h • Max: 4h
            </div>
          </div>
          
          <div className={`p-4 rounded-xl border-2 ${
            theme === 'dark'
              ? 'bg-gray-800/50 border-gray-700'
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <FiTarget className={`w-6 h-6 ${
                theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
              }`} />
              <div>
                <div className={`text-lg font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Advanced
                </div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  30% weight
                </div>
              </div>
            </div>
            <div className={`text-3xl font-bold mb-2 ${
              advanceProjectHours >= advanceProjectTarget 
                ? 'text-emerald-400' 
                : advanceProjectHours >= 2 
                  ? 'text-amber-400' 
                  : 'text-rose-400'
            }`}>
              {advanceProjectHours}h
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Target: {advanceProjectTarget}h • Max: 4h
            </div>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className={`p-4 rounded-xl border-2 ${
          theme === 'dark'
            ? 'bg-gray-800/50 border-gray-700'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className={`text-base font-bold mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Project Progress
              </div>
              <div className={`h-2.5 rounded-full overflow-hidden ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
              }`}>
                <div 
                  className={`h-full transition-all duration-700 ease-out ${
                    projectHours >= projectTarget 
                      ? 'bg-gradient-to-r from-purple-500 to-purple-400' 
                      : projectHours >= 1 
                        ? 'bg-gradient-to-r from-amber-500 to-amber-400' 
                        : 'bg-gradient-to-r from-rose-500 to-rose-400'
                  }`}
                  style={{ width: `${Math.min(projectProgress, 100)}%` }}
                ></div>
              </div>
              <div className={`flex justify-between text-sm mt-1.5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <span>0h</span>
                <span className="font-bold">{projectTarget}h target</span>
                <span>4h</span>
              </div>
            </div>
            
            <div>
              <div className={`text-base font-bold mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Advanced Progress
              </div>
              <div className={`h-2.5 rounded-full overflow-hidden ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
              }`}>
                <div 
                  className={`h-full transition-all duration-700 ease-out ${
                    advanceProjectHours >= advanceProjectTarget 
                      ? 'bg-gradient-to-r from-orange-500 to-orange-400' 
                      : advanceProjectHours >= 2 
                        ? 'bg-gradient-to-r from-amber-500 to-amber-400' 
                        : 'bg-gradient-to-r from-rose-500 to-rose-400'
                  }`}
                  style={{ width: `${Math.min(advanceProjectProgress, 100)}%` }}
                ></div>
              </div>
              <div className={`flex justify-between text-sm mt-1.5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <span>0h</span>
                <span className="font-bold">{advanceProjectTarget}h target</span>
                <span>4h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;