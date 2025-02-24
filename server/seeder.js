const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Question = require("./models/Question"); 

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const seedQuestions = async () => {
  try {
    await Question.deleteMany(); // Clear existing data

    await Question.insertMany([
      {
        question: "How many players are there in cricket team?",
        options: ["9", "10", "11", "12" ],
        correctAnswer: "11",
      },
      {
        question: "What is the national game of India?",
        options: ["Cricket", "Football", "Hockey", "Kabaddi"],
        correctAnswer: "Hockey",
      },
      {
        question: "What is the national currency of India?",
        options: ["Yen", "Rupee", "Doller", "Won"],
        correctAnswer: "Rupee",
      },
      {
        question: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Madrid"],
        correctAnswer: "Paris", 
      },
       {
        question: "Which planet is closest to the Sun?",
        options: ["Mercury", "Earth", "Mars", "Venus"],
        correctAnswer: "Mercury",
      },
      {
        question: "Which is the largest planet in our solar system?",
        options: ["Earth", "Saturn", "Neptune", "Jupiter"],
        correctAnswer: "Jupiter",
      },

      {
        question: "How many continents are there on Earth?",
        options: ["4", "5", "6", "7"],
        correctAnswer: "7",
      },
      {
        question: "Which programming language is used for web development?",
        options: ["Java", "Python", "JavaScript", "C++"],
        correctAnswer: "JavaScript",
      },
      {
        question: "Which language is known as the 'mother of all programming languages'?",
        options: ["Java", "C", "Python", "C++"],
        correctAnswer: "C",
      },
      {
        question: "Which of the following is NOT an operating system?",
        options: ["Linux", "Windows", "Oracle", "MacOS"],
        correctAnswer: "Oracle",
      },
  
    ]);

    console.log("Data Seeded Successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedQuestions();
