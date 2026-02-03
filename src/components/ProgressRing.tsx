// src/components/ProgressRing.tsx - Updated with theme prop
import React from 'react';

interface ProgressRingProps {
  progress: number;
  size: number;
  strokeWidth?: number;
  theme: 'light' | 'dark';
}

const ProgressRing: React.FC<ProgressRingProps> = ({ 
  progress, 
  size, 
  strokeWidth = 6,
  theme
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const getProgressColor = (value: number) => {
    if (value >= 80) return '#10B981'; // emerald
    if (value >= 60) return '#F59E0B'; // amber
    return '#EF4444'; // rose
  };

  const getBackgroundColor = () => {
    return theme === 'dark' ? '#374151' : '#E5E7EB'; // gray-700 for dark, gray-200 for light
  };

  return (
    <div className="relative">
      <svg width={size} height={size}>
        <circle
          strokeWidth={strokeWidth}
          stroke={getBackgroundColor()}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={getProgressColor(progress)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-sm font-semibold ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {progress}%
        </span>
      </div>
    </div>
  );
};

export default ProgressRing;