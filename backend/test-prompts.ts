import { generateStory, generateQuestions, tagComprehensionLevel } from "./src/services/gemini.service.ts";

async function testPrompts() {
  try {
    console.log("🧪 Testing Gemini Prompts...\n");

    // Test 1: Generate a story
    console.log("📖 Test 1: Generating a story for Grade 3...");
    const story = await generateStory(
      3, 
      "short", 
      "english",
      "A day at school"
    );
    console.log("✅ Story generated:");
    console.log(`   Title: ${story.title}`);
    console.log(`   Word count: ${story.wordCount}`);
    console.log(`   Reading time: ${story.suggestedReadingTimeMinutes} min`);
    console.log(`   Language: ${story.language}`);
    console.log(`\n   📖 Full Story:\n${story.body}\n`);

    // Test 2: Generate questions
    console.log("❓ Test 2: Generating questions for the story...");
    const questions = await generateQuestions(story, 4, 3);
    console.log(`✅ Generated ${questions.length} questions:`);
    questions.forEach((q, i) => {
      console.log(`   Q${i + 1}: ${q.question}`);
      console.log(`   Skill: ${q.comprehensionSkill}`);
      console.log(`   Correct answer: ${q.correctAnswer}\n`);
    });

    // Test 3: Tag comprehension level
    console.log("📊 Test 3: Tagging comprehension level...");
    const result = await tagComprehensionLevel(75, 4, 3, 3, "english");
    console.log("✅ Comprehension level assigned:");
    console.log(`   Level: ${result.level} (${result.label})`);
    console.log(`   Score: ${result.score}%`);
    console.log(`   Description: ${result.description}\n`);

    console.log("✨ All tests completed successfully!");
  } catch (error) {
    console.error("❌ Error during testing:", error);
    process.exit(1);
  }
}

testPrompts();
