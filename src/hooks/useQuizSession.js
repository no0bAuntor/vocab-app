import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// Custom hook for quiz session management
export const useQuizSession = (phase, quizData) => {
  const { 
    saveQuizSession, 
    loadQuizSession, 
    completeQuizSession, 
    resetQuizSession 
  } = useContext(AuthContext);
  
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [jumpToQuestion, setJumpToQuestion] = useState('');
  const [progressUpdated, setProgressUpdated] = useState(false);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [resumingSession, setResumingSession] = useState(false);

  // Load quiz session on component mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        const session = await loadQuizSession(phase);
        if (session && !session.sessionCompleted && session.currentQuestionIndex >= 0) {
          const answeredQuestions = session.sessionAnswers?.length || 0;
          
          // Only resume if there are answered questions and more questions remain
          if (answeredQuestions > 0 && answeredQuestions < quizData.length) {
            setResumingSession(true);
            // Resume from the next unanswered question
            setCurrent(answeredQuestions);
            setScore(session.sessionScore);
            setUserAnswers(session.sessionAnswers || []);
            
            // Hide resuming indicator after 3 seconds
            setTimeout(() => setResumingSession(false), 3000);
          }
        }
      } catch (error) {
        console.error(`Failed to load quiz session for phase ${phase}:`, error);
      } finally {
        setSessionLoaded(true);
      }
    };

    loadSession();
  }, [loadQuizSession, phase, quizData.length]);

  // Save session progress after each answer
  useEffect(() => {
    if (sessionLoaded && !finished && showExplanation) {
      const saveSession = async () => {
        try {
          // Save the number of answered questions as currentQuestionIndex
          await saveQuizSession(phase, userAnswers.length - 1, score, userAnswers);
        } catch (error) {
          console.error(`Failed to save quiz session for phase ${phase}:`, error);
        }
      };

      saveSession();
    }
  }, [sessionLoaded, current, score, userAnswers, showExplanation, finished, saveQuizSession, phase]);

  // Complete session when quiz finishes
  useEffect(() => {
    if (finished && !progressUpdated) {
      const completeSession = async () => {
        try {
          const result = await completeQuizSession(phase, score);
          if (result) {
            console.log(`Phase ${phase} session completed:`, result);
            setProgressUpdated(true);
          }
        } catch (error) {
          console.error(`Failed to complete Phase ${phase} session:`, error);
        }
      };
      
      completeSession();
    }
  }, [finished, score, completeQuizSession, progressUpdated, phase]);

  const handleOption = (option) => {
    if (showExplanation) return;
    
    setSelected(option);
    setShowExplanation(true);
    
    const isCorrect = option === quizData[current].answer;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);
    
    const newAnswer = {
      questionId: quizData[current].id,
      selected: option,
      correct: quizData[current].answer,
      isCorrect
    };
    
    setUserAnswers([...userAnswers, newAnswer]);
  };

  const handleNext = () => {
    if (current < quizData.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
    }
  };

  const jumpToQuestionNumber = (questionNum) => {
    const questionIndex = questionNum - 1; // Convert to 0-based index
    if (questionIndex >= 0 && questionIndex < quizData.length) {
      setCurrent(questionIndex);
      setSelected(null);
      setShowExplanation(false);
      setJumpToQuestion('');
    }
  };

  const handleJumpInputChange = (e) => {
    setJumpToQuestion(e.target.value);
  };

  const handleJumpSubmit = (e) => {
    e.preventDefault();
    const questionNum = parseInt(jumpToQuestion);
    if (!isNaN(questionNum)) {
      jumpToQuestionNumber(questionNum);
    }
  };

  const restartQuiz = async () => {
    try {
      // Reset session in backend
      await resetQuizSession(phase);
      
      // Reset local state
      setCurrent(0);
      setSelected(null);
      setShowExplanation(false);
      setScore(0);
      setFinished(false);
      setUserAnswers([]);
      setJumpToQuestion('');
      setProgressUpdated(false);
      setResumingSession(false);
    } catch (error) {
      console.error(`Failed to reset quiz session for phase ${phase}:`, error);
      // Still reset local state even if backend call fails
      setCurrent(0);
      setSelected(null);
      setShowExplanation(false);
      setScore(0);
      setFinished(false);
      setUserAnswers([]);
      setJumpToQuestion('');
      setProgressUpdated(false);
      setResumingSession(false);
    }
  };

  return {
    // State
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
    
    // Actions
    handleOption,
    handleNext,
    jumpToQuestionNumber,
    handleJumpInputChange,
    handleJumpSubmit,
    restartQuiz,
    
    // Setters (for specific use cases)
    setCurrent,
    setSelected,
    setShowExplanation,
    setJumpToQuestion
  };
};