import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AuthModal from "./AuthModal";

function Navbar({ isDarkMode, toggleDarkMode }) {
  const [isVocabOpen, setIsVocabOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  
  // Separate state for mobile dropdowns
  const [isMobileVocabOpen, setIsMobileVocabOpen] = useState(false);
  const [isMobileQuizOpen, setIsMobileQuizOpen] = useState(false);
  
  const location = useLocation();

  const { user, logout, isAuthenticated, isPhaseUnlocked } = useAuth();

  // Refs for click outside detection
  const practiceDropdownRef = useRef(null);
  const quizDropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (practiceDropdownRef.current && !practiceDropdownRef.current.contains(event.target)) {
        setIsVocabOpen(false);
      }
      if (quizDropdownRef.current && !quizDropdownRef.current.contains(event.target)) {
        setIsQuizOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

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
            {/* Master Reference Link */}
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive('/')
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md' 
                  : isDarkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg">📚</span>
              <span className="font-medium">Master Reference</span>
            </Link>

            {/* Vocabulary Dropdown */}
            <div className="relative" ref={practiceDropdownRef}>
              <button
                onClick={() => {
                  setIsVocabOpen(!isVocabOpen);
                  setIsQuizOpen(false);
                }}
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-200 min-w-[120px] justify-between ${
                  isActive('/phase1') || isActive('/phase2') || isActive('/phase3')
                    ? 'bg-blue-500 text-white' 
                    : isDarkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="font-medium">Practice</span>
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
                <div className={`absolute top-full right-0 mt-2 py-2 w-48 rounded-lg shadow-lg border z-50 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                } backdrop-blur-md`}>
                  {[1, 2, 3, 4, 5].map(phase => {
                    const isUnlocked = isAuthenticated ? isPhaseUnlocked(phase) : phase === 1;
                    const phaseEmojis = ['📖', '📚', '📝', '📊', '🎯'];
                    return (
                      <Link
                        key={phase}
                        to={isUnlocked ? `/phase${phase}` : '#'}
                        onClick={() => {
                          if (isUnlocked) {
                            setIsVocabOpen(false);
                          }
                        }}
                        className={`flex items-center justify-between px-4 py-2 transition-colors duration-200 ${
                          !isUnlocked 
                            ? 'opacity-50 cursor-not-allowed'
                            : isActive(`/phase${phase}`)
                              ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                              : isDarkMode 
                                ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="mr-3">{phaseEmojis[phase - 1]}</span>
                          <span>Phase {phase}</span>
                        </div>
                        {!isUnlocked && (
                          <span className="text-xs">🔒</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quiz Dropdown */}
            <div className="relative" ref={quizDropdownRef}>
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
                  <Link
                    to="/quiz-phase2"
                    onClick={() => setIsQuizOpen(false)}
                    className={`flex items-center px-4 py-2 transition-colors duration-200 ${
                      isActive('/quiz-phase2')
                        ? isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
                        : isDarkMode 
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">🎯</span>
                    <span>Phase 2</span>
                  </Link>
                  <Link
                    to="/quiz-phase3"
                    onClick={() => setIsQuizOpen(false)}
                    className={`flex items-center px-4 py-2 transition-colors duration-200 ${
                      isActive('/quiz-phase3')
                        ? isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
                        : isDarkMode 
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">🧠</span>
                    <span>Phase 3</span>
                  </Link>
                  <Link
                    to="/quiz-phase4"
                    onClick={() => setIsQuizOpen(false)}
                    className={`flex items-center px-4 py-2 transition-colors duration-200 ${
                      isActive('/quiz-phase4')
                        ? isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
                        : isDarkMode 
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">🧠</span>
                    <span>Phase 4</span>
                  </Link>
                  <Link
                    to="/quiz-phase5"
                    onClick={() => setIsQuizOpen(false)}
                    className={`flex items-center px-4 py-2 transition-colors duration-200 ${
                      isActive('/quiz-phase5')
                        ? isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
                        : isDarkMode 
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">🧠</span>
                    <span>Phase 5</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

            {/* Authentication & Dark Mode */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                // User Menu
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isDarkMode
                        ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:block font-medium">
                      {user?.username}
                    </span>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isUserMenuOpen ? 'rotate-180' : ''
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className={`absolute top-full right-0 mt-2 py-2 w-56 rounded-lg shadow-lg border z-50 ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-200'
                    } backdrop-blur-md`}>
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          👋 Hello, {user?.username}!
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          XP: {user?.totalXP || 0} • Level: {Math.floor((user?.totalXP || 0) / 100) + 1}
                        </p>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className={`flex items-center px-4 py-2 transition-colors duration-200 ${
                          isDarkMode 
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        📊 Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className={`flex items-center px-4 py-2 transition-colors duration-200 ${
                          isDarkMode 
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        👤 Profile
                      </Link>
                      <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className={`w-full text-left px-4 py-2 transition-colors duration-200 ${
                            isDarkMode 
                              ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          🚪 Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Auth buttons for non-authenticated users
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAuthClick('login')}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                      isDarkMode
                        ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    🔐 Sign In
                  </button>
                  <button
                    onClick={() => handleAuthClick('register')}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    🎓 Sign Up
                  </button>
                </div>
              )}

              {/* Dark Mode Toggle */}
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); toggleDarkMode(); }}
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
              type="button"
              onClick={(e) => { e.preventDefault(); toggleDarkMode(); }}
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
              
              {/* Mobile Authentication Section - At Top */}
              {!isAuthenticated && (
                <div className="pb-4 border-b border-gray-200 dark:border-gray-700 mb-4">
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        handleAuthClick('login');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
                        isDarkMode 
                          ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-3">🔐</span>
                      <span>Sign In</span>
                    </button>
                    <button
                      onClick={() => {
                        handleAuthClick('register');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-200"
                    >
                      <span className="mr-3">🎓</span>
                      <span>Sign Up</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Mobile User Menu - At Top for authenticated users */}
              {isAuthenticated && (
                <div className="pb-4 border-b border-gray-200 dark:border-gray-700 mb-4">
                  <div className="space-y-2">
                    <div className={`flex items-center px-4 py-3 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                        {user?.username?.charAt(0).toUpperCase()}
                      </div>
                      <span>Welcome, {user?.username}</span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
                        isDarkMode 
                          ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-3">🚪</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Vocabulary Dropdown */}
              <div className="mb-4">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsMobileVocabOpen(!isMobileVocabOpen);
                    if (!isMobileVocabOpen) {
                      setIsMobileQuizOpen(false); // Close quiz dropdown when opening vocab
                    }
                  }}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isDarkMode 
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-3">📚</span>
                    <span className="font-medium">Vocabulary</span>
                  </div>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isMobileVocabOpen ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isMobileVocabOpen && (
                  <div className="mt-2 ml-4 space-y-1">
                    <Link
                      to="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                        isActive('/')
                          ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                          : isDarkMode 
                            ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-3">📖</span>
                      <span>Phase 1</span>
                    </Link>
                    <Link
                      to="/phase2"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                        isActive('/phase2')
                          ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                          : isDarkMode 
                            ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-3">📚</span>
                      <span>Phase 2</span>
                    </Link>
                    <Link
                      to="/phase3"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                        isActive('/phase3')
                          ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                          : isDarkMode 
                            ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-3">📖</span>
                      <span>Phase 3</span>
                    </Link>
                    <Link
                      to="/phase4"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                        isActive('/phase4')
                          ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                          : isDarkMode 
                            ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-3">📖</span>
                      <span>Phase 4</span>
                    </Link>
                    <Link
                      to="/phase5"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                        isActive('/phase5')
                          ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                          : isDarkMode 
                            ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-3">�</span>
                      <span>Phase 5</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Quiz Dropdown */}
              <div className="mb-4">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsMobileQuizOpen(!isMobileQuizOpen);
                    if (!isMobileQuizOpen) {
                      setIsMobileVocabOpen(false); // Close vocab dropdown when opening quiz
                    }
                  }}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isDarkMode 
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-3">🧠</span>
                    <span className="font-medium">Quiz</span>
                  </div>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isMobileQuizOpen ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isMobileQuizOpen && (
                  <div className="mt-2 ml-4 space-y-1">
                    <Link
                      to="/quiz"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                        isActive('/quiz')
                          ? isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
                          : isDarkMode 
                            ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-3">🧠</span>
                      <span>Phase 1</span>
                    </Link>
                    <Link
                      to="/quiz-phase2"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                        isActive('/quiz-phase2')
                          ? isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
                          : isDarkMode 
                            ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-3">🧠</span>
                      <span>Phase 2</span>
                    </Link>
                    <Link
                      to="/quiz-phase3"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                        isActive('/quiz-phase3')
                          ? isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
                          : isDarkMode 
                            ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-3">🧠</span>
                      <span>Phase 3</span>
                    </Link>
                    <Link
                      to="/quiz-phase4"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                        isActive('/quiz-phase4')
                          ? isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
                          : isDarkMode 
                            ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-3">🧠</span>
                      <span>Phase 4</span>
                    </Link>
                    <Link
                      to="/quiz-phase5"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                        isActive('/quiz-phase5')
                          ? isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
                          : isDarkMode 
                            ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-3">🧠</span>
                      <span>Phase 5</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      {/* Overlay to close dropdowns (desktop only) */}
      {(isVocabOpen || isQuizOpen) && (
        <div 
          className="fixed inset-0 z-40 hidden md:block"
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

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        mode={authMode} 
      />
      </div>
    </nav>
  );
}

export default Navbar;
