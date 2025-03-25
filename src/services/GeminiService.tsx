import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIServiceInterface } from './AIService';

export class GeminiService implements AIServiceInterface {
  private genAI: GoogleGenerativeAI;
  private defaultModel: string;
  public static readonly DEFAULT_MODEL = 'gemini-2.0-flash';

  constructor(defaultModel: string = GeminiService.DEFAULT_MODEL) {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('REACT_APP_GEMINI_API_KEY environment variable is not set');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.defaultModel = defaultModel;
  }

  async generateContent(prompt: string, modelName?: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: modelName || this.defaultModel });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error generating content with Gemini:', error);
      throw error;
    }
  }
}
