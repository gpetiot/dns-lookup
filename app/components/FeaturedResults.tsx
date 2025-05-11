import React from 'react';
import DomainResult from './DomainResult';
import { DomainResults } from '@/types/domain';
import { DomainParts } from '@/types/domain';

interface FeaturedResultsProps {
  featuredDomains: DomainParts[];
  filteredFeaturedDomains: DomainParts[];
  domainResults: DomainResults;
  retryDomainCheck: (domain: string) => void;
}

const FeaturedResults: React.FC<FeaturedResultsProps> = ({
  featuredDomains,
  filteredFeaturedDomains,
  domainResults,
  retryDomainCheck,
}) => {
  if (featuredDomains.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-xl font-semibold text-text">Featured Domains</h2>
      <div className="space-y-2">
        {filteredFeaturedDomains.map(domain => {
          return (
            <DomainResult
              key={domain.domain}
              parts={domain}
              data={domainResults[domain.domain]?.data}
              loading={domainResults[domain.domain]?.loading}
              onRetry={() => retryDomainCheck(domain.domain)}
              showPrice={false}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedResults;
