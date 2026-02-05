// src/components/ProjectManager.tsx - Updated with start and completed dates
import React, { useState } from 'react';
import { Project } from '../types';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiClock, FiTarget, FiCalendar, FiCheckCircle } from 'react-icons/fi';

interface ProjectManagerProps {
  projects: Project[];
  onAddProject: (project: Project) => void;
  onUpdateProject: (projectId: string, updates: Partial<Project>) => void;
  onDeleteProject: (projectId: string) => void;
  onAddHours: (projectId: string, hours: number) => void;
  currentDate: string;
  isSaved: boolean;
  theme: 'light' | 'dark';
}

const ProjectManager: React.FC<ProjectManagerProps> = ({
  projects,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onAddHours,
  currentDate,
  isSaved,
  theme
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectEstimate, setNewProjectEstimate] = useState(10);

  const handleAddProject = () => {
    if (!newProjectName.trim()) return;
    
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: newProjectName,
      estimatedHours: newProjectEstimate,
      completed: false,
      startDate: currentDate, // Set start date to today
      hoursLog: [],
      createdAt: new Date().toISOString()
    };
    
    onAddProject(newProject);
    setNewProjectName('');
    setNewProjectEstimate(10);
    setShowAddForm(false);
  };

  const handleCompleteProject = (projectId: string) => {
    onUpdateProject(projectId, { 
      completed: true,
      completedDate: currentDate // Set completion date to today
    });
  };

  const getProjectProgress = (project: Project) => {
    const totalHours = project.hoursLog.reduce((sum, log) => sum + log.hours, 0);
    return Math.min((totalHours / project.estimatedHours) * 100, 100);
  };

  const getTodayHours = (project: Project) => {
    const todayLog = project.hoursLog.find(log => log.date === currentDate);
    return todayLog ? todayLog.hours : 0;
  };

  const getTotalHours = (project: Project) => {
    return project.hoursLog.reduce((sum, log) => sum + log.hours, 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getProjectColor = (progress: number) => {
    if (progress >= 100) return theme === 'dark' ? 'from-emerald-500 to-emerald-600' : 'from-emerald-400 to-emerald-500';
    if (progress >= 70) return theme === 'dark' ? 'from-amber-500 to-amber-600' : 'from-amber-400 to-amber-500';
    if (progress >= 30) return theme === 'dark' ? 'from-blue-500 to-blue-600' : 'from-blue-400 to-blue-500';
    return theme === 'dark' ? 'from-gray-500 to-gray-600' : 'from-gray-400 to-gray-500';
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
          <div>
            <h3 className="text-xl font-bold">CUSTOM PROJECTS</h3>
            <p className={`text-lg mt-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-300'
            }`}>
              Track your project hours
            </p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-200'
            }`}>
              {projects.length}
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
            }`}>
              Total Projects
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Add Project Form */}
        {showAddForm && (
          <div className={`mb-6 p-4 rounded-xl border-2 ${
            theme === 'dark'
              ? 'bg-gray-800/50 border-gray-700'
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Project Name
              </label>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Enter project name"
              />
            </div>
            
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Estimated Hours
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={newProjectEstimate}
                  onChange={(e) => setNewProjectEstimate(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className={`font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {newProjectEstimate}h
                </span>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddForm(false)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddProject}
                className={`px-4 py-2 rounded-lg font-medium ${
                  theme === 'dark'
                    ? 'bg-emerald-700 text-white hover:bg-emerald-600'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                Add Project
              </button>
            </div>
          </div>
        )}

        {/* Projects List */}
        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className={`text-center py-8 rounded-xl ${
              theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-100'
            }`}>
              <div className={`text-lg ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                No custom projects yet. Add your first project!
              </div>
            </div>
          ) : (
            projects.map(project => {
              const progress = getProjectProgress(project);
              const todayHours = getTodayHours(project);
              const totalHours = getTotalHours(project);
              const isEditing = editingProjectId === project.id;
              
              return (
                <div
                  key={project.id}
                  className={`p-4 rounded-xl border-2 ${
                    project.completed
                      ? theme === 'dark'
                        ? 'bg-emerald-900/20 border-emerald-700'
                        : 'bg-emerald-50 border-emerald-200'
                      : theme === 'dark'
                        ? 'bg-gray-800/50 border-gray-700'
                        : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getProjectColor(progress)} flex items-center justify-center text-white`}>
                        <FiTarget className="w-5 h-5" />
                      </div>
                      <div>
                        {isEditing ? (
                          <input
                            type="text"
                            value={project.name}
                            onChange={(e) => onUpdateProject(project.id, { name: e.target.value })}
                            className={`px-2 py-1 rounded ${
                              theme === 'dark'
                                ? 'bg-gray-700 text-white'
                                : 'bg-white text-gray-900'
                            }`}
                          />
                        ) : (
                          <div className={`text-lg font-bold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {project.name}
                          </div>
                        )}
                        <div className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <div className="flex items-center gap-2 mt-1">
                            <FiCalendar className="w-3 h-3" />
                            <span>Started: {formatDate(project.startDate)}</span>
                            {project.completed && project.completedDate && (
                              <>
                                <span>•</span>
                                <FiCheckCircle className="w-3 h-3" />
                                <span>Completed: {formatDate(project.completedDate)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {project.completed ? (
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          theme === 'dark'
                            ? 'bg-emerald-800 text-emerald-300'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          Completed
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingProjectId(isEditing ? null : project.id)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              theme === 'dark'
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteProject(project.id)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              theme === 'dark'
                                ? 'bg-gray-700 text-rose-300 hover:bg-gray-600'
                                : 'bg-gray-200 text-rose-600 hover:bg-gray-300'
                            }`}
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Project Info */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-800/70' : 'bg-gray-100'
                    }`}>
                      <div className={`text-xs font-medium ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Hours Done
                      </div>
                      <div className={`text-lg font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {totalHours}h
                      </div>
                    </div>
                    <div className={`p-2 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-800/70' : 'bg-gray-100'
                    }`}>
                      <div className={`text-xs font-medium ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Estimated
                      </div>
                      <div className={`text-lg font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {project.estimatedHours}h
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <div className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Progress: {progress.toFixed(0)}%
                      </div>
                      <div className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {totalHours}h / {project.estimatedHours}h
                      </div>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                    }`}>
                      <div 
                        className={`h-full bg-gradient-to-r ${getProjectColor(progress)}`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Hour Controls */}
                  {!project.completed && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FiClock className={`w-4 h-4 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`} />
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Today: {todayHours}h
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onAddHours(project.id, Math.max(0, todayHours - 1))}
                          disabled={isSaved || todayHours <= 0}
                          className={`w-7 h-7 rounded flex items-center justify-center ${
                            isSaved || todayHours <= 0
                              ? theme === 'dark'
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : theme === 'dark'
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          -
                        </button>
                        
                        <span className={`w-8 text-center font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {todayHours}
                        </span>
                        
                        <button
                          onClick={() => onAddHours(project.id, todayHours + 1)}
                          disabled={isSaved}
                          className={`w-7 h-7 rounded flex items-center justify-center ${
                            isSaved
                              ? theme === 'dark'
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : theme === 'dark'
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Complete Button */}
                  {!project.completed && progress >= 100 && (
                    <div className="mt-3 pt-3 border-t border-gray-700/50">
                      <button
                        onClick={() => handleCompleteProject(project.id)}
                        className={`w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${
                          theme === 'dark'
                            ? 'bg-emerald-700 text-white hover:bg-emerald-600'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        <FiCheck className="w-4 h-4" />
                        Mark as Completed
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        
        {/* Add Project Button */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className={`w-full mt-4 p-3 rounded-xl border-2 border-dashed font-medium flex items-center justify-center gap-2 ${
              theme === 'dark'
                ? 'border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-800/50'
                : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-100'
            }`}
          >
            <FiPlus className="w-5 h-5" />
            Add New Project
          </button>
        )}

        {/* Summary */}
        {projects.length > 0 && (
          <div className={`mt-6 p-4 rounded-xl border-2 ${
            theme === 'dark'
              ? 'bg-gray-800/50 border-gray-700'
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Active Projects
                </div>
                <div className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {projects.filter(p => !p.completed).length}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Total Hours Today
                </div>
                <div className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {projects.reduce((sum, project) => sum + getTodayHours(project), 0)}h
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectManager;