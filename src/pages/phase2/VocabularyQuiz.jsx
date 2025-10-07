import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuizSession } from "../../hooks/useQuizSession";
import phase2Quiz from "../../data/phase2/quiz-questions.json";

function Phase2Quiz({ isDarkMode }) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const {
    current,
    selected,
    showExplanation,
    score,
    finished,
    userAnswers,
    jumpToQuestion,
    progressUpdated,
    sessionLoaded,
    resumingSession,
    handleOption,
    handleNext,
    jumpToQuestionNumber,
    handleJumpInputChange,
    handleJumpSubmit,
    restartQuiz,
    orderedQuiz
  } = useQuizSession(2, phase2Quiz);

  if (finished) {
    const total = (orderedQuiz && orderedQuiz.length) || phase2Quiz.length;
    const percentage = Math.round((score / total) * 100);
    return (
      <div className={`min-h-screen transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className={`p-8 rounded-xl shadow-lg text-center quiz-card`}>
              <div className="mb-6">
                <h1 className={`text-3xl font-bold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>🎉 Quiz Completed!</h1>
                <div className="text-6xl mb-4">
                  {percentage >= 80 ? '🏆' : percentage >= 60 ? '🎯' : '📚'}
                </div>
                <p className={`text-xl mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Your Score: <span className="font-bold text-2xl bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    {score}/{total}
                  </span>
                </p>
                <p className={`text-lg ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Percentage: {percentage}%
                </p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={restartQuiz}
                  className="w-full px-6 py-3 quiz-accent rounded-lg font-semibold transition-all duration-200 hover:shadow-lg"
                >
                  🔄 Retake Quiz
                </button>
                <Link 
                  to="/phase2"
                  className={`block w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg text-center ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  📚 Study Phase 2 Words
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const q = (orderedQuiz && orderedQuiz[current]) || phase2Quiz[current];

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDarkMode ? 'theme-quiz-dark' : 'theme-quiz-light'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link 
            to="/phase2"
            className={`px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg ${
              isDarkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                : 'bg-white hover:bg-gray-50 text-gray-700'
            }`}
          >
            ← Back to Phase 2
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Quiz Header */}
          <div className="text-center mb-8">
            <h1 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${
              isDarkMode 
                ? 'from-blue-400 to-purple-400' 
                : 'from-blue-600 to-purple-600'
            } bg-clip-text text-transparent mb-4`}>
              🧠 Phase 2 Quiz
            </h1>
            <p className={`text-lg ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Test your knowledge of vocabulary words 11-20
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Progress</span>
              <span className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {current + 1} of {(orderedQuiz && orderedQuiz.length) || phase2Quiz.length}
              </span>
            </div>
            <div className={`w-full rounded-full h-3 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${((current + 1) / ((orderedQuiz && orderedQuiz.length) || phase2Quiz.length)) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Top info and Reset Button (Jump controls removed) */}
          <div className={`p-4 rounded-xl shadow-md mb-6 ${
            isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'
          } backdrop-blur-md border ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between gap-4">
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Your progress will be saved automatically. Please answer the current question to proceed to the next one.</p>

              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105 flex items-center gap-2 ${
                  isDarkMode
                    ? 'bg-red-900/50 hover:bg-red-800/70 text-red-300 border border-red-700'
                    : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
                }`}
                title="Reset quiz to start from question 1"
              >
                <span>🔄</span>
                <span>Reset Quiz</span>
              </button>
            </div>
          </div>

          {/* Quiz Card */}
          <div className={`p-8 rounded-xl shadow-lg mb-6 quiz-card`}>
            {/* Question */}
            <div className="mb-8">
              <h2 className={`text-xl font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Question {q.id}
              </h2>
              <p className={`text-lg md:text-xl leading-relaxed ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                {q.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-4 mb-8">
              {Object.entries(q.options).map(([key, option]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => handleOption(key)}
                  disabled={showExplanation}
                  className={`w-full p-4 rounded-lg text-left transition-all duration-200 hover:scale-[1.02] ${
                    selected === key
                      ? selected === q.answer
                        ? isDarkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
                        : isDarkMode ? 'bg-red-600 text-white' : 'bg-red-500 text-white'
                      : key === q.answer && showExplanation
                        ? isDarkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
                        : isDarkMode
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span className="font-semibold mr-3">{key.toUpperCase()}.</span>
                  {option}
                </button>
              ))}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className={`p-6 rounded-lg mb-6 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-start space-x-2 mb-2">
                  <span className="text-xl">
                    {selected === q.answer ? '✅' : '❌'}
                  </span>
                  <span className={`font-semibold ${
                    selected === q.answer
                      ? isDarkMode ? 'text-green-300' : 'text-green-800'
                      : isDarkMode ? 'text-red-300' : 'text-red-800'
                  }`}>
                    {selected === q.answer ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                <p className={`${
                  selected === q.answer
                    ? isDarkMode ? 'text-green-200' : 'text-green-700'
                    : isDarkMode ? 'text-red-200' : 'text-red-700'
                }`}>
                  <strong>Explanation:</strong> {q.explanation}
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-6">
              <button
                type="button"
                onClick={() => current > 0 && jumpToQuestionNumber(current)}
                disabled={current === 0}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  current === 0
                    ? isDarkMode 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isDarkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-800'
                } hover:scale-105`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <div className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Question {current + 1} of {(orderedQuiz && orderedQuiz.length) || phase2Quiz.length}
              </div>

              <button
                type="button"
                onClick={() => jumpToQuestionNumber(current + 2)}
                disabled={current === ((orderedQuiz && orderedQuiz.length) || phase2Quiz.length) - 1 || !(userAnswers.find(a => a.questionId === q.id))}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  current === ((orderedQuiz && orderedQuiz.length) || phase2Quiz.length) - 1 || !(userAnswers.find(a => a.questionId === q.id))
                    ? isDarkMode 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isDarkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-800'
                } hover:scale-105`}
              >
                Next
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Next Button */}
            {showExplanation && (
              <div className="text-center">
                <button 
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3 quiz-accent rounded-lg font-semibold transition-all duration-200 hover:shadow-lg"
                >
                  {current < ((orderedQuiz && orderedQuiz.length) || phase2Quiz.length) - 1 ? 'Next Question →' : 'Finish Quiz 🎯'}
                </button>
              </div>
            )}
          </div>

          {/* Score Display */}
          <div className="text-center">
            <div className={`inline-flex items-center space-x-4 px-6 py-3 rounded-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-md`}>
              <span className={`font-semibold ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Score: {score}/{userAnswers.length}
              </span>
              <span className="text-lg">
                {score === userAnswers.length ? '🎉' : '📊'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`max-w-md w-full rounded-xl shadow-2xl ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">⚠️</span>
                <h3 className={`text-lg font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Reset Quiz?
                </h3>
              </div>
              
              <p className={`mb-6 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                This will restart the quiz from question 1. Your current progress and score will be lost. Are you sure you want to continue?
              </p>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    restartQuiz();
                    setShowResetConfirm(false);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200"
                >
                  Yes, Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Phase2Quiz;