import React, { useState, useEffect } from 'react';
import './App.css'; 
import  quizzes  from './data';


function App() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [showResults, setShowResults] = useState(false);


  const currentQuiz = selectedQuiz ? quizzes[selectedQuiz] : [];

  useEffect(() => {
    if (selectedQuiz && !showResults) {
      if (timeLeft === 0) {
        handleAnswer(null);
      }
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, selectedQuiz, showResults]);

  useEffect(() => {
    if (timeLeft <= 3 && timeLeft > 0) {
      new Audio('/alert.mp3').play();
    }
  }, [timeLeft]);

  const handleAnswer = (answer) => {
    const questions = currentQuiz[currentQuestion];
    
    const isCorrect = answer === questions.correct;
    if (isCorrect) setScore(score + 1);
    setAnswers([...answers, { selected: answer, correct: questions.correct, question: questions.question }]);
    if (currentQuestion + 1 < currentQuiz.length) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(10);
    } else {
      setShowResults(true);
    }
  };

  const retryQuiz = () => {
   
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setTimeLeft(10);
    setShowResults(false);
  
  };

  if (!selectedQuiz) {
    return (
  
      <div className="home">
        <h1>Choose a Quiz</h1>
        {Object.keys(quizzes).map((quiz) => (
          <button key={quiz} onClick={() => setSelectedQuiz(quiz)}>{quiz}</button>
        ))}
      </div>

    );
  }

  if (showResults) {
   
    return (
     
      <div className="results">
        <h1>🎉 Quiz Completed 🎉</h1>
        <h2>Score: {score}/{currentQuiz.length}</h2>
        <div className="summary">
          {answers.map((ans, index) => (
           
            <div key={index} className={`answer-summary ${ans.selected === ans.correct ? 'correct' : 'incorrect'}`}>
              <p>Q{index + 1}:  {ans.question}</p><p>Correct: {ans.correct}, You chose: {ans.selected || 'No Answer'}</p>
            </div>
          ))}
        </div>
        <button onClick={retryQuiz}>Retry</button>
        <button onClick={() => setSelectedQuiz(null)}>Take Another Quiz</button>
      </div>

    );
  }

  const question = currentQuiz[currentQuestion];
  const progress = ((currentQuestion) / currentQuiz.length) * 100;

  return (

    <div className="quiz-container">
      <div className="quiz-header">
        <h1>{selectedQuiz}</h1>
        <h2>Question {currentQuestion + 1}/{currentQuiz.length}</h2>
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="timer-wrapper">
        <svg className="timer-circle" viewBox="0 0 36 36">
          <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
          <path
            className="circle"
            stroke={timeLeft > 3 ? 'green' : 'red'}
            strokeDasharray={`${(timeLeft / 10) * 100}, 100`}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="timer-text">{timeLeft}s</div>
      </div>
      <div className="question-section">
        <h2>{question.question}</h2>
        {question.options.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(opt,question)}>{opt}</button>
        ))}
      </div>
      <button onClick={() => setShowResults(true)}>Submit</button>
      <button onClick={() => setSelectedQuiz(null)}>Exit</button>
    </div>

  );
}

export default App;
