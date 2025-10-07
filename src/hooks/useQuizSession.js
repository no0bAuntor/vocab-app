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
  const [orderedQuiz, setOrderedQuiz] = useState(quizData);
  const [questionOrder, setQuestionOrder] = useState(null);
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
        if (session && !session.sessionCompleted) {
          // If backend returned a saved question order, apply it to quizData
          if (session.questionOrder && Array.isArray(session.questionOrder) && session.questionOrder.length === quizData.length) {
            // Reorder quizData according to saved indices
            const newOrder = session.questionOrder;
            const reordered = newOrder.map(idx => quizData[idx]).filter(Boolean);
            setOrderedQuiz(reordered);
            setQuestionOrder(newOrder);
          } else {
            // No saved order - create one for this session
            const indices = quizData.map((_, i) => i);
            for (let i = indices.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [indices[i], indices[j]] = [indices[j], indices[i]];
            }
            setQuestionOrder(indices);
            setOrderedQuiz(indices.map(i => quizData[i]));
            // Persist initial session with questionOrder (no answers yet)
            await saveQuizSession(phase, -1, 0, [], indices);
          }

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
    // We intentionally omit `loadQuizSession` from the dependency list.
    // `loadQuizSession` is a function coming from AuthContext and can have a
    // different identity across provider re-renders (for example when the
    // app theme toggles). Re-running this effect on those identity changes
    // causes the session to reload unexpectedly and may change `current`.
    // Depend only on `phase` and `quizData.length` so we load once per quiz
    // type or when the quiz data changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, quizData.length]);

  // Save session progress after each answer
  useEffect(() => {
    if (sessionLoaded && !finished && showExplanation) {
      const saveSession = async () => {
        try {
          // Save the number of answered questions as currentQuestionIndex
          await saveQuizSession(phase, userAnswers.length - 1, score, userAnswers, questionOrder);
        } catch (error) {
          console.error(`Failed to save quiz session for phase ${phase}:`, error);
        }
      };

      saveSession();
    }
  }, [sessionLoaded, current, score, userAnswers, showExplanation, finished, saveQuizSession, phase, questionOrder]);

  // Complete session when quiz finishes
  useEffect(() => {
    if (finished && !progressUpdated) {
      const completeSession = async () => {
        try {
          const result = await completeQuizSession(phase, score, orderedQuiz.length);
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
  }, [finished, score, completeQuizSession, progressUpdated, phase, orderedQuiz.length]);

  const handleOption = (option) => {
    if (showExplanation) return;
    
    setSelected(option);
    setShowExplanation(true);
    
    const currentQ = orderedQuiz[current];
    if (!currentQ) return;

    const isCorrect = option === currentQ.answer;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    const newAnswer = {
      questionId: currentQ.id,
      selected: option,
      correct: currentQ.answer,
      isCorrect
    };

    // Replace existing answer for this question if present, otherwise append
    const existingIndex = userAnswers.findIndex(a => a.questionId === currentQ.id);
    if (existingIndex >= 0) {
      const updated = [...userAnswers];
      // adjust score: if replacing, recalc score from answers array not here
      updated[existingIndex] = newAnswer;
      setUserAnswers(updated);
      // Recalculate score from answers to keep consistent
      const recalculatedScore = updated.reduce((acc, a) => acc + (a.isCorrect ? 1 : 0), 0);
      setScore(recalculatedScore);
    } else {
      setUserAnswers([...userAnswers, newAnswer]);
    }
  };

  const handleNext = () => {
    if (current < orderedQuiz.length - 1) {
      const nextIndex = current + 1;
      setCurrent(nextIndex);
      // If next has an answer, show it; otherwise clear selection
      const nextQ = orderedQuiz[nextIndex];
      const nextAnswer = userAnswers.find(a => a.questionId === nextQ?.id);
      if (nextAnswer) {
        setSelected(nextAnswer.selected);
        setShowExplanation(true);
      } else {
        setSelected(null);
        setShowExplanation(false);
      }
    } else {
      setFinished(true);
    }
  };

  const jumpToQuestionNumber = (questionNum) => {
    const questionIndex = questionNum - 1; // Convert to 0-based index
    if (questionIndex >= 0 && questionIndex < orderedQuiz.length) {
      setCurrent(questionIndex);
      const q = orderedQuiz[questionIndex];
      const ans = userAnswers.find(a => a.questionId === q?.id);
      if (ans) {
        setSelected(ans.selected);
        setShowExplanation(true);
      } else {
        setSelected(null);
        setShowExplanation(false);
      }
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
    orderedQuiz,
    questionOrder,
    
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