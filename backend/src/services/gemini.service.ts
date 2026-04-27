// backend/src/services/gemini.service.ts
// This file manages the Gemini AI model for Matooto.
// Handles: story generation, question generation, and comprehension level tagging.
// API key is stored in .env — never hardcoded, never pushed to GitHub.

import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import { SYSTEM_INSTRUCTION } from "./gemini.instructions.ts";
import { getRAGContext } from "./rag.service.ts";

dotenv.config();

// ----------------------------------------------------------------
// Model Setup
// ----------------------------------------------------------------

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export type StoryLength = "short" | "medium" | "long";
export type MotherTongue = "filipino" | "cebuano" | "ilocano";
export type AssessmentLanguage = "english" | MotherTongue;

export interface GeneratedStory {
  title: string;
  body: string;
  wordCount: number;
  language: AssessmentLanguage;
  suggestedReadingTimeMinutes: number;
}

export interface QuestionChoice {
  label: "A" | "B" | "C" | "D";
  text: string;
}

export interface GeneratedQuestion {
  id: string;
  question: string;
  choices: QuestionChoice[];
  correctAnswer: "A" | "B" | "C" | "D";
  comprehensionSkill: string;
}

export type ComprehensionLevel = 1 | 2 | 3 | 4 | 5;

export interface ComprehensionResult {
  level: ComprehensionLevel;
  label: string; // e.g. "Approaching"
  description: string; // e.g. "Generally understands but has some gaps"
  score: number; // percentage 0–100
}

// ----------------------------------------------------------------
// Word count targets
// ----------------------------------------------------------------

const WORD_COUNT: Record<StoryLength, { min: number; max: number }> = {
  short: { min: 80, max: 150 },
  medium: { min: 200, max: 350 },
  long: { min: 400, max: 600 },
};

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function getReadingLevel(gradeLevel: number): string {
  if (gradeLevel <= 2)
    return "very simple sentences and basic vocabulary (Grades 1–2)";
  if (gradeLevel <= 4) return "simple paragraphs with grade 3–4 vocabulary";
  if (gradeLevel <= 6) return "structured paragraphs with grade 5–6 vocabulary";
  return "complex paragraphs with advanced vocabulary and some figurative language";
}

function parseJSON<T>(raw: string): T {
  const cleaned = raw.replace(/```json|```/gi, "").trim();
  return JSON.parse(cleaned) as T;
}

// Returns a fresh model instance with system instructions applied
function getModel() {
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    systemInstruction: SYSTEM_INSTRUCTION,
  });
}

// ----------------------------------------------------------------
// 1. Generate Story
//    Used for both English (attempt 1) and mother tongue (attempt 2)
// ----------------------------------------------------------------

export async function generateStory(
  gradeLevel: number,
  length: StoryLength,
  language: AssessmentLanguage,
  subject?: string,
  topicHint?: string,
): Promise<GeneratedStory> {
  const { min, max } = WORD_COUNT[length];
  const readingLevel = getReadingLevel(gradeLevel);

  // RAG context disabled for now (embedding model compatibility issues)
  // Can be re-enabled once embedding model is available
  const ragContext = "";

  const languageInstruction =
    language === "english"
      ? "Write in clear, natural English."
      : `Write entirely in ${language.charAt(0).toUpperCase() + language.slice(1)}.
         Use natural language that Filipino students from that region would speak and understand.
         Do NOT translate from English — write natively in that language.`;

  const prompt = `
Generate a reading comprehension story for Grade ${gradeLevel} students.

Requirements:
- ${languageInstruction}
- Word count: strictly between ${min} and ${max} words
- Reading level: ${readingLevel}
- Topic: ${topicHint ?? "any age-appropriate topic relevant to Filipino students and culture"}
- The story must have a clear beginning, middle, and end
- It must be engaging and relatable to Filipino children

${ragContext ? ragContext : ""}

Respond ONLY with valid JSON in this exact shape:
{
  "title": "Story title",
  "body": "Full story text...",
  "wordCount": 123,
  "language": "${language}",
  "suggestedReadingTimeMinutes": 2
}
`;

  const model = getModel();
  const result = await model.generateContent(prompt);
  return parseJSON<GeneratedStory>(result.response.text());
}

// ----------------------------------------------------------------
// 2. Generate Questions
//    Takes the confirmed story and produces MCQ questions
// ----------------------------------------------------------------

export async function generateQuestions(
  story: GeneratedStory,
  numberOfQuestions: number,
  gradeLevel: number,
): Promise<GeneratedQuestion[]> {
  const readingLevel = getReadingLevel(gradeLevel);

  const prompt = `
Generate exactly ${numberOfQuestions} multiple-choice reading comprehension questions
based on the story below.

STORY TITLE: ${story.title}
STORY LANGUAGE: ${story.language}
STORY:
${story.body}

Requirements:
- Write questions and choices in the SAME language as the story (${story.language})
- Reading level: ${readingLevel} (Grade ${gradeLevel})
- Each question must have exactly 4 choices: A, B, C, D
- Only ONE correct answer per question
- Cover a variety of comprehension skills:
  Main Idea, Detail Recall, Vocabulary in Context, Inference, Sequence, Cause and Effect
- All questions must be answerable purely from the story

Respond ONLY with a valid JSON array in this exact shape:
[
  {
    "id": "q1",
    "question": "Question text?",
    "choices": [
      { "label": "A", "text": "Choice A" },
      { "label": "B", "text": "Choice B" },
      { "label": "C", "text": "Choice C" },
      { "label": "D", "text": "Choice D" }
    ],
    "correctAnswer": "A",
    "comprehensionSkill": "Main Idea"
  }
]
`;

  const model = getModel();
  const result = await model.generateContent(prompt);
  return parseJSON<GeneratedQuestion[]>(result.response.text());
}

// ----------------------------------------------------------------
// 3. Tag Comprehension Level
//    Called after a student submits their answers
//    Returns their level (1–5) based on score
// ----------------------------------------------------------------

export async function tagComprehensionLevel(
  score: number,
  totalQuestions: number,
  correctAnswers: number,
  gradeLevel: number,
  language: AssessmentLanguage,
): Promise<ComprehensionResult> {
  const prompt = `
A Grade ${gradeLevel} student just completed a reading comprehension assessment in ${language}.

Their results:
- Score: ${score}% (${correctAnswers} out of ${totalQuestions} correct)
- Grade Level: ${gradeLevel}
- Language of assessment: ${language}

Assign them a comprehension level from 1 to 5 using these guidelines:
- Level 1 (Beginning): Score 0–39%
- Level 2 (Developing): Score 40–59%
- Level 3 (Approaching): Score 60–74%
- Level 4 (Proficient): Score 75–89%
- Level 5 (Advanced): Score 90–100%

Respond ONLY with valid JSON in this exact shape:
{
  "level": 3,
  "label": "Approaching",
  "description": "Generally understands the story but has some gaps in comprehension.",
  "score": ${score}
}
`;

  const model = getModel();
  const result = await model.generateContent(prompt);
  return parseJSON<ComprehensionResult>(result.response.text());
}
