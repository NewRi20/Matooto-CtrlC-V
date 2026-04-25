import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function listModels() {
  try {
    console.log("Fetching available models...\n");
    const models = await genAI.listModels();
    
    console.log("Available models:");
    for (const model of models.models) {
      console.log(`- ${model.name}`);
      if (model.supportedGenerationMethods) {
        console.log(`  Methods: ${model.supportedGenerationMethods.join(", ")}`);
      }
    }
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

listModels();
