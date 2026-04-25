// backend/src/scripts/seed.ts
// Run this ONE TIME to upload the vocabulary bank to Firestore.
// After running, you don't need to run it again.
//
// How to run:
//   npx tsx src/scripts/seed.ts

import { seedVocabularyWithEmbeddings } from "../services/rag.service.ts";

seedVocabularyWithEmbeddings()
  .then(() => {
    console.log("Done! Vocabulary is now in Firestore.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });