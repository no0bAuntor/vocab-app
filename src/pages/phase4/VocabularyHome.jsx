import React, { useState, useEffect, useCallback } from "react";
import WordCard from "../../components/WordCard";
import phase4Words from "../../data/phase4/vocabulary-words.json";

function Phase4Home({ isDarkMode, toggleDarkMode }) {
  const [words] = useState(phase4Words);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const [cardTransition, setCardTransition] = useState(false);
  const [touchStart, setTouchStart] = useState(null);

  const totalWords = words.length;

  // Navigation functions
  const nextWordWithAnimation = useCallback(() => {
    if (currentIndex < totalWords - 1) {
      setCardTransition(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setCardTransition(false);
      }, 150);
    }
  }, [currentIndex, totalWords]);

  const prevWordWithAnimation = useCallback(() => {
    if (currentIndex > 0) {
      setCardTransition(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        setCardTransition(false);
      }, 150);
    }
  }, [currentIndex, totalWords]);

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
  }, [currentIndex, totalWords, nextWordWithAnimation, prevWordWithAnimation]);

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
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header with Progress */}
        <div className="pt-8 pb-4">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-6">
              <h1 className={`text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r ${
                isDarkMode 
                  ? 'from-blue-400 to-purple-400' 
                  : 'from-blue-600 to-purple-600'
              } bg-clip-text text-transparent`}>
                Phase 4 Vocabulary
              </h1>
              <p className={`text-sm md:text-base ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Words 31-40 • Master advanced vocabulary
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
          </div>
        </div>

        {/* Word Card Container */}
        <div className="max-w-4xl mx-auto px-2 md:px-0 flex-1 flex flex-col justify-center">
          <div className="relative flex items-center justify-center mb-8">
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
          </div>

          {/* Simple navigation - just left/right arrows with word counter */}
          <div className="flex justify-center items-center space-x-8 mt-8">
            {/* Previous button */}
            <button
              onClick={prevWordWithAnimation}
              disabled={currentIndex === 0}
              className={`p-4 rounded-full transition-all duration-200 hover:scale-110 ${
                currentIndex === 0
                  ? isDarkMode 
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-blue-400' 
                    : 'bg-white hover:bg-gray-50 text-gray-600 hover:text-blue-600 shadow-md'
              }`}
              title="Previous word"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Word counter */}
            <div className={`px-4 py-2 rounded-lg font-medium ${
              isDarkMode 
                ? 'bg-gray-800/50 text-gray-300' 
                : 'bg-white/50 text-gray-600 shadow-sm'
            }`}>
              {currentIndex + 1} / {totalWords}
            </div>

            {/* Next button */}
            <button
              onClick={nextWordWithAnimation}
              disabled={currentIndex === totalWords - 1}
              className={`p-4 rounded-full transition-all duration-200 hover:scale-110 ${
                currentIndex === totalWords - 1
                  ? isDarkMode 
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-blue-400' 
                    : 'bg-white hover:bg-gray-50 text-gray-600 hover:text-blue-600 shadow-md'
              }`}
              title="Next word"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Phase4Home;