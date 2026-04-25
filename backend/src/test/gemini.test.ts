// backend/src/test/gemini.test.ts
// Run this to check if the AI is hallucinating or giving bad outputs.
// Tests: generateStory (english + mother tongue) and generateQuestions

import { generateStory, generateQuestions, tagComprehensionLevel } from "../services/gemini.service.ts";

async function runTests() {
  console.log("===========================================");
  console.log("        MATOOTO AI HALLUCINATION TEST      ");
  console.log("===========================================\n");

  // -------------------------------------------------------
  // TEST 1: Generate English Story
  // -------------------------------------------------------
  console.log("TEST 1: Generate English Story (Grade 4, Medium)");
  console.log("--------------------------------------------------");
  try {
    const englishStory = await generateStory(4, "medium", "english", "friendship");
    console.log("✅ PASSED");
    console.log("Title:", englishStory.title);
    console.log("Word Count:", englishStory.wordCount);
    console.log("Reading Time:", englishStory.suggestedReadingTimeMinutes, "mins");
    console.log("Preview:", englishStory.body.substring(0, 100) + "...\n");

    // -------------------------------------------------------
    // TEST 2: Generate Questions from English Story
    // -------------------------------------------------------
    console.log("TEST 2: Generate Questions from English Story (5 questions)");
    console.log("-------------------------------------------------------------");
    try {
      const questions = await generateQuestions(englishStory, 5, 4);
      console.log("✅ PASSED");
      console.log("Number of questions returned:", questions.length);
      questions.forEach((q, i) => {
        console.log(`\nQ${i + 1} [${q.comprehensionSkill}]: ${q.question}`);
        q.choices.forEach(c => console.log(`  ${c.label}. ${c.text}`));
        console.log(`  ✔ Correct Answer: ${q.correctAnswer}`);
      });
    } catch (err) {
      console.log("❌ FAILED — generateQuestions error:");
      console.error(err);
    }

  } catch (err) {
    console.log("❌ FAILED — generateStory (english) error:");
    console.error(err);
  }

  // -------------------------------------------------------
  // TEST 3: Generate Filipino Mother Tongue Story
  // -------------------------------------------------------
  console.log("\n\nTEST 3: Generate Filipino Story (Grade 3, Short)");
  console.log("--------------------------------------------------");
  try {
    const filipinoStory = await generateStory(3, "short", "filipino");
    console.log("✅ PASSED");
    console.log("Title:", filipinoStory.title);
    console.log("Word Count:", filipinoStory.wordCount);
    console.log("Preview:", filipinoStory.body.substring(0, 100) + "...\n");
  } catch (err) {
    console.log("❌ FAILED — generateStory (filipino) error:");
    console.error(err);
  }

  // -------------------------------------------------------
  // TEST 4: Tag Comprehension Level
  // -------------------------------------------------------
  console.log("\nTEST 4: Tag Comprehension Level (score: 80%, Grade 4)");
  console.log("-------------------------------------------------------");
  try {
    const result = await tagComprehensionLevel(80, 5, 4, 4, "english");
    console.log("✅ PASSED");
    console.log("Level:", result.level);
    console.log("Label:", result.label);
    console.log("Description:", result.description);
    console.log("Score:", result.score);
  } catch (err) {
    console.log("❌ FAILED — tagComprehensionLevel error:");
    console.error(err);
  }

  console.log("\n===========================================");
  console.log("              TESTS COMPLETE               ");
  console.log("===========================================");
}

runTests();
