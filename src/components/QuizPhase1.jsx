import React, { useState } from "react";

const quizData = [
  {
    id: 1,
    question: "The Bengali meaning 'মানুষবিদ্বেষী' corresponds to which English word?",
    options: {
      a: "Philanthropist",
      b: "Misanthrope",
      c: "Recluse",
      d: "Extrovert"
    },
    answer: "b",
    explanation: "Misanthrope means a person who hates and avoids humankind, which directly translates to 'মানুষবিদ্বেষী'."
  },
  {
    id: 2,
    question: "What is the primary part of speech for the word 'abate'?",
    options: {
      a: "Noun",
      b: "Adjective",
      c: "Verb",
      d: "Adverb"
    },
    answer: "c",
    explanation: "'Abate' is an action word, meaning to reduce or become less intense, making it a verb."
  },
  {
    id: 3,
    question: "Which of the following is a synonym for 'ephemeral'?",
    options: {
      a: "Permanent",
      b: "Enduring",
      c: "Fleeting",
      d: "Dogmatic"
    },
    answer: "c",
    explanation: "'Fleeting' means lasting for a very short time, which is the core meaning of 'ephemeral'."
  },
  {
    id: 4,
    question: "Select the antonym for 'aberrant'.",
    options: {
      a: "Deviant",
      b: "Stray",
      c: "Normal",
      d: "Perverse"
    },
    answer: "c",
    explanation: "'Aberrant' means departing from the norm. Therefore, its direct opposite is 'normal'."
  },
  {
    id: 5,
    question: "Complete the sentence: After the riot, the city center was a _____ of broken glass and overturned cars.",
    options: {
      a: "efficacy",
      b: "welter",
      c: "truculence",
      d: "calm"
    },
    answer: "b",
    explanation: "'Welter' means a state of confusion, turmoil, or chaos, which perfectly describes the scene after a riot."
  },
  {
    id: 6,
    question: "A person who is rigidly authoritative in their opinions and not open to debate is best described as:",
    options: {
      a: "Laconic",
      b: "Disinterested",
      c: "Dogmatic",
      d: "Ephemeral"
    },
    answer: "c",
    explanation: "The key description is 'rigidly authoritative and not open to debate,' which is the definition of 'dogmatic'."
  },
  {
    id: 7,
    question: "The word 'efficacy' is primarily concerned with:",
    options: {
      a: "Hostility",
      b: "Effectiveness",
      c: "Briefness",
      d: "Impartiality"
    },
    answer: "b",
    explanation: "'Efficacy' means the ability to produce a desired or intended result, i.e., effectiveness."
  },
  {
    id: 8,
    question: "Which word describes someone who is unbiased and has no personal stake in the outcome?",
    options: {
      a: "Interested",
      b: "Prejudiced",
      c: "Disinterested",
      d: "Dogmatic"
    },
    answer: "c",
    explanation: "'Disinterested' specifically means neutral and impartial, free from self-interest."
  },
  {
    id: 9,
    question: "If a reply is 'laconic', it is:",
    options: {
      a: "Verbose and detailed",
      b: "Using very few words",
      c: "Full of hatred",
      d: "Highly effective"
    },
    answer: "b",
    explanation: "'Laconic' means using very few words, often to the point of seeming rude or mysterious."
  },
  {
    id: 10,
    question: "The noun 'truculence' refers to a quality of:",
    options: {
      a: "Short-lived beauty",
      b: "Aggressive defiance",
      c: "Confused chaos",
      d: "Productive ability"
    },
    answer: "b",
    explanation: "'Truculence' means being eager or quick to argue or fight; aggressively defiant."
  }
];

function QuizPhase1() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleOption = (option) => {
    setSelected(option);
    setShowExplanation(true);
    if (option === quizData[current].answer) {
      setScore(score + 1);
    }
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

  if (finished) {
    return (
      <div className="quiz-finish">
        <h2>Phase 1 Complete!</h2>
        <p>Your score: {score} / {quizData.length}</p>
        <button onClick={() => window.location.reload()}>Restart</button>
      </div>
    );
  }

  const q = quizData[current];

  return (
    <div className="quiz-section">
      <h2>Quiz: Phase 1</h2>
      <div className="quiz-question">
        <span>Q{q.id}. {q.question}</span>
      </div>
      <div className="quiz-options">
        {Object.entries(q.options).map(([key, value]) => (
          <button
            key={key}
            className={`quiz-option ${selected === key ? "selected" : ""}`}
            onClick={() => !showExplanation && handleOption(key)}
            disabled={showExplanation}
          >
            {key.toUpperCase()}. {value}
          </button>
        ))}
      </div>
      {showExplanation && (
        <div className="quiz-explanation">
          <p>{selected === q.answer ? "Correct!" : "Incorrect."}</p>
          <p><strong>Explanation:</strong> {q.explanation}</p>
          <button onClick={handleNext}>
            {current < quizData.length - 1 ? "Next" : "Finish"}
          </button>
        </div>
      )}
      <div className="quiz-progress">
        Question {current + 1} of {quizData.length}
      </div>
    </div>
  );
}

export default QuizPhase1;
