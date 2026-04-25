// backend/src/services/rag.service.ts
// Proper RAG Pipeline for Matooto:
// 1. EMBED    — each vocab entry is converted to a vector using Gemini embeddings
// 2. STORE    — vectors are stored in Firestore as vector fields
// 3. RETRIEVE — at query time, embed the query and find most semantically similar entries
// 4. GENERATE — retrieved context is injected into Gemini prompt

import { GoogleGenerativeAI } from "@google/generative-ai";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import * as dotenv from "dotenv";

dotenv.config();

// ----------------------------------------------------------------
// Init
// ----------------------------------------------------------------

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Gemini's embedding model
const embeddingModel = genAI.getGenerativeModel({
  model: "text-embedding-004",
});

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export interface VocabularyEntry {
  word: string;
  subject: string;
  grade: number;
  definition: string;
  exampleSentence: string;
}

// ----------------------------------------------------------------
// STEP 1: EMBED
// Converts a vocabulary entry into a vector using Gemini embeddings
// ----------------------------------------------------------------

async function embedEntry(entry: VocabularyEntry): Promise<number[]> {
  // We embed the word + definition + example together
  // so the vector captures full meaning, not just the word
  const text = `${entry.word}: ${entry.definition}. ${entry.exampleSentence}`;

  const result = await embeddingModel.embedContent(text);
  return result.embedding.values;
}

// ----------------------------------------------------------------
// STEP 2: STORE
// Embeds all vocabulary entries and stores them in Firestore.
// Run this ONE TIME via: npx tsx src/scripts/seed.ts
// ----------------------------------------------------------------

export async function seedVocabularyWithEmbeddings(): Promise<void> {
  const vocab: VocabularyEntry[] = require("../data/vocabulary.json");

  console.log(`Embedding ${vocab.length} vocabulary entries...`);

  for (let i = 0; i < vocab.length; i++) {
    const entry = vocab[i];

    // Get embedding vector from Gemini
    const embedding = await embedEntry(entry);

    // Store in Firestore with the embedding as a vector field
    await db.collection("vocabularyBank").add({
      ...entry,
      // FieldValue.vector() tells Firestore this is a searchable vector field
      embedding: FieldValue.vector(embedding),
    });

    console.log(
      `[${i + 1}/${vocab.length}] Embedded: "${entry.word}" (${entry.subject}, Grade ${entry.grade})`
    );

    // Small delay to avoid hitting Gemini rate limits
    await new Promise((res) => setTimeout(res, 200));
  }

  console.log("✅ Done! All vocabulary entries embedded and stored in Firestore.");
}

// ----------------------------------------------------------------
// STEP 3: RETRIEVE
// Embeds the query and finds the most semantically similar vocab entries
// using Firestore's native vector similarity search
// ----------------------------------------------------------------

async function embedQuery(
  subject: string,
  grade: number,
  topic?: string
): Promise<number[]> {
  const queryText = `${subject} vocabulary for Grade ${grade} students${
    topic ? ` about ${topic}` : ""
  }`;

  const result = await embeddingModel.embedContent(queryText);
  return result.embedding.values;
}

export async function retrieveRelevantVocabulary(
  subject: string,
  grade: number,
  topic?: string,
  topK: number = 15
): Promise<VocabularyEntry[]> {

  // Embed the query — this is what makes it RAG, not just a filter
  const queryEmbedding = await embedQuery(subject, grade, topic);

  // Firestore vector similarity search — finds the topK most semantically similar entries
  const vectorQuery = db
    .collection("vocabularyBank")
    .where("subject", "==", subject)
    .where("grade", "==", grade)
    .findNearest({
      vectorField: "embedding",
      queryVector: FieldValue.vector(queryEmbedding),
      limit: topK,
      distanceMeasure: "COSINE",
    });

  const snap = await vectorQuery.get();

  return snap.docs.map((doc) => {
    const data = doc.data();
    return {
      word: data.word,
      subject: data.subject,
      grade: data.grade,
      definition: data.definition,
      exampleSentence: data.exampleSentence,
    };
  });
}

// ----------------------------------------------------------------
// STEP 4: FORMAT CONTEXT
// Formats retrieved entries into a readable context block for Gemini
// This is what gets injected into the story generation prompt
// ----------------------------------------------------------------

export async function getRAGContext(
  subject: string,
  grade: number,
  topic?: string
): Promise<string> {

  const entries = await retrieveRelevantVocabulary(subject, grade, topic);

  if (entries.length === 0) return "";

  const formatted = entries
    .map(
      (e) =>
        `- "${e.word}": ${e.definition}. Example: ${e.exampleSentence}`
    )
    .join("\n");

  return `
The following ${subject} vocabulary words were semantically retrieved as relevant context for this story.
Naturally weave SOME of these words into the story where they fit.
Do NOT force all of them in — only use what feels natural for the narrative.

${formatted}
`.trim();
}