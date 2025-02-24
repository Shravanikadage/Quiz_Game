const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const Question = require("./models/Question");

const app = express();
app.use(cors());
app.use(express.json());

// CORS for Frontend
app.use(cors({
    origin: ["https://video-streaming-frontend-orpin.vercel.app"],
    methods: ["POST", "GET"],
    credentials: true
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB Connection Error:", err));

// API Route to Fetch Questions
app.get("/api/questions", async (req, res) => {
  try {
    const questions = await Question.find();
    console.log("Fetched Questions:", questions); // Debugging log
    res.json(questions);
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// API Route to Submit Answers
app.post("/api/submit", async (req, res) => {
  try {
    const { answers } = req.body;
    const questions = await Question.find();
    let score = 0;

    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        score++;
      }
    });

    res.json({ score });
  } catch (err) {
    console.error("Error processing quiz:", err);
    res.status(500).json({ error: "Failed to process quiz" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
