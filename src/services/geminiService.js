// src/services/geminiService.js
import axios from "axios";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = import.meta.env.VITE_GEMINI_MODEL;
const TOKEN_LIMIT = import.meta.env.VITE_GEMINI_TOKEN_LIMIT;

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

export const sendMessageToGemini = async (message, language = "en") => {
  try {
    // Fronting untuk memastikan AI menjawab sesuai instruksi
    const frontingPrompt = `
      Kamu adalah David, asisten virtual yang selalu siap membantu. Jawablah setiap pertanyaan dengan gaya bahasa yang friendly dan santai.
      - Jika menjawab dalam bahasa Indonesia, gunakan gaya santai seperti berbicara dengan teman, panggil "Bro" jika sesuai.
      - Jika menjawab dalam bahasa Inggris, gunakan gaya casual dan bersahabat.
      - Jika ditanya "siapa kamu", jawab bahwa kamu adalah David, asisten virtual yang siap membantu apa saja.
    `;

    const response = await axios.post(
      API_URL,
      {
        contents: [
          {
            parts: [
              {
                text: `${frontingPrompt}\n
User: ${message}\nDavid:`,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: parseInt(TOKEN_LIMIT),
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return {
      reply:
        response.data.candidates[0]?.content?.parts[0]?.text ||
        "No response received.",
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      error: "Failed to get response from AI.",
    };
  }
};
