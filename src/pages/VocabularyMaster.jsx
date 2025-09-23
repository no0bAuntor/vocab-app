import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import phase1Words from '../data/phase1/vocabulary-words.json';
import phase2Words from '../data/phase2/vocabulary-words.json';
import phase3Words from '../data/phase3/vocabulary-words.json';

export default function VocabularyMaster({ isDarkMode, toggleDarkMode }) {
  const [activePhase, setActivePhase] = useState('all');
  
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
          Words {phaseIndex === 0 ? '1-10' : phaseIndex === 1 ? '11-20' : '21-30'}
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
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating sparkles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 ${
              isDarkMode ? 'bg-blue-400/30' : 'bg-blue-500/20'
            } rounded-full animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}

        {/* Glowing orbs */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-32 h-32 rounded-full ${
              isDarkMode 
                ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10' 
                : 'bg-gradient-to-r from-purple-200/30 to-blue-200/30'
            } blur-xl animate-float`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
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

            {/* Navigation Links */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Link 
                to="/"
                className={`px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                }`}
              >
                🏠 Home
              </Link>
              <Link 
                to="/phase1"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                📚 Phase 1 Practice
              </Link>
              <Link 
                to="/phase2"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                📖 Phase 2 Practice
              </Link>
              <Link 
                to="/phase3"
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                📝 Phase 3 Practice
              </Link>
            </div>

            {/* Phase Filter */}
            <div className="flex justify-center mb-8">
              <div className={`inline-flex rounded-lg p-1 ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                {['all', '1', '2', '3'].map((phase) => (
                  <button
                    key={phase}
                    onClick={() => setActivePhase(phase)}
                    className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                      activePhase === phase
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                        : isDarkMode
                          ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {phase === 'all' ? 'All Phases' : `Phase ${phase}`}
                  </button>
                ))}
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
                  3
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

      {/* Add CSS for Bengali text and animations */}
      <style jsx>{`
        .bangla-text {
          font-family: 'SolaimanLipi', 'Kalpurush', 'Nikosh', sans-serif;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}