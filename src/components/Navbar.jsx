import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar({ isDarkMode, toggleDarkMode }) {
  const [isVocabOpen, setIsVocabOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-md ${
      isDarkMode 
        ? 'bg-gray-900/90 border-gray-700' 
        : 'bg-white/90 border-gray-200'
    } border-b shadow-sm`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">📚</span>
            <span className={`text-lg md:text-xl font-bold bg-gradient-to-r ${
              isDarkMode 
                ? 'from-blue-400 to-purple-400' 
                : 'from-blue-600 to-purple-600'
            } bg-clip-text text-transparent hidden sm:block`}>
              Vocabulary Master
            </span>
            <span className={`text-sm font-bold bg-gradient-to-r ${
              isDarkMode 
                ? 'from-blue-400 to-purple-400' 
                : 'from-blue-600 to-purple-600'
            } bg-clip-text text-transparent sm:hidden`}>
              Vocab
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Vocabulary Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsVocabOpen(!isVocabOpen);
                  setIsQuizOpen(false);
                }}
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-200 min-w-[120px] justify-between ${
                  isActive('/') 
                    ? 'bg-blue-500 text-white' 
                    : isDarkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="font-medium">Vocabulary</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isVocabOpen ? 'rotate-180' : ''
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Vocabulary Dropdown Menu */}
              {isVocabOpen && (
                <div className={`absolute top-full right-0 mt-2 py-2 w-40 rounded-lg shadow-lg border z-50 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                } backdrop-blur-md`}>
                  <Link
                    to="/"
                    onClick={() => setIsVocabOpen(false)}
                    className={`flex items-center px-4 py-2 transition-colors duration-200 ${
                      isActive('/')
                        ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                        : isDarkMode 
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">📖</span>
                    <span>Phase 1</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Quiz Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsQuizOpen(!isQuizOpen);
                  setIsVocabOpen(false);
                }}
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-200 min-w-[120px] justify-between ${
                  isActive('/quiz') 
                    ? 'bg-purple-500 text-white' 
                    : isDarkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="font-medium">Quiz</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isQuizOpen ? 'rotate-180' : ''
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Quiz Dropdown Menu */}
              {isQuizOpen && (
                <div className={`absolute top-full right-0 mt-2 py-2 w-40 rounded-lg shadow-lg border z-50 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                } backdrop-blur-md`}>
                  <Link
                    to="/quiz"
                    onClick={() => setIsQuizOpen(false)}
                    className={`flex items-center px-4 py-2 transition-colors duration-200 ${
                      isActive('/quiz')
                        ? isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
                        : isDarkMode 
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">🧠</span>
                    <span>Phase 1</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDarkMode
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Toggle dark mode"
            >
              <span className="text-lg">
                {isDarkMode ? '🌙' : '☀️'}
              </span>
            </button>
          </div>

          {/* Mobile Menu Button & Dark Mode Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDarkMode
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Toggle dark mode"
            >
              <span className="text-lg">
                {isDarkMode ? '🌙' : '☀️'}
              </span>
            </button>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDarkMode
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden border-t z-50 relative ${
            isDarkMode ? 'border-gray-700 bg-gray-900/95' : 'border-gray-200 bg-white/95'
          } backdrop-blur-md`}>
            <div className="px-4 py-2 space-y-1">
              {/* Vocabulary Section */}
              <div>
                <div className={`px-3 py-2 text-sm font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Vocabulary
                </div>
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-6 py-3 rounded-lg transition-colors duration-200 ${
                    isActive('/')
                      ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                      : isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">📖</span>
                  <span>Phase 1</span>
                </Link>
              </div>

              {/* Quiz Section */}
              <div>
                <div className={`px-3 py-2 text-sm font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Quiz
                </div>
                <Link
                  to="/quiz"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-6 py-3 rounded-lg transition-colors duration-200 ${
                    isActive('/quiz')
                      ? isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
                      : isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">🧠</span>
                  <span>Phase 1</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay to close dropdowns and mobile menu */}
      {(isVocabOpen || isQuizOpen) && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsVocabOpen(false);
            setIsQuizOpen(false);
          }}
        />
      )}
      
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
}

export default Navbar;
