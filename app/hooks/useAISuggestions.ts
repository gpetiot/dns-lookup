import { useState } from 'react';
import { generateAIDomainSuggestions } from '@/utils/domainUtils';
import type { DomainParts } from '@/types/domain';

export interface AISuggestionsState {
  aiSuggestions: DomainParts[];
  isGeneratingAI: boolean;
  error: string | null;
}

export interface AISuggestionsActions {
  handleGenerateAI: (
    domain: string,
    checkDomain: (domain: string) => Promise<any>
  ) => Promise<void>;
}

export function useAISuggestions(): [AISuggestionsState, AISuggestionsActions] {
  const [aiSuggestions, setAiSuggestions] = useState<DomainParts[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAI = async (
    domain: string,
    checkDomain: (domain: string) => Promise<any>
  ) => {
    if (!domain) return;

    setIsGeneratingAI(true);
    setError(null);

    try {
      const suggestions = await generateAIDomainSuggestions(domain, aiSuggestions.length === 0);

      const existingDomains = new Set(aiSuggestions.map(d => d.domain));
      const newSuggestions = suggestions.filter(s => !existingDomains.has(s.domain));

      if (newSuggestions.length === 0) {
        setError('No new unique suggestions generated. Try again for different variations.');
        return;
      }

      setAiSuggestions(prev => [...prev, ...newSuggestions]);

      // Check availability for new suggestions
      newSuggestions.forEach((suggestion, index) => {
        setTimeout(() => {
          checkDomain(suggestion.domain);
        }, index * 300);
      });
    } catch (err) {
      console.error('Error generating AI suggestions:', err);
      setError('Failed to generate AI suggestions. Please try again.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return [{ aiSuggestions, isGeneratingAI, error }, { handleGenerateAI }];
}
