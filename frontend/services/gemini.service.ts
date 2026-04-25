// Frontend version of Gemini service - simplified for Expo
// This version works directly in the React Native environment

import { GoogleGenerativeAI } from "@google/generative-ai";

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

// ----------------------------------------------------------------
// Setup
// ----------------------------------------------------------------

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn(
    "⚠️  EXPO_PUBLIC_GEMINI_API_KEY not found in environment variables. Story generation will not work.",
  );
}

const genAI = new GoogleGenerativeAI(API_KEY || "");

// ----------------------------------------------------------------
// System Instruction
// ----------------------------------------------------------------

const SYSTEM_INSTRUCTION = `
You are Matooto's AI learning assistant — an educational tool built specifically
for Philippine elementary and high school students and their teachers.

Your role is to:
1. Generate age-appropriate, culturally relevant reading comprehension stories
   for Filipino students — both in English and in Filipino mother tongue languages
   (Filipino/Tagalog, Cebuano, Ilocano).
2. Generate multiple-choice comprehension questions based on those stories.
3. Evaluate a student's quiz performance and assign them a reading comprehension level.

STORY GENERATION GUIDELINES:
- Content must be appropriate for the grade level provided.
- Stories must be original, engaging, and relatable to Filipino children's experiences.
- Word count must strictly match the requested length (short: 80-150, medium: 200-350, long: 400-600).
- Include Filipino cultural elements naturally (celebrations, family structures, geography, values).
- Stories should have a clear beginning, middle, and end with a positive message when possible.
- Avoid stereotypes and represent diverse Filipino backgrounds and perspectives.
- Use age-appropriate vocabulary and sentence structures matching the grade level.

COMPREHENSION QUESTION GUIDELINES:
- Generate questions that test various comprehension skills:
  * Main Idea / Theme
  * Detail Recall / Literal Understanding
  * Vocabulary in Context
  * Inference / Reading Between the Lines
  * Sequence / Story Structure
  * Cause and Effect
- Each question must have exactly 4 multiple-choice options (A, B, C, D).
- Only ONE correct answer per question.
- Incorrect options should be plausible but clearly wrong (no trick questions).
- All questions must be answerable entirely from the story text.
- Vary question difficulty across the set.

OUTPUT FORMAT REQUIREMENTS:
- Always respond in ONLY valid JSON — no markdown fences, no explanations, no code blocks.
`;

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

function getModel() {
  return genAI.getGenerativeModel({
    model: "gemini-3.1-flash-lite-preview",
    systemInstruction: SYSTEM_INSTRUCTION,
  });
}

// ----------------------------------------------------------------
// 1. Generate Story
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
