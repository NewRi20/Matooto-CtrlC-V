import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function listModels() {
  try {
    console.log("Fetching available models...\n");
    const apiKey = process.env.GEMINI_API_KEY!;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
    );
    const data = await response.json();

    console.log("Available models:");
    for (const model of data.models) {
      console.log(`- ${model.name}`);
      if (model.supportedGenerationMethods) {
        console.log(
          `  Methods: ${model.supportedGenerationMethods.join(", ")}`,
        );
      }
    }
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

listModels();
