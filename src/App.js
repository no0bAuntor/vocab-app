// src/App.js
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import VocabularyMaster from './pages/VocabularyMaster';
import Phase1VocabularyHome from './pages/phase1/VocabularyHome';
import Phase1VocabularyQuiz from './pages/phase1/VocabularyQuiz';
import Phase2VocabularyHome from './pages/phase2/VocabularyHome';
import Phase2VocabularyQuiz from './pages/phase2/VocabularyQuiz';
import Phase3VocabularyHome from './pages/phase3/VocabularyHome';
import Phase3VocabularyQuiz from './pages/phase3/VocabularyQuiz';
import Phase4VocabularyHome from './pages/phase4/VocabularyHome';
import Phase4VocabularyQuiz from './pages/phase4/VocabularyQuiz';
import Phase5VocabularyHome from './pages/phase5/VocabularyHome';
import Phase5VocabularyQuiz from './pages/phase5/VocabularyQuiz';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  return (
    <AuthProvider>
      <Router>
  <div className={`App min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-pastel-cream'}`}>
          <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          <Routes>
            <Route path="/" element={<VocabularyMaster isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
            
            {/* Dashboard - Protected route */}
            <Route path="/dashboard" element={
              <ProtectedRoute requireAuth={true}>
                <Dashboard isDarkMode={isDarkMode} />
              </ProtectedRoute>
            } />
            
            {/* Phase 1 - Always accessible */}
            <Route path="/phase1" element={
              <ProtectedRoute requireAuth={true}>
                <Phase1VocabularyHome isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
              </ProtectedRoute>
            } />
            <Route path="/quiz" element={
              <ProtectedRoute requireAuth={true}>
                <Phase1VocabularyQuiz isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
              </ProtectedRoute>
            } />
            
            {/* Phase 2 - Requires Phase 1 completion */}
            <Route path="/phase2" element={
              <ProtectedRoute requireAuth={true} phase={2}>
                <Phase2VocabularyHome isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
              </ProtectedRoute>
            } />
            <Route path="/quiz-phase2" element={
              <ProtectedRoute requireAuth={true} phase={2}>
                <Phase2VocabularyQuiz isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
              </ProtectedRoute>
            } />
            
            {/* Phase 3 - Requires Phase 2 completion */}
            <Route path="/phase3" element={
              <ProtectedRoute requireAuth={true} phase={3}>
                <Phase3VocabularyHome isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
              </ProtectedRoute>
            } />
            <Route path="/quiz-phase3" element={
              <ProtectedRoute requireAuth={true} phase={3}>
                <Phase3VocabularyQuiz isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
              </ProtectedRoute>
            } />
            
            {/* Phase 4 - Requires Phase 3 completion */}
            <Route path="/phase4" element={
              <ProtectedRoute requireAuth={true} phase={4}>
                <Phase4VocabularyHome isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
              </ProtectedRoute>
            } />
            <Route path="/quiz-phase4" element={
              <ProtectedRoute requireAuth={true} phase={4}>
                <Phase4VocabularyQuiz isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
              </ProtectedRoute>
            } />
            
            {/* Phase 5 - Requires Phase 4 completion */}
            <Route path="/phase5" element={
              <ProtectedRoute requireAuth={true} phase={5}>
                <Phase5VocabularyHome isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
              </ProtectedRoute>
            } />
            <Route path="/quiz-phase5" element={
              <ProtectedRoute requireAuth={true} phase={5}>
                <Phase5VocabularyQuiz isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
