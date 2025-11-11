import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generatePhotoshootImage(
  garmentImageBase64: string,
  mimeType: string,
  textPrompt: string
): Promise<string | null> {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: garmentImageBase64,
              mimeType: mimeType,
            },
          },
          {
            text: textPrompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Extract the image data from the response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    return null;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        // More specific error handling can be added here based on error types from the SDK
        if (error.message.includes('SAFETY')) {
            throw new Error('The request was blocked due to safety settings. Please adjust your prompt.');
        }
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while generating the image.");
  }
}
