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
  onToggle?: () => void;
}

const AISuggestionsResults: React.FC<AISuggestionsResultsProps> = ({
  aiSuggestions,
  filteredAiSuggestions,
  domainResults,
  isGeneratingAI,
  retryDomainCheck,
  onGenerateAI,
  onToggle,
}) => {
  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-800">AI Suggestions</h2>
          <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-2 py-0.5 text-xs font-medium text-yellow-600">
            Experimental
          </span>
          <GenerateAIButton isGenerating={isGeneratingAI} onClick={onGenerateAI} />
        </div>
        {onToggle && (
          <button
            onClick={onToggle}
            className="text-gray-500 transition-colors hover:text-gray-700"
            title="Collapse section"
          >
            <span className="text-xl">−</span>
          </button>
        )}
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
