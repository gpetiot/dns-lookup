import React from 'react';
import DomainResult from './DomainResult';
import NoAISuggestionPlaceholder from './NoAISuggestionPlaceholder';
import GenerateAIButton from './GenerateAIButton';
import { DomainParts, DomainResults } from '@/types/domain';

interface AISuggestionsResultsProps {
  aiSuggestions: DomainParts[];
  filteredAiSuggestions: DomainParts[];
  domainResults: DomainResults;
  isGeneratingAI: boolean;
  retryDomainCheck: (domain: string) => void;
  onGenerateAI: () => void;
}

const AISuggestionsResults: React.FC<AISuggestionsResultsProps> = ({
  aiSuggestions,
  filteredAiSuggestions,
  domainResults,
  isGeneratingAI,
  retryDomainCheck,
  onGenerateAI,
}) => {
  return (
    <div className="w-full">
      <div className="mb-4 flex items-center gap-3 border-b pb-2">
        <h2 className="text-xl font-semibold text-gray-800">AI Suggestions</h2>
        <GenerateAIButton isGenerating={isGeneratingAI} onClick={onGenerateAI} />
      </div>
      {aiSuggestions.length > 0 ? (
        filteredAiSuggestions.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {filteredAiSuggestions.map(variation => (
              <DomainResult
                key={variation.domain}
                parts={variation}
                data={domainResults[variation.domain]?.data}
                loading={domainResults[variation.domain]?.loading}
                onRetry={() => retryDomainCheck(variation.domain)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-sm italic text-gray-500">
            No AI suggestions match the current filter.
          </div>
        )
      ) : (
        <NoAISuggestionPlaceholder isGenerating={isGeneratingAI} />
      )}
    </div>
  );
};

export default AISuggestionsResults;
