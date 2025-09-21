// src/App.js
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Phase1VocabularyHome from './pages/phase1/VocabularyHome';
import Phase1VocabularyQuiz from './pages/phase1/VocabularyQuiz';
import Phase2VocabularyHome from './pages/phase2/VocabularyHome';
import Phase2VocabularyQuiz from './pages/phase2/VocabularyQuiz';

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
    <Router>
      <div className="App">
        <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <Routes>
          <Route path="/" element={<Phase1VocabularyHome isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/quiz" element={<Phase1VocabularyQuiz isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/phase2" element={<Phase2VocabularyHome isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/quiz-phase2" element={<Phase2VocabularyQuiz isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
