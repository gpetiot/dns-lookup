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
    <div className="relative mb-8 w-full">
      <div className="absolute -inset-1 -z-10 rounded-xl bg-yellow-400/20 blur-lg" />

      <div className="rounded-xl bg-background/80 backdrop-blur-sm">
        <h2 className="mb-4 border-b pb-2 text-xl font-semibold text-text">Random Gems</h2>

        {filteredFeaturedDomains.length > 0 ? (
          <>
            <p className="mb-4 text-sm text-text-muted">
              {featuredDomains.length > 0 ? (
                <>
                  Found {featuredDomains.length} cool{' '}
                  {featuredDomains.length === 1 ? 'domain' : 'domains'} that
                  {featuredDomains.length === 1 ? ' is' : ' are'} up for grabs! Grab{' '}
                  {featuredDomains.length === 1 ? 'it' : 'them'} while you can ✨
                </>
              ) : (
                'Some interesting domains I stumbled upon...'
              )}
            </p>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {filteredFeaturedDomains.map(domain => (
                <DomainResult
                  key={domain.domain}
                  parts={domain}
                  data={domainResults[domain.domain]?.data}
                  loading={domainResults[domain.domain]?.loading}
                  onRetry={() => retryDomainCheck(domain.domain)}
                  showPrice={false}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center text-sm italic text-gray-500">
            No random gems match the current filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedResults;
