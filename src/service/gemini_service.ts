import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env";
import {GoogleGenAI} from '@google/genai';
/**
 * A service class to interact with the Google Gemini API.
 */
class GeminiService {
    /**
     * Initializes the GeminiService.
     *
     * @param {string} apiKey - The API key used for authentication.
     * @param {string} modelName - The name of the Gemini model to use (default: 'gemini-pro').
     */
    private genAI: any;
    constructor() {
        console.log("env.gemini.apiKey", env.gemini.apiKey);
        this.genAI = new GoogleGenAI({apiKey: env.gemini.apiKey});
    }

    /**
     * Generates content using the Gemini API.
     *
     * @param {string | (string | { text: string; } | { inlineData: { mimeType: string; data: string; }; })[]} prompt - The prompt(s) to send to the model.
     * @param {object} generationConfig - Optional generation configuration parameters.
     * @param {object[]} safetySettings - Optional safety settings.
     * @returns {Promise<any>} The generated content as a string.
     */
    async generateContent(prompt) {
        try {
    
            const result = await  await this.genAI.models.generateContent({
                model: 'gemini-1.5-pro',
                contents: prompt.toString(),
              });
            return result;
        } catch (error) {
            throw new Error(`Error generating content: ${error.message}`);
        }
    }
}

export default GeminiService;