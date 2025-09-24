import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import phase1Words from '../data/phase1/vocabulary-words.json';
import phase2Words from '../data/phase2/vocabulary-words.json';
import phase3Words from '../data/phase3/vocabulary-words.json';
import phase4Words from '../data/phase4/vocabulary-words.json';
import phase5Words from '../data/phase5/vocabulary-words.json';

export default function VocabularyMaster({ isDarkMode, toggleDarkMode }) {
  const [activePhase, setActivePhase] = useState('all');
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [isPhaseFilterOpen, setIsPhaseFilterOpen] = useState(false);
  
  // Refs for click outside detection
  const navigationDropdownRef = useRef(null);
  const phaseFilterDropdownRef = useRef(null);
  
  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (navigationDropdownRef.current && !navigationDropdownRef.current.contains(event.target)) {
        setIsNavigationOpen(false);
      }
      if (phaseFilterDropdownRef.current && !phaseFilterDropdownRef.current.contains(event.target)) {
        setIsPhaseFilterOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Only use first 10 words from phase1 to match the app behavior
  const allPhases = [
    { 
      name: 'Phase 1', 
      words: phase1Words.slice(0, 10), 
      color: 'from-blue-500 to-purple-500',
      bgColor: isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50',
      borderColor: isDarkMode ? 'border-blue-500/30' : 'border-blue-200'
    },
    { 
      name: 'Phase 2', 
      words: phase2Words, 
      color: 'from-purple-500 to-pink-500',
      bgColor: isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50',
      borderColor: isDarkMode ? 'border-purple-500/30' : 'border-purple-200'
    },
    { 
      name: 'Phase 3', 
      words: phase3Words, 
      color: 'from-pink-500 to-red-500',
      bgColor: isDarkMode ? 'bg-pink-900/20' : 'bg-pink-50',
      borderColor: isDarkMode ? 'border-pink-500/30' : 'border-pink-200'
    },
    { 
      name: 'Phase 4', 
      words: phase4Words, 
      color: 'from-pink-500 to-red-500',
      bgColor: isDarkMode ? 'bg-pink-900/20' : 'bg-pink-50',
      borderColor: isDarkMode ? 'border-red-500/30' : 'border-pink-200'
    },
    { 
      name: 'Phase 5', 
      words: phase5Words, 
      color: 'from-pink-500 to-red-500',
      bgColor: isDarkMode ? 'bg-pink-900/20' : 'bg-pink-50',
      borderColor: isDarkMode ? 'border-red-500/30' : 'border-pink-200'
    }
  ];

  const filteredPhases = activePhase === 'all' ? allPhases : allPhases.filter((_, index) => index === parseInt(activePhase) - 1);

  const WordTable = ({ phase, phaseIndex }) => (
    <div className={`rounded-xl ${phase.bgColor} ${phase.borderColor} border-2 overflow-hidden shadow-lg mb-8`}>
      {/* Phase Header */}
      <div className={`bg-gradient-to-r ${phase.color} p-4 text-white`}>
        <h2 className="text-2xl font-bold flex items-center">
          <span className="text-3xl mr-3">
            {phaseIndex === 0 ? '📚' : phaseIndex === 1 ? '📖' : '📝'}
          </span>
          {phase.name} - {phase.words.length} Words
        </h2>
        <p className="text-white/90 mt-1">
          Words {phaseIndex === 0 ? '1-10' : 
                 phaseIndex === 1 ? '11-20' : 
                 phaseIndex === 2 ? '21-30' :
                 phaseIndex === 3 ? '31-40' : '41-50'}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} border-b`}>
              <th className={`text-left p-4 font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                #
              </th>
              <th className={`text-left p-4 font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                English Word
              </th>
              <th className={`text-left p-4 font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Part of Speech
              </th>
              <th className={`text-left p-4 font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Bengali Meaning (বাংলা অর্থ)
              </th>
              <th className={`text-left p-4 font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Explanation
              </th>
            </tr>
          </thead>
          <tbody>
            {phase.words.map((word, index) => (
              <tr 
                key={word.id} 
                className={`border-b transition-colors duration-200 hover:${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}
              >
                <td className={`p-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {(phaseIndex * 10) + index + 1}
                </td>
                <td className={`p-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  <span className="font-semibold text-lg">{word.word}</span>
                </td>
                <td className={`p-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    word.pos === 'noun' ? 'bg-blue-100 text-blue-800' :
                    word.pos === 'verb' ? 'bg-green-100 text-green-800' :
                    word.pos === 'adjective' ? 'bg-yellow-100 text-yellow-800' :
                    word.pos === 'adverb' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {word.pos}
                  </span>
                </td>
                <td className={`p-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  <span className="font-medium text-lg bangla-text">
                    {word.bengali}
                  </span>
                </td>
                <td className={`p-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm max-w-xs`}>
                  {word.Explanation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-all duration-300 relative overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Stunning 3D Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient mesh background */}
        <div className={`absolute inset-0 ${
          isDarkMode
            ? 'bg-gradient-to-br from-purple-900/20 via-blue-800/30 to-indigo-900/20'
            : 'bg-gradient-to-br from-blue-100/50 via-purple-100/30 to-pink-100/50'
        }`} />
        
        {/* Large floating 3D spheres */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`sphere-${i}`}
            className={`absolute rounded-full animate-float-3d ${
              isDarkMode
                ? [
                    'bg-gradient-to-br from-blue-500/20 to-cyan-600/30 shadow-2xl shadow-blue-500/20',
                    'bg-gradient-to-br from-purple-500/20 to-pink-600/30 shadow-2xl shadow-purple-500/20',
                    'bg-gradient-to-br from-indigo-500/20 to-blue-600/30 shadow-2xl shadow-indigo-500/20',
                    'bg-gradient-to-br from-cyan-500/20 to-teal-600/30 shadow-2xl shadow-cyan-500/20',
                    'bg-gradient-to-br from-pink-500/20 to-rose-600/30 shadow-2xl shadow-pink-500/20',
                    'bg-gradient-to-br from-violet-500/20 to-purple-600/30 shadow-2xl shadow-violet-500/20'
                  ][i]
                : [
                    'bg-gradient-to-br from-blue-200/40 to-cyan-300/50 shadow-xl shadow-blue-200/30',
                    'bg-gradient-to-br from-purple-200/40 to-pink-300/50 shadow-xl shadow-purple-200/30',
                    'bg-gradient-to-br from-indigo-200/40 to-blue-300/50 shadow-xl shadow-indigo-200/30',
                    'bg-gradient-to-br from-cyan-200/40 to-teal-300/50 shadow-xl shadow-cyan-200/30',
                    'bg-gradient-to-br from-pink-200/40 to-rose-300/50 shadow-xl shadow-pink-200/30',
                    'bg-gradient-to-br from-violet-200/40 to-purple-300/50 shadow-xl shadow-violet-200/30'
                  ][i]
            } blur-sm`}
            style={{
              width: `${120 + i * 20}px`,
              height: `${120 + i * 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${15 + i * 3}s`,
            }}
          />
        ))}

        {/* Medium floating geometric shapes */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`geo-${i}`}
            className={`absolute animate-rotate-3d ${
              i % 3 === 0 
                ? 'rounded-full' 
                : i % 3 === 1 
                  ? 'rotate-45 rounded-lg' 
                  : 'rounded-lg rotate-12'
            } ${
              isDarkMode
                ? [
                    'bg-gradient-to-tr from-emerald-500/15 to-green-600/25',
                    'bg-gradient-to-tr from-amber-500/15 to-orange-600/25',
                    'bg-gradient-to-tr from-red-500/15 to-pink-600/25',
                    'bg-gradient-to-tr from-blue-500/15 to-indigo-600/25'
                  ][i % 4]
                : [
                    'bg-gradient-to-tr from-emerald-200/30 to-green-300/40',
                    'bg-gradient-to-tr from-amber-200/30 to-orange-300/40',
                    'bg-gradient-to-tr from-red-200/30 to-pink-300/40',
                    'bg-gradient-to-tr from-blue-200/30 to-indigo-300/40'
                  ][i % 4]
            } backdrop-blur-sm`}
            style={{
              width: `${40 + (i % 4) * 15}px`,
              height: `${40 + (i % 4) * 15}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${12 + (i % 3) * 2}s`,
            }}
          />
        ))}

        {/* Floating particles/stars */}
        {[...Array(25)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className={`absolute w-1 h-1 rounded-full animate-twinkle ${
              isDarkMode
                ? [
                    'bg-blue-400/60',
                    'bg-purple-400/60',
                    'bg-cyan-400/60',
                    'bg-pink-400/60',
                    'bg-indigo-400/60'
                  ][i % 5]
                : [
                    'bg-blue-600/40',
                    'bg-purple-600/40',
                    'bg-cyan-600/40',
                    'bg-pink-600/40',
                    'bg-indigo-600/40'
                  ][i % 5]
            } shadow-lg`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
            }}
          />
        ))}

        {/* Flowing wave patterns */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`wave-${i}`}
            className={`absolute inset-0 opacity-20 animate-wave-flow`}
            style={{
              background: isDarkMode
                ? `radial-gradient(ellipse at ${20 + i * 30}% ${30 + i * 20}%, 
                   rgba(59, 130, 246, 0.15) 0%, 
                   rgba(147, 51, 234, 0.15) 25%, 
                   rgba(236, 72, 153, 0.15) 50%, 
                   transparent 70%)`
                : `radial-gradient(ellipse at ${20 + i * 30}% ${30 + i * 20}%, 
                   rgba(59, 130, 246, 0.1) 0%, 
                   rgba(147, 51, 234, 0.1) 25%, 
                   rgba(236, 72, 153, 0.1) 50%, 
                   transparent 70%)`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${20 + i * 5}s`,
              transform: `rotate(${i * 45}deg) scale(${1 + i * 0.2})`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r ${
              isDarkMode 
                ? 'from-blue-400 to-purple-400' 
                : 'from-blue-600 to-purple-600'
            } bg-clip-text text-transparent mb-4`}>
              📚 Vocabulary Master Reference
            </h1>
            <p className={`text-lg md:text-xl mb-6 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Complete vocabulary reference with Bengali meanings
            </p>

            {/* Navigation Dropdown */}
            <div className="flex justify-center mb-6">
              <div className="relative" ref={navigationDropdownRef}>
                <button
                  onClick={() => setIsNavigationOpen(!isNavigationOpen)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                      : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                  }`}
                >
                  <span>🧭 Navigation</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isNavigationOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 9l-7 7-7-7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
                
                {isNavigationOpen && (
                  <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 rounded-lg shadow-xl border z-50 ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="p-2">
                      <Link 
                        to="/"
                        className={`block w-full text-left px-4 py-2 rounded-md transition-all duration-200 hover:scale-105 ${
                          isDarkMode 
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        onClick={() => setIsNavigationOpen(false)}
                      >
                        🏠 Home
                      </Link>
                      <Link 
                        to="/phase1"
                        className="block w-full text-left px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-200 hover:scale-105 mb-1"
                        onClick={() => setIsNavigationOpen(false)}
                      >
                        📚 Phase 1 Practice
                      </Link>
                      <Link 
                        to="/phase2"
                        className="block w-full text-left px-4 py-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-200 hover:scale-105 mb-1"
                        onClick={() => setIsNavigationOpen(false)}
                      >
                        📖 Phase 2 Practice
                      </Link>
                      <Link 
                        to="/phase3"
                        className="block w-full text-left px-4 py-2 rounded-md bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white transition-all duration-200 hover:scale-105 mb-1"
                        onClick={() => setIsNavigationOpen(false)}
                      >
                        📝 Phase 3 Practice
                      </Link>
                      <Link 
                        to="/phase4"
                        className="block w-full text-left px-4 py-2 rounded-md bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white transition-all duration-200 hover:scale-105 mb-1"
                        onClick={() => setIsNavigationOpen(false)}
                      >
                        📊 Phase 4 Practice
                      </Link>
                      <Link 
                        to="/phase5"
                        className="block w-full text-left px-4 py-2 rounded-md bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white transition-all duration-200 hover:scale-105"
                        onClick={() => setIsNavigationOpen(false)}
                      >
                        🎯 Phase 5 Practice
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Phase Filter Dropdown */}
            <div className="flex justify-center mb-8">
              <div className="relative" ref={phaseFilterDropdownRef}>
                <button
                  onClick={() => setIsPhaseFilterOpen(!isPhaseFilterOpen)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  }`}
                >
                  <span>🔍 {activePhase === 'all' ? 'All Phases' : `Phase ${activePhase}`}</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isPhaseFilterOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 9l-7 7-7-7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
                
                {isPhaseFilterOpen && (
                  <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 rounded-lg shadow-xl border z-50 ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="p-2">
                      {['all', '1', '2', '3', '4', '5'].map((phase) => (
                        <button
                          key={phase}
                          onClick={() => {
                            setActivePhase(phase);
                            setIsPhaseFilterOpen(false);
                          }}
                          className={`block w-full text-left px-4 py-2 rounded-md font-medium transition-all duration-200 mb-1 ${
                            activePhase === phase
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                              : isDarkMode
                                ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          {phase === 'all' ? 'All Phases' : `Phase ${phase}`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto mb-8">
              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'
              } backdrop-blur-sm border ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  {allPhases.reduce((total, phase) => total + phase.words.length, 0)}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Total Words
                </div>
              </div>
              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'
              } backdrop-blur-sm border ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  5
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Learning Phases
                </div>
              </div>
            </div>
          </div>

          {/* Word Tables */}
          <div className="max-w-7xl mx-auto">
            {filteredPhases.map((phase, index) => (
              <WordTable key={phase.name} phase={phase} phaseIndex={allPhases.indexOf(phase)} />
            ))}
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              📚 Vocabulary Master - Learn, Practice, Excel! 
            </p>
          </div>
        </div>
      </div>

      {/* Add CSS for Bengali text and stunning 3D animations */}
      <style jsx>{`
        .bangla-text {
          font-family: 'SolaimanLipi', 'Kalpurush', 'Nikosh', sans-serif;
        }
        
        @keyframes float-3d {
          0% { 
            transform: translateY(0px) translateX(0px) rotateY(0deg) rotateX(0deg);
            opacity: 0.6;
          }
          25% { 
            transform: translateY(-20px) translateX(10px) rotateY(90deg) rotateX(15deg);
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-10px) translateX(-15px) rotateY(180deg) rotateX(-10deg);
            opacity: 1;
          }
          75% { 
            transform: translateY(15px) translateX(5px) rotateY(270deg) rotateX(20deg);
            opacity: 0.7;
          }
          100% { 
            transform: translateY(0px) translateX(0px) rotateY(360deg) rotateX(0deg);
            opacity: 0.6;
          }
        }
        
        @keyframes rotate-3d {
          0% { 
            transform: rotate(0deg) scale(1) rotateY(0deg);
            filter: hue-rotate(0deg);
          }
          25% { 
            transform: rotate(90deg) scale(1.1) rotateY(90deg);
            filter: hue-rotate(90deg);
          }
          50% { 
            transform: rotate(180deg) scale(0.9) rotateY(180deg);
            filter: hue-rotate(180deg);
          }
          75% { 
            transform: rotate(270deg) scale(1.05) rotateY(270deg);
            filter: hue-rotate(270deg);
          }
          100% { 
            transform: rotate(360deg) scale(1) rotateY(360deg);
            filter: hue-rotate(360deg);
          }
        }
        
        @keyframes twinkle {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% { 
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        @keyframes wave-flow {
          0% { 
            transform: translateX(-100%) translateY(-50%) rotate(0deg);
            opacity: 0;
          }
          50% { 
            opacity: 1;
          }
          100% { 
            transform: translateX(100%) translateY(50%) rotate(180deg);
            opacity: 0;
          }
        }
        
        .animate-float-3d {
          animation: float-3d ease-in-out infinite;
        }
        
        .animate-rotate-3d {
          animation: rotate-3d linear infinite;
        }
        
        .animate-twinkle {
          animation: twinkle ease-in-out infinite;
        }
        
        .animate-wave-flow {
          animation: wave-flow linear infinite;
        }
        
        /* Add perspective for 3D effects */
        body {
          perspective: 1000px;
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
}