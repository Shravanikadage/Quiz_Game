import { useState, useEffect, useRef } from "react";
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
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  const questionAnsweredRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    axios
      .get("https://quiz-game-server.vercel.app/api/questions")
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  useEffect(() => {
    if (quizStarted && !submitted && questions.length > 0) {
      setTimeLeft(10);
      questionAnsweredRef.current = false;
      setIsOptionDisabled(false);

      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            
            if (!questionAnsweredRef.current) {
              handleTimeout();
            }

            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [currentQuestionIndex, quizStarted, submitted, questions]);

  const handleTimeout = () => {
    setPopup({ message: "Time's Up!", correct: false });
    setIsOptionDisabled(true);
    questionAnsweredRef.current = true;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: "Time's Up",
    }));

    setTimeout(() => {
      setPopup(null);
      moveToNextQuestion();
    }, 1500);
  };

  const handleSelect = (option) => {
    if (isOptionDisabled || questionAnsweredRef.current) return;

    questionAnsweredRef.current = true;
    setIsOptionDisabled(true);
    clearInterval(timerRef.current);

    const isCorrect = option === questions[currentQuestionIndex].correctAnswer;
    setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: option }));

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    setPopup({ message: isCorrect ? "Correct! 😊" : "Wrong! ☹️", correct: isCorrect });

    setTimeout(() => {
      setPopup(null);
      moveToNextQuestion();
    }, 1500);
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setTimeout(() => {
        setSubmitted(true);
      }, 1000);
    }
  };

  const restartQuiz = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setScore(0);
    setSubmitted(false);
    setQuizStarted(false);
    setTimeLeft(10);
    questionAnsweredRef.current = false;
  };

  const getScoreColor = (score) => {
    if (score === questions.length) return "#4CAF50";
    if (score >= Math.ceil(questions.length * 0.7)) return "#2196F3";
    if (score >= Math.ceil(questions.length * 0.4)) return "#FFC107";
    return "#FF5252";
  };

  const getTimerColor = () => {
    if (timeLeft > 7) return "#2196F3";
    if (timeLeft > 4) return "#FFC107";
    return "#FF5252";
  };

  const getPerformanceMessage = () => {
    if (score === questions.length) return "Legendary! 🏆";
    if (score >= Math.ceil(questions.length * 0.7)) return "Pro Level! 🎯";
    if (score >= Math.ceil(questions.length * 0.4)) return "Rising Star! 🌟";
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

                <div className="timer-container">
                  <CircularProgressbar
                    value={(timeLeft / 10) * 100}
                    text={`${timeLeft}s`}
                    styles={buildStyles({
                      textSize: "20px",
                      pathColor: getTimerColor(),
                      textColor: getTimerColor(),
                      trailColor: "#ddd",
                    })}
                  />
                </div>

                <div className="options-container">
                  {questions[currentQuestionIndex].options.map((opt, i) => (
                    <button key={i} onClick={() => handleSelect(opt)} disabled={isOptionDisabled}>
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
