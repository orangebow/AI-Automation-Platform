import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!API_KEY) {
    console.error("Error: GOOGLE_GENERATIVE_AI_API_KEY not found in .env");
    process.exit(1);
}

async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        const models: string[] = [];
        if (data.models) {
            data.models.forEach((model: any) => {
                models.push(`${model.name} (${model.displayName})`);
            });
            fs.writeFileSync("gemini_models.txt", models.join("\n"));
            console.log("Models written to gemini_models.txt");
        } else {
            console.log("No models found in response:", data);
        }
    } catch (error) {
        console.error("Error fetching models:", error);
    }
}

listModels();
