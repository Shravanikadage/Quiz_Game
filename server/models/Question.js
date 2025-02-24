const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true }, // Changed from "answer" to "correctAnswer"
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
