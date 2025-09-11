import React, { useState } from "react";
import { Link } from "react-router-dom";
import phase1Quiz from "../data/phase1-quiz.json";

function Quiz({ isDarkMode, toggleDarkMode }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  const handleOption = (option) => {
    if (showExplanation) return;
    
    setSelected(option);
    setShowExplanation(true);
    
    const isCorrect = option === phase1Quiz[current].answer;
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setUserAnswers([...userAnswers, {
      questionId: phase1Quiz[current].id,
      selected: option,
      correct: phase1Quiz[current].answer,
      isCorrect
    }]);
  };

  const handleNext = () => {
    if (current < phase1Quiz.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrent(0);
    setSelected(null);
    setShowExplanation(false);
    setScore(0);
    setFinished(false);
    setUserAnswers([]);
  };

  if (finished) {
    const percentage = ((score / phase1Quiz.length) * 100).toFixed(1);
    return (
      <div className={`min-h-screen transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                  : 'bg-white hover:bg-gray-50 text-gray-700'
              }`}
            >
              ← Back to Home
            </Link>
          </div>

          <div className="max-w-2xl mx-auto text-center">
            <div className={`p-8 rounded-xl shadow-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="mb-6">
                <div className={`text-6xl mb-4 ${
                  percentage >= 80 ? 'text-green-500' : 
                  percentage >= 60 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'}
                </div>
                <h2 className={`text-3xl font-bold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Quiz Complete!
                </h2>
                <div className={`text-5xl font-bold mb-2 ${
                  percentage >= 80 ? 'text-green-500' : 
                  percentage >= 60 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {percentage}%
                </div>
                <p className={`text-xl ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  You scored {score} out of {phase1Quiz.length} questions
                </p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={restartQuiz}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg"
                >
                  🔄 Retake Quiz
                </button>
                <Link 
                  to="/"
                  className={`block w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg text-center ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  📚 Study Words
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const q = phase1Quiz[current];

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link 
            to="/" 
            className={`px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg ${
              isDarkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                : 'bg-white hover:bg-gray-50 text-gray-700'
            }`}
          >
            ← Back to Home
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
              🧠 Phase 1 Quiz
            </h1>
            <p className={`text-lg ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Test your knowledge of the first 10 vocabulary words
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Progress</span>
              <span className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {current + 1} of {phase1Quiz.length}
              </span>
            </div>
            <div className={`w-full rounded-full h-3 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${((current + 1) / phase1Quiz.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Quiz Card */}
          <div className={`p-8 rounded-xl shadow-lg mb-6 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            {/* Question */}
            <div className="mb-8">
              <h2 className={`text-xl font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Question {q.id}
              </h2>
              <p className={`text-lg leading-relaxed ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                {q.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {Object.entries(q.options).map(([key, value]) => (
                <button
                  key={key}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    selected === key
                      ? selected === q.answer
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : 'border-red-500 bg-red-50 text-red-800'
                      : showExplanation && key === q.answer
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : isDarkMode
                          ? 'border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-200'
                          : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700'
                  } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
                  onClick={() => handleOption(key)}
                  disabled={showExplanation}
                >
                  <span className="font-semibold">{key.toUpperCase()}.</span> {value}
                </button>
              ))}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className={`p-4 rounded-lg mb-6 ${
                selected === q.answer
                  ? isDarkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-200'
                  : isDarkMode ? 'bg-red-900/30 border border-red-700' : 'bg-red-50 border border-red-200'
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

            {/* Next Button */}
            {showExplanation && (
              <div className="text-center">
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg"
                >
                  {current < phase1Quiz.length - 1 ? 'Next Question →' : 'Finish Quiz 🎯'}
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
                Score: {score}/{current + (showExplanation ? 1 : 0)}
              </span>
              <span className="text-lg">
                {score === current + (showExplanation ? 1 : 0) ? '🎉' : '📊'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
