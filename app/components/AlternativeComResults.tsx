import React from 'react';
import DomainResult from './DomainResult';
import { DomainParts, DomainResults } from '@/types/domain';

interface AlternativeComResultsProps {
  alternativeSuggestions: DomainParts[];
  filteredAlternativeSuggestions: DomainParts[];
  domainResults: DomainResults;
  retryDomainCheck: (domain: string) => void;
  onToggle?: () => void;
}

const AlternativeComResults: React.FC<AlternativeComResultsProps> = ({
  alternativeSuggestions,
  filteredAlternativeSuggestions,
  domainResults,
  retryDomainCheck,
  onToggle,
}) => {
  if (alternativeSuggestions.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between border-b pb-2">
        <h2 className="text-xl font-semibold text-gray-800">Alternative .com Suggestions</h2>
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
      {filteredAlternativeSuggestions.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {filteredAlternativeSuggestions.map(variation => (
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
          No alternative .com suggestions match the current filter.
        </div>
      )}
    </div>
  );
};

export default AlternativeComResults;
