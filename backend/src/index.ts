import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import {
  generateStory,
  generateQuestions,
  tagComprehensionLevel,
} from "./services/gemini.service.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ----------------------------------------------------------------
// API Routes
// ----------------------------------------------------------------

/**
 * POST /api/stories/generate
 * Generate a story based on parameters
 */
app.post("/api/stories/generate", async (req, res) => {
  try {
    const { gradeLevel, length, language, subject, topicHint } = req.body;

    if (!gradeLevel || !length || !language) {
      return res
        .status(400)
        .json({
          error: "Missing required fields: gradeLevel, length, language",
        });
    }

    const story = await generateStory(
      gradeLevel,
      length,
      language,
      subject,
      topicHint,
    );
    res.json(story);
  } catch (error) {
    console.error("Error generating story:", error);
    res
      .status(500)
      .json({ error: "Failed to generate story", details: String(error) });
  }
});

/**
 * POST /api/questions/generate
 * Generate questions based on a story
 */
app.post("/api/questions/generate", async (req, res) => {
  try {
    const { story, numberOfQuestions, gradeLevel } = req.body;

    if (!story || !numberOfQuestions || !gradeLevel) {
      return res
        .status(400)
        .json({
          error:
            "Missing required fields: story, numberOfQuestions, gradeLevel",
        });
    }

    const questions = await generateQuestions(
      story,
      numberOfQuestions,
      gradeLevel,
    );
    res.json(questions);
  } catch (error) {
    console.error("Error generating questions:", error);
    res
      .status(500)
      .json({ error: "Failed to generate questions", details: String(error) });
  }
});

/**
 * POST /api/comprehension/evaluate
 * Evaluate comprehension and assign a level
 */
app.post("/api/comprehension/evaluate", async (req, res) => {
  try {
    const { score, totalQuestions, correctAnswers, gradeLevel, language } =
      req.body;

    if (
      score === undefined ||
      !totalQuestions ||
      !correctAnswers ||
      !gradeLevel ||
      !language
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await tagComprehensionLevel(
      score,
      totalQuestions,
      correctAnswers,
      gradeLevel,
      language,
    );
    res.json(result);
  } catch (error) {
    console.error("Error evaluating comprehension:", error);
    res
      .status(500)
      .json({
        error: "Failed to evaluate comprehension",
        details: String(error),
      });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Matooto backend is running" });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Server is running and listening on all network interfaces at port ${PORT}`,
  );
});
