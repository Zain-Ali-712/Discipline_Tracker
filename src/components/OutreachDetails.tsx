// src/components/OutreachDetails.tsx - Updated with fixed pitch counting and improved UI
import React from 'react';
import { FiInstagram, FiLinkedin, FiTwitter, FiFacebook, FiPlus, FiMinus } from 'react-icons/fi';

interface OutreachDetailsProps {
  pitches: {
    instagram: number;
    linkedin: number;
    twitter: number;
    facebook: number;
  };
  allTimePitches: {
    instagram: number;
    linkedin: number;
    twitter: number;
    facebook: number;
  };
  onUpdatePitches: (platform: string, count: number) => void;
  isSaved: boolean;
  theme: 'light' | 'dark';
  date: string;
}

const OutreachDetails: React.FC<OutreachDetailsProps> = ({
  pitches,
  allTimePitches,
  onUpdatePitches,
  isSaved,
  theme,
  date
}) => {
  const isWeekend = () => {
    const day = new Date(date).getDay();
    return day === 0;
  };

  const totalPitches = pitches.instagram + pitches.linkedin + pitches.twitter + pitches.facebook;
  const targetPitches = 5;
  const isExcluded = isWeekend();

  const getPlatformColor = (platform: string) => {
    switch(platform) {
      case 'instagram': return theme === 'dark' ? 'from-pink-500 via-purple-500 to-red-500' : 'from-pink-400 via-purple-400 to-red-400';
      case 'linkedin': return theme === 'dark' ? 'from-blue-500 to-blue-700' : 'from-blue-400 to-blue-600';
      case 'twitter': return theme === 'dark' ? 'from-sky-500 to-blue-500' : 'from-sky-400 to-blue-400';
      case 'facebook': return theme === 'dark' ? 'from-blue-600 to-blue-800' : 'from-blue-500 to-blue-700';
      default: return theme === 'dark' ? 'from-gray-500 to-gray-700' : 'from-gray-400 to-gray-600';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'instagram': return <FiInstagram className="w-6 h-6" />;
      case 'linkedin': return <FiLinkedin className="w-6 h-6" />;
      case 'twitter': return <FiTwitter className="w-6 h-6" />;
      case 'facebook': return <FiFacebook className="w-6 h-6" />;
      default: return <FiPlus className="w-6 h-6" />;
    }
  };

  const getPlatformName = (platform: string) => {
    switch(platform) {
      case 'instagram': return 'Instagram';
      case 'linkedin': return 'LinkedIn';
      case 'twitter': return 'Twitter';
      case 'facebook': return 'Facebook';
      default: return platform;
    }
  };

  const handleAddPitch = (platform: string) => {
    const currentCount = pitches[platform as keyof typeof pitches];
    if (currentCount < 10) {
      onUpdatePitches(platform, currentCount + 1);
    }
  };

  const handleRemovePitch = (platform: string) => {
    const currentCount = pitches[platform as keyof typeof pitches];
    if (currentCount > 0) {
      onUpdatePitches(platform, currentCount - 1);
      // Do NOT decrement all-time pitches when removing daily count
    }
  };

  if (isExcluded) {
    return (
      <div className={`rounded-3xl border-2 shadow-xl transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-300'
      }`}>
        <div className={`p-6 border-b ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white border-gray-700'
            : 'bg-gradient-to-r from-gray-700 to-gray-800 text-white border-gray-200'
        }`}>
          <h3 className="text-xl font-bold">OUTREACH PITCHES</h3>
          <p className={`text-lg mt-1 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-300'
          }`}>
            Sunday - Day Off
          </p>
        </div>
        <div className="p-6">
          <div className={`text-center py-8 rounded-xl ${
            theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-100'
          }`}>
            <div className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              🎉 Rest Day
            </div>
            <div className={`text-lg mt-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              No outreach required today
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">OUTREACH PITCHES</h3>
            <p className={`text-lg mt-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-300'
            }`}>
              Daily Minimum: 5 pitches
            </p>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${
              totalPitches >= targetPitches 
                ? 'text-emerald-400' 
                : totalPitches >= 3 
                  ? 'text-amber-400' 
                  : 'text-rose-400'
            }`}>
              {totalPitches}/5
            </div>
            <div className={`text-base ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-300'
            }`}>
              Today's Total
            </div>
          </div>
        </div>
        
        {/* Progress Bar - Concise with larger font */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <div className={`text-lg font-bold ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}>
              Daily Progress
            </div>
            <div className={`text-2xl font-bold ${
              totalPitches >= targetPitches 
                ? 'text-emerald-400' 
                : totalPitches >= 3 
                  ? 'text-amber-400' 
                  : 'text-rose-400'
            }`}>
              {((totalPitches / targetPitches) * 100).toFixed(0)}%
            </div>
          </div>
          <div className={`h-4 rounded-full overflow-hidden ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
          }`}>
            <div 
              className={`h-full transition-all duration-700 ease-out ${
                totalPitches >= targetPitches 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' 
                  : totalPitches >= 3 
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400' 
                    : 'bg-gradient-to-r from-rose-500 to-rose-400'
              }`}
              style={{ width: `${Math.min((totalPitches / targetPitches) * 100, 120)}%` }}
            ></div>
          </div>
          <div className={`flex justify-between text-lg font-medium mt-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <span>0</span>
            <span className="font-bold">5 Target</span>
            <span>10+</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Platform Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {Object.entries(pitches).map(([platform, count]) => (
            <div 
              key={platform}
              className={`p-4 rounded-xl border-2 ${
                theme === 'dark'
                  ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getPlatformColor(platform)} flex items-center justify-center text-white`}>
                    {getPlatformIcon(platform)}
                  </div>
                  <div>
                    <div className={`text-lg font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {getPlatformName(platform)}
                    </div>
                    <div className={`text-base ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Today: {count} pitches
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {count}
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    today
                  </div>
                </div>
              </div>
              
              {/* All-time total */}
              <div className={`mb-3 p-2 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800/70' : 'bg-gray-100'
              }`}>
                <div className="flex justify-between items-center">
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    All-time total:
                  </div>
                  <div className={`text-lg font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {allTimePitches[platform as keyof typeof allTimePitches]}
                  </div>
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRemovePitch(platform)}
                    disabled={isSaved || count <= 0}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSaved || count <= 0
                        ? theme === 'dark'
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    <FiMinus className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleAddPitch(platform)}
                    disabled={isSaved || count >= 10}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSaved || count >= 10
                        ? theme === 'dark'
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Max: 10/day
                </div>
              </div>
              
              {/* Progress indicator - Fixed to show color */}
              <div className="mt-3">
                <div className={`h-2 rounded-full overflow-hidden ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                }`}>
                  <div 
                    className={`h-full transition-all duration-500 ease-out ${
                      count >= 5 
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' 
                        : count >= 3 
                          ? 'bg-gradient-to-r from-amber-500 to-amber-400' 
                          : 'bg-gradient-to-r from-rose-500 to-rose-400'
                    }`}
                    style={{ width: `${Math.min((count / 5) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className={`flex justify-between text-sm mt-1.5 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  <span>0</span>
                  <span className="font-medium">{count}/5</span>
                  <span>5</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Summary Card */}
        <div className={`p-5 rounded-xl border-2 ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700'
            : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className={`text-xl font-bold ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Daily Summary
              </div>
              <div className={`text-lg font-medium mt-1 ${
                totalPitches >= targetPitches 
                  ? 'text-emerald-500' 
                  : totalPitches >= 3 
                    ? 'text-amber-500' 
                    : 'text-rose-500'
              }`}>
                {totalPitches >= targetPitches 
                  ? `✅ Great job! ${totalPitches} pitches sent` 
                  : `⚠ Need ${targetPitches - totalPitches} more pitches`}
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {((totalPitches / targetPitches) * 100).toFixed(0)}%
              </div>
              <div className={`text-base ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                of target
              </div>
            </div>
          </div>
          
          {/* Concise Summary: single stacked bar and larger counts */}
          <div className={`mt-4 pt-4 border-t ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
          }`}>
            <div className="text-center mb-3">
              <div className={`text-lg font-bold ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Daily Summary
              </div>
              <div className={`text-2xl font-semibold mt-1 ${
                totalPitches >= targetPitches 
                  ? 'text-emerald-500' 
                  : totalPitches >= 3 
                    ? 'text-amber-500' 
                    : 'text-rose-500'
              }`}>
                {totalPitches} / {targetPitches} pitches
              </div>
            </div>

            {/* Stacked bar showing per-platform contribution */}
            <div className="w-full h-6 rounded-full overflow-hidden flex" role="progressbar" aria-valuenow={totalPitches} aria-valuemin={0} aria-valuemax={10}>
              {Object.entries(pitches).map(([platform, count]) => {
                const width = totalPitches > 0 ? `${(count / Math.max(1, totalPitches)) * 100}%` : '0%';
                return (
                  <div
                    key={platform}
                    className={`h-full ${getPlatformColor(platform)} transition-all`}
                    style={{ width }}
                  />
                );
              })}
              {/* If there is any remaining gap to target, show a neutral segment */}
              <div className={`h-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} style={{ width: `${Math.max(0, ((targetPitches - Math.min(totalPitches, targetPitches)) / targetPitches) * 100)}%` }} />
            </div>

            {/* Small legend with larger fonts */}
            <div className="flex justify-between items-center mt-3 text-sm">
              {Object.entries(pitches).map(([platform, count]) => (
                <div key={platform} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${getPlatformColor(platform)}`} />
                  <div className={`text-base font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {getPlatformName(platform)}: <span className="font-bold text-xl">{count}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* All-time total summary */}
            <div className={`text-center text-lg font-medium mt-3 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              All-time Total Pitches: <span className={`font-bold text-2xl ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {Object.values(allTimePitches).reduce((a, b) => a + b, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutreachDetails;