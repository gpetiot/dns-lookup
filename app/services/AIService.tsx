import { GeminiService } from './GeminiService';

export enum AIProvider {
  GEMINI = 'gemini',
}

export const DEFAULT_PROVIDER = AIProvider.GEMINI;

export interface AIServiceInterface {
  generateContent(prompt: string, modelName?: string): Promise<string>;
}

export class AIService {
  private provider: AIProvider;
  private service: AIServiceInterface;

  constructor(provider: AIProvider, defaultModel?: string) {
    this.provider = provider;

    switch (this.provider) {
      case AIProvider.GEMINI:
        this.service = new GeminiService(defaultModel);
        break;
      default:
        throw new Error(`Unsupported AI provider: ${this.provider}`);
    }
  }

  async generateContent(prompt: string, model?: string): Promise<string> {
    return this.service.generateContent(prompt, model);
  }
}
