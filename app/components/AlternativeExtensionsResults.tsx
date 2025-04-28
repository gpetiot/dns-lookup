import React from 'react';
import DomainResult from './DomainResult';
import { DomainParts, DomainResults } from '@/types/domain';

interface AlternativeExtensionsResultsProps {
  alternativeExtensions: DomainParts[];
  filteredAlternativeExtensions: DomainParts[];
  domainResults: DomainResults;
  retryDomainCheck: (domain: string) => void;
}

const AlternativeExtensionsResults: React.FC<AlternativeExtensionsResultsProps> = ({
  alternativeExtensions,
  filteredAlternativeExtensions,
  domainResults,
  retryDomainCheck,
}) => {
  if (alternativeExtensions.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <h2 className="mb-4 border-b pb-2 text-xl font-semibold text-gray-800">
        Alternative Extensions Suggestions
      </h2>
      {filteredAlternativeExtensions.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {filteredAlternativeExtensions.map(variation => (
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
          No alternative extensions match the current filter.
        </div>
      )}
    </div>
  );
};

export default AlternativeExtensionsResults;
