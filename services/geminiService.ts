import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateQuizQuestions(): Promise<QuizQuestion[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Genereer 10 quizvragen op masterniveau voor de opleiding musculoskeletale echografie. Elke vraag moet multiple choice zijn met 4 opties en één correct antwoord. Geef voor elke vraag ook een korte, duidelijke uitleg waarom het juiste antwoord correct is. Focus op geavanceerde onderwerpen zoals pathologieherkenning, Doppler-technieken, interventionele procedures en anatomische varianten. Geef de uitvoer strikt in het opgegeven JSON-formaat. De vragen, antwoorden en uitleg moeten in het Nederlands zijn.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              description: "Een lijst van 10 quizvragen.",
              items: {
                type: Type.OBJECT,
                properties: {
                  question: {
                    type: Type.STRING,
                    description: "De tekst van de vraag.",
                  },
                  options: {
                    type: Type.ARRAY,
                    description: "Een lijst van 4 mogelijke antwoorden.",
                    items: {
                      type: Type.STRING,
                    },
                  },
                  correctAnswer: {
                    type: Type.STRING,
                    description: "Het correcte antwoord uit de lijst met opties.",
                  },
                  explanation: {
                    type: Type.STRING,
                    description: "Een korte uitleg waarom het antwoord correct is."
                  }
                },
                 required: ["question", "options", "correctAnswer", "explanation"],
              },
            },
          },
           required: ["questions"],
        },
      },
    });

    const jsonString = response.text.trim();
    const parsedJson = JSON.parse(jsonString);

    if (parsedJson && parsedJson.questions) {
      return parsedJson.questions as QuizQuestion[];
    } else {
      console.error("Unexpected JSON structure:", parsedJson);
      throw new Error("De AI heeft geen vragen in het verwachte formaat geretourneerd.");
    }
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    throw new Error("Kon de quizvragen niet genereren. Controleer de API-sleutel en probeer het opnieuw.");
  }
}