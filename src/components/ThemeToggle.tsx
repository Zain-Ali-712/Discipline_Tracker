// src/components/ThemeToggle.tsx
import React from 'react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className={`relative w-14 h-8 rounded-full transition-all duration-300 flex items-center p-1 ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700'
          : 'bg-gradient-to-r from-blue-100 to-purple-100 border border-white/30'
      }`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {/* Track */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className={`absolute inset-0 transition-opacity duration-300 ${
          theme === 'dark' ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-gray-700 opacity-50"></div>
          </div>
        </div>
        <div className={`absolute inset-0 transition-opacity duration-300 ${
          theme === 'light' ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-yellow-300 opacity-30"></div>
          </div>
        </div>
      </div>
      
      {/* Thumb */}
      <div
        className={`relative w-6 h-6 rounded-full transition-transform duration-300 transform ${
          theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
        } ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-gray-700 to-gray-800 shadow-lg'
            : 'bg-gradient-to-r from-yellow-300 to-orange-300 shadow-lg'
        }`}
      >
        {/* Sun/Moon icon */}
        {theme === 'dark' ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;