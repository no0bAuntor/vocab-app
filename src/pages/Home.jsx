import { useState, useEffect, useCallback } from "react";
import words from "../data/words.json";
import WordCard from "../components/WordCard";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if user previously selected dark mode
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  
  // Touch/Swipe state
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  
  const totalWords = words.length;

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const nextWord = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalWords);
  }, [totalWords]);

  const prevWord = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalWords) % totalWords);
  }, [totalWords]);

  const goToWord = (index) => {
    setCurrentIndex(index);
  };

  // Touch event handlers for swipe navigation
  const handleTouchStart = (e) => {
    setTouchEnd(null); // Reset touch end
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwipeActive(true);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsSwipeActive(false);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextWord(); // Swipe left = next word
    }
    if (isRightSwipe) {
      prevWord(); // Swipe right = previous word
    }
    
    setIsSwipeActive(false);
  };

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(!isDarkMode);
  }, [isDarkMode]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        nextWord();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        prevWord();
      } else if (event.key === 'Home') {
        event.preventDefault();
        setCurrentIndex(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        setCurrentIndex(totalWords - 1);
      } else if (event.key === 'r' || event.key === 'R') {
        event.preventDefault();
        setCurrentIndex(Math.floor(Math.random() * totalWords));
      } else if (event.key === 'd' || event.key === 'D') {
        event.preventDefault();
        toggleDarkMode();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [totalWords, nextWord, prevWord, toggleDarkMode]);

  return (
    <div className={`min-h-screen transition-all duration-300 relative overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`} style={{
      backgroundSize: '400% 400%',
      animation: 'gradientWave 15s ease-in-out infinite'
    }}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Bubbles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`bubble-${i}`}
            className={`absolute rounded-full ${
              isDarkMode 
                ? 'bg-gradient-to-t from-blue-400/20 to-purple-400/20' 
                : 'bg-gradient-to-t from-blue-200/30 to-purple-200/30'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              animation: `bubble ${8 + Math.random() * 4}s linear infinite`,
              animationDelay: `${Math.random() * 8}s`,
            }}
          />
        ))}

        {/* Floating Celebration Icons */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`float-${i}`}
            className="absolute text-2xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${6 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 6}s`,
            }}
          >
            {['🎉', '✨', '🌟', '💫', '🎊', '⭐', '🎈', '🎯'][i]}
          </div>
        ))}

        {/* Sparkles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className={`absolute w-2 h-2 ${
              isDarkMode ? 'bg-yellow-300' : 'bg-yellow-400'
            } rounded-full`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `sparkle ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}

        {/* Glowing Orbs */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`orb-${i}`}
            className={`absolute rounded-full blur-sm ${
              isDarkMode 
                ? 'bg-gradient-radial from-blue-400/10 to-transparent' 
                : 'bg-gradient-radial from-purple-300/20 to-transparent'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${60 + Math.random() * 100}px`,
              height: `${60 + Math.random() * 100}px`,
              animation: `pulseGlow ${8 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 8}s`,
            }}
          />
        ))}

        {/* Confetti (triggered on interactions) */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`confetti-${i}`}
            className={`absolute w-3 h-3 ${
              ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400'][i % 6]
            } rounded-full`}
            style={{
              left: `${Math.random() * 100}%`,
              animation: `confetti ${4 + Math.random() * 2}s linear infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-4 py-8">
        {/* Dark Mode Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleDarkMode}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
            }`}
            title="Toggle dark mode (D key)"
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
                isDarkMode ? 'translate-x-7' : 'translate-x-1'
              }`}
            >
              <span className="flex items-center justify-center h-full text-xs">
                {isDarkMode ? '🌙' : '☀️'}
              </span>
            </span>
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${
            isDarkMode 
              ? 'from-blue-400 to-purple-400' 
              : 'from-blue-600 to-purple-600'
          } bg-clip-text text-transparent mb-4`}>
            📚 Vocabulary Master
          </h1>
          <p className={`text-lg mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Master your vocabulary with interactive word cards
          </p>
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            💡 Use ← → arrow keys, Space, Home, End, R for navigation, or D for dark mode
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Progress</span>
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {currentIndex + 1} of {totalWords}
            </span>
          </div>
          <div className={`w-full rounded-full h-2 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalWords) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Word Card Container */}
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-center">
            {/* Left Navigation Button - Hidden on mobile */}
            <button
              onClick={prevWord}
              className={`mr-6 shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110 group hidden md:block ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                  : 'bg-white hover:bg-gray-50 text-gray-600'
              }`}
              disabled={totalWords <= 1}
              title="Previous word (← key)"
            >
              <svg className={`w-6 h-6 transition-colors ${
                isDarkMode 
                  ? 'text-gray-300 group-hover:text-blue-400' 
                  : 'text-gray-600 group-hover:text-blue-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Word Card */}
            <div 
              className={`flex-1 transition-transform duration-200 select-none touch-manipulation ${isSwipeActive ? 'scale-[0.98]' : ''}`}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ touchAction: 'pan-y pinch-zoom' }}
            >
              <WordCard 
                word={words[currentIndex]} 
                wordNumber={currentIndex + 1}
                totalWords={totalWords}
                isDarkMode={isDarkMode}
              />
            </div>
            
            {/* Right Navigation Button - Hidden on mobile */}
            <button
              onClick={nextWord}
              className={`ml-6 shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110 group hidden md:block ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                  : 'bg-white hover:bg-gray-50 text-gray-600'
              }`}
              disabled={totalWords <= 1}
              title="Next word (→ key or Space)"
            >
              <svg className={`w-6 h-6 transition-colors ${
                isDarkMode 
                  ? 'text-gray-300 group-hover:text-blue-400' 
                  : 'text-gray-600 group-hover:text-blue-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Mobile Swipe Indicator */}
          <div className="md:hidden mt-4 text-center">
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm ${
              isDarkMode 
                ? 'bg-gray-800/50 text-gray-400' 
                : 'bg-gray-100/50 text-gray-500'
            }`}>
              <span>👈</span>
              <span>Swipe to navigate</span>
              <span>👉</span>
            </div>
          </div>

          {/* Word Dots Navigation */}
          <div className="flex justify-center mt-8 space-x-2 max-w-full overflow-x-auto pb-4">
            {words.map((_, index) => (
              <button
                key={index}
                onClick={() => goToWord(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-blue-500 scale-125'
                    : isDarkMode 
                      ? 'bg-gray-600 hover:bg-gray-500' 
                      : 'bg-gray-300 hover:bg-gray-400'
                }`}
                title={`Word ${index + 1}: ${words[index].word}`}
              />
            ))}
          </div>

          {/* Quick Navigation */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={() => setCurrentIndex(0)}
              className={`px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                  : 'bg-white hover:bg-gray-50 text-gray-700'
              }`}
              title="First word (Home key)"
            >
              ⏮️ First
            </button>
            <button
              onClick={() => setCurrentIndex(Math.floor(Math.random() * totalWords))}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
              title="Random word (R key)"
            >
              🎲 Random
            </button>
            <button
              onClick={() => setCurrentIndex(totalWords - 1)}
              className={`px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                  : 'bg-white hover:bg-gray-50 text-gray-700'
              }`}
              title="Last word (End key)"
            >
              ⏭️ Last
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
