import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

export default function ProtectedRoute({ children, phase, requireAuth = true }) {
  const { isAuthenticated, isPhaseUnlocked, getPhaseProgress } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // If authentication is required but user is not logged in
  if (requireAuth && !isAuthenticated) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="text-6xl mb-6">🔒</div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Authentication Required
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Please sign in to access your vocabulary learning journey.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              🔐 Sign In
            </button>
          </div>
        </div>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
          mode="login" 
        />
      </>
    );
  }

  // If phase is specified, check if it's unlocked
  if (phase && !isPhaseUnlocked(phase)) {
    const phaseProgress = getPhaseProgress(phase - 1); // Check previous phase
    const requiredScore = 45;
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <div className="text-center max-w-lg mx-auto px-6">
          <div className="text-6xl mb-6">🔐</div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Phase {phase} Locked
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You need to score at least <span className="font-bold text-purple-600">{requiredScore}/50</span> in 
            Phase {phase - 1} to unlock this phase.
          </p>
          
          {phaseProgress && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                📊 Phase {phase - 1} Progress
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Best Score:</span>
                  <span className={`font-bold ${
                    phaseProgress.bestScore >= requiredScore 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {phaseProgress.bestScore}/50
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Attempts:</span>
                  <span className="font-bold text-gray-800 dark:text-white">
                    {phaseProgress.attempts}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-4">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${
                      phaseProgress.bestScore >= requiredScore 
                        ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                        : 'bg-gradient-to-r from-red-500 to-orange-500'
                    }`}
                    style={{ width: `${Math.min(100, (phaseProgress.bestScore / requiredScore) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {phaseProgress.bestScore >= requiredScore 
                    ? "🎉 Requirements met! Phase should be unlocked." 
                    : `Need ${requiredScore - phaseProgress.bestScore} more points to unlock.`
                  }
                </p>
              </div>
            </div>
          )}
          
          <button
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 mr-4"
          >
            ← Go Back
          </button>
          
          <button
            onClick={() => window.location.href = phase > 1 ? `/phase${phase - 1}/quiz` : '/phase1/quiz'}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            📝 Take Phase {phase > 1 ? phase - 1 : 1} Quiz
          </button>
        </div>
      </div>
    );
  }

  // If all checks pass, render the protected content
  return children;
}