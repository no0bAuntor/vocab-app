import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import words from "../data/words.json";
import WordCard from "../components/WordCard";

export default function Home({ isDarkMode, toggleDarkMode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Touch/Swipe state
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [cardTransition, setCardTransition] = useState(false);
  
  const totalWords = words.length;

  const nextWord = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalWords);
  }, [totalWords]);

  const prevWord = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalWords) % totalWords);
  }, [totalWords]);

  // Animated navigation functions for arrow clicks
  const nextWordWithAnimation = useCallback(() => {
    setCardTransition(true);
    setSwipeDistance(-window.innerWidth);
    setTimeout(() => {
      nextWord();
      setSwipeDistance(window.innerWidth);
      setTimeout(() => setSwipeDistance(0), 150);
    }, 150);
    setTimeout(() => setCardTransition(false), 300);
  }, [nextWord]);

  const prevWordWithAnimation = useCallback(() => {
    setCardTransition(true);
    setSwipeDistance(window.innerWidth);
    setTimeout(() => {
      prevWord();
      setSwipeDistance(-window.innerWidth);
      setTimeout(() => setSwipeDistance(0), 150);
    }, 150);
    setTimeout(() => setCardTransition(false), 300);
  }, [prevWord]);

  const goToWord = (index) => {
    setCurrentIndex(index);
  };

  // Touch event handlers for swipe navigation
  // Touch event handlers for swipe navigation and animation
  const handleTouchStart = (e) => {
    setTouchEnd(null); // Reset touch end
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwipeActive(true);
    setSwipeDistance(0);
    setCardTransition(false);
  };

  const handleTouchMove = (e) => {
    const currentX = e.targetTouches[0].clientX;
    setTouchEnd(currentX);
    if (touchStart !== null) {
      setSwipeDistance(currentX - touchStart);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsSwipeActive(false);
      setSwipeDistance(0);
      return;
    }
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    setCardTransition(true);
    if (isLeftSwipe) {
      setSwipeDistance(-window.innerWidth); // Animate out left
      setTimeout(() => {
        nextWord();
        setSwipeDistance(window.innerWidth); // Animate in right
        setTimeout(() => setSwipeDistance(0), 150);
      }, 150);
    } else if (isRightSwipe) {
      setSwipeDistance(window.innerWidth); // Animate out right
      setTimeout(() => {
        prevWord();
        setSwipeDistance(-window.innerWidth); // Animate in left
        setTimeout(() => setSwipeDistance(0), 150);
      }, 150);
    } else {
      setSwipeDistance(0);
    }
    setIsSwipeActive(false);
    setTimeout(() => setCardTransition(false), 300);
  };

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
        <div className="container mx-auto px-3 md:px-4 py-8">
        <div className="text-center mb-8">
          <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${
            isDarkMode 
              ? 'from-blue-400 to-purple-400' 
              : 'from-blue-600 to-purple-600'
          } bg-clip-text text-transparent mb-4`}>
            📚 Vocabulary Master
          </h1>
          <p className={`text-base md:text-lg mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Master your vocabulary with interactive word cards
          </p>
        </div>

        {/* Quiz Navigation */}
        <div className="max-w-4xl mx-auto mb-8 text-center">
          <Link 
            to="/quiz"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl transform hover:scale-105 font-semibold text-lg"
          >
            🧠 Take Phase 1 Quiz
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className={`text-sm mt-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Test your knowledge with 110 questions about the first 10 words
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

          {/* Quick Navigation */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={() => setCurrentIndex(0)}
              className={`px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                  : 'bg-white hover:bg-gray-50 text-gray-700'
              }`}
              title="First word"
            >
              ⏮️ First
            </button>
            <button
              onClick={() => setCurrentIndex(Math.floor(Math.random() * totalWords))}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
              title="Random word"
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
              title="Last word"
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
