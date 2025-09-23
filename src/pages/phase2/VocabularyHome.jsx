import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import WordCard from "../../components/WordCard";
import phase2Words from "../../data/phase2/vocabulary-words.json";

function Phase2Home({ isDarkMode, toggleDarkMode }) {
  const [words] = useState(phase2Words);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const [cardTransition, setCardTransition] = useState(false);
  const [touchStart, setTouchStart] = useState(null);

  const totalWords = words.length;

  // Navigation functions
  const nextWordWithAnimation = () => {
    if (currentIndex < totalWords - 1) {
      setCardTransition(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setCardTransition(false);
      }, 150);
    }
  };

  const prevWordWithAnimation = () => {
    if (currentIndex > 0) {
      setCardTransition(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        setCardTransition(false);
      }, 150);
    }
  };

  const goToWord = (index) => {
    if (index >= 0 && index < totalWords && index !== currentIndex) {
      setCardTransition(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setCardTransition(false);
      }, 150);
    }
  };

  // Touch handlers for swipe navigation
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
    setIsSwipeActive(true);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;
    
    const currentTouch = e.touches[0].clientX;
    const diff = touchStart - currentTouch;
    
    if (Math.abs(diff) > 10) {
      e.preventDefault();
      setSwipeDistance(diff); // Remove the negative sign
    }
  };

  const handleTouchEnd = () => {
    if (Math.abs(swipeDistance) > 100) {
      if (swipeDistance > 0 && currentIndex < totalWords - 1) {
        nextWordWithAnimation(); // Swipe left (right-to-left) = next word
      } else if (swipeDistance < 0 && currentIndex > 0) {
        prevWordWithAnimation(); // Swipe right (left-to-right) = previous word
      }
    }
    
    setSwipeDistance(0);
    setTouchStart(null);
    setIsSwipeActive(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight' && currentIndex < totalWords - 1) {
        nextWordWithAnimation();
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        prevWordWithAnimation();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, totalWords]);

  if (words.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-600 mb-4">📚</h1>
          <p className="text-xl text-gray-500">Loading vocabulary words...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Background Pattern */}
      <div className={`absolute inset-0 opacity-5 ${
        isDarkMode ? 'text-gray-600' : 'text-gray-400'
      }`}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-3 md:px-4 py-8">
        <div className="text-center mb-8">
          <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${
            isDarkMode 
              ? 'from-blue-400 to-purple-400' 
              : 'from-blue-600 to-purple-600'
          } bg-clip-text text-transparent mb-4`}>
            📚 Phase 2 - Vocabulary Master
          </h1>
          <p className={`text-base md:text-lg mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Master words 11-20 with interactive word cards
          </p>
        </div>

        {/* Word Card Container */}
        <div className="max-w-4xl mx-auto px-2 md:px-0">
          <div className="relative flex items-center">
            {/* Left Navigation Button - Hidden on mobile */}
            <button
              onClick={prevWordWithAnimation}
              className={`mr-4 md:mr-6 shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110 group hidden md:block ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                  : 'bg-white hover:bg-gray-50 text-gray-600'
              }`}
              disabled={totalWords <= 1}
              title="Previous word"
            >
              <svg className={`w-6 h-6 transition-colors ${
                isDarkMode 
                  ? 'text-gray-300 group-hover:text-blue-400' 
                  : 'text-gray-600 group-hover:text-blue-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Word Card with swipe animation */}
            <div
              className={`flex-1 px-1 md:px-0 select-none touch-manipulation md:cursor-default ${isSwipeActive ? 'cursor-grabbing md:cursor-default' : ''}`}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                touchAction: 'pan-y pinch-zoom',
                transition: cardTransition ? 'transform 0.15s cubic-bezier(.4,2,.3,1), opacity 0.15s' : 'transform 0.2s',
                transform: `translateX(${swipeDistance}px)`,
                opacity: Math.abs(swipeDistance) > 0 ? Math.max(0.4, 1 - Math.abs(swipeDistance) / 300) : 1,
              }}
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
              onClick={nextWordWithAnimation}
              className={`ml-4 md:ml-6 shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110 group hidden md:block ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                  : 'bg-white hover:bg-gray-50 text-gray-600'
              }`}
              disabled={totalWords <= 1}
              title="Next word"
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

          {/* Enhanced Dots Navigation */}
          <div className="flex justify-center items-center mt-8 mb-4 gap-3">
            {/* Left arrow for more words */}
            {currentIndex > 2 && (
              <button
                onClick={() => goToWord(Math.max(0, currentIndex - 5))}
                className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-blue-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-blue-600'
                }`}
                title="Previous 5 words"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            
            <div className={`flex items-center gap-3 px-6 py-3 rounded-full ${
              isDarkMode 
                ? 'bg-gray-800/60 border border-gray-700' 
                : 'bg-white/60 border border-gray-200'
            } backdrop-blur-md shadow-lg`}>
              {/* Previous indicator */}
              {currentIndex > 2 && (
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    isDarkMode ? 'bg-gray-500' : 'bg-gray-400'
                  }`}></div>
                  <div className={`w-1 h-1 rounded-full ${
                    isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                  }`}></div>
                </div>
              )}
              
              {/* Main dots (showing 5 maximum) */}
              {(() => {
                const startIndex = Math.max(0, Math.min(currentIndex - 2, totalWords - 5));
                const endIndex = Math.min(startIndex + 5, totalWords);
                const visibleDots = [];
                
                for (let i = startIndex; i < endIndex; i++) {
                  const isActive = i === currentIndex;
                  const distance = Math.abs(i - currentIndex);
                  
                  visibleDots.push(
                    <button
                      key={i}
                      onClick={() => goToWord(i)}
                      className={`relative transition-all duration-300 group ${
                        isActive ? 'scale-110' : 'hover:scale-105'
                      }`}
                      title={`Word ${i + 1}: ${words[i].word}`}
                    >
                      <div className={`rounded-full transition-all duration-300 ${
                        isActive 
                          ? 'w-10 h-4 bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/30' 
                          : distance === 1
                            ? 'w-3 h-3 bg-gradient-to-r from-blue-400/60 to-purple-400/60 hover:from-blue-500 hover:to-purple-500'
                            : 'w-2 h-2 bg-gradient-to-r from-gray-400/60 to-gray-500/60 hover:from-blue-400 hover:to-purple-400'
                      }`}>
                        {isActive && (
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse opacity-30"></div>
                        )}
                      </div>
                      
                      {/* Word number tooltip */}
                      <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ${
                        isDarkMode 
                          ? 'bg-gray-900 text-gray-200 border border-gray-700' 
                          : 'bg-white text-gray-700 border border-gray-200 shadow-md'
                      }`}>
                        {i + 1}
                      </div>
                    </button>
                  );
                }
                
                return visibleDots;
              })()}
              
              {/* Next indicator */}
              {currentIndex < totalWords - 3 && (
                <div className="flex items-center gap-1">
                  <div className={`w-1 h-1 rounded-full ${
                    isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                  }`}></div>
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    isDarkMode ? 'bg-gray-500' : 'bg-gray-400'
                  }`}></div>
                </div>
              )}
              
              {/* Progress text */}
              <div className={`ml-4 pl-4 border-l ${
                isDarkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-500'
              }`}>
                <span className="text-xs font-medium">
                  {currentIndex + 1}/{totalWords}
                </span>
              </div>
            </div>
            
            {/* Right arrow for more words */}
            {currentIndex < totalWords - 3 && (
              <button
                onClick={() => goToWord(Math.min(totalWords - 1, currentIndex + 5))}
                className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-blue-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-blue-600'
                }`}
                title="Next 5 words"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="text-center mt-6">
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/quiz-phase2"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                🎯 Take Phase 2 Quiz
              </Link>
              <Link 
                to="/"
                className={`px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                📖 Back to Phase 1
              </Link>
            </div>
          </div>

          {/* Mobile Instructions */}
          <div className="mt-8 md:hidden text-center">
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              💡 Swipe left/right to navigate between words
            </p>
          </div>

          {/* Desktop Instructions */}
          <div className="mt-8 hidden md:block text-center">
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              💡 Use arrow keys ← → or click navigation buttons to browse words
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Phase2Home;