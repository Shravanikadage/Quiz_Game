import { useState, useEffect } from "react";
import axios from "axios";
import "react-circular-progressbar/dist/styles.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "./Quiz.css";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [popup, setPopup] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    axios
      .get("https://quiz-game-server.vercel.app/api/questions")
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  const handleSelect = (option) => {
    const isCorrect = option === questions[currentQuestionIndex].correctAnswer;
    setAnswers({ ...answers, [currentQuestionIndex]: option });

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
      setPopup({ message: "Correct! 😊", correct: true });
    } else {
      setPopup({ message: "Wrong! ☹️", correct: false });
    }

    setTimeout(() => {
      setPopup(null);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setSubmitted(true);
      }
    }, 1500);
  };

  const restartQuiz = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setScore(0);
    setSubmitted(false);
    setQuizStarted(false);
  };

  const getScoreColor = (score) => {
    if (score === 10) return "#4CAF50";
    if (score >= 7) return "#2196F3";
    if (score >= 4) return "#FFC107";
    return "#FF5252";
  };

  const getPerformanceMessage = () => {
    if (score === 10) return "Legendary! 🏆";
    if (score >= 7) return "Pro Level! 🎯";
    if (score >= 4) return "Rising Star! 🌟";
    return "Level Up Needed! ⏳";
  };

  return (
    <div className="quiz-wrapper">
      <div className="quiz-box">
        <h1>Quiz Game</h1>

        {!quizStarted ? (
          <button className="start-button" onClick={() => setQuizStarted(true)}>
            Play Now
          </button>
        ) : !submitted ? (
          <div className="question-card">
            {questions.length > 0 && (
              <>
                <h2 className="question">{questions[currentQuestionIndex].question}</h2>
                <div className="options-container">
                  {questions[currentQuestionIndex].options.map((opt, i) => (
                    <button key={i} onClick={() => handleSelect(opt)}>
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="result-screen">
            <h2>Your Score</h2>
            <div className="score-container">
              <CircularProgressbar
                value={(score / questions.length) * 100}
                text={`${score}/${questions.length}`}
                styles={buildStyles({
                  textSize: "24px",
                  pathColor: getScoreColor(score),
                  textColor: getScoreColor(score),
                  trailColor: "#ddd",
                })}
              />
            </div>
            <h3 className="performance-message">{getPerformanceMessage()}</h3>
            <button className="restart-button" onClick={restartQuiz}>
              Play Again
            </button>
          </div>
        )}
      </div>

      {popup && <div className="overlay active"></div>}

      {popup && (
        <div className={`popup ${popup.correct ? "correct-popup" : "incorrect-popup"}`}>
          {popup.message}
        </div>
      )}
    </div>
  );
};

export default Quiz;
