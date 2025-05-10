'use client';

import React from 'react';
import DomainResult from './DomainResult';
import DomainScore from './DomainScore';
import NoResultPlaceholder from './NoResultPlaceholder';
import SearchIcon from './icons/SearchIcon';
import ShareButton from './ShareButton';
import FilterControls from './FilterControls';
import SubmitButton from './SubmitButton';
import ImplicitComSuffix from './ImplicitComSuffix';
import AlternativeExtensionsResults from './AlternativeExtensionsResults';
import AlternativeComResults from './AlternativeComResults';
import AISuggestionsResults from './AISuggestionsResults';
import { useDomainState } from '@/hooks/useDomainState';
import { useAISuggestions } from '@/hooks/useAISuggestions';
import { useFilters } from '@/hooks/useFilters';
import { useFavicon } from '@/hooks/useFavicon';
import { categorizeResults } from '@/utils/domainHelpers';

function App() {
  const [
    { domain, sanitizedDomain, displayDomain, domainVariations, domainResults, loading, error },
    { setDomain, handleSubmit, retryDomainCheck, checkSingleDomain },
  ] = useDomainState();

  const [{ aiSuggestions, isGeneratingAI }, { handleGenerateAI }] = useAISuggestions();
  const { filters, setAvailabilityFilter, setTldFilter, checkDomainAgainstFilters } = useFilters();

  useFavicon(displayDomain, domainResults);

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value);
  };

  const { mainDomain, alternativeExtensions, alternativeSuggestions } = categorizeResults(
    domainVariations,
    displayDomain
  );

  // Filter the domain lists based on the current filters
  const filteredAlternativeExtensions = alternativeExtensions.filter(variation =>
    checkDomainAgainstFilters(variation.domain, domainResults)
  );
  const filteredAlternativeSuggestions = alternativeSuggestions.filter(variation =>
    checkDomainAgainstFilters(variation.domain, domainResults)
  );
  const filteredAiSuggestions = aiSuggestions.filter(variation =>
    checkDomainAgainstFilters(variation.domain, domainResults)
  );

  const mainDomainResult = domainResults[displayDomain];
  const isMainDomainAvailable =
    mainDomainResult && !mainDomainResult.loading && mainDomainResult.data?.isAvailable === true;
  const isMainDomainUnavailable =
    mainDomainResult && !mainDomainResult.loading && mainDomainResult.data?.isAvailable === false;

  return (
    <div className="flex min-h-screen flex-col items-center bg-background p-3 sm:p-4">
      <div className="w-full max-w-7xl">
        {/* Header and Search Form */}
        <div className="mb-8">
          <h1 className="mb-6 mt-12 text-center font-display text-4xl font-semibold tracking-tight text-text sm:mb-8 sm:mt-20 sm:text-5xl">
            <span className="relative inline-block">
              <span className="absolute inset-0 -z-10 translate-y-3 bg-primary/5 blur-2xl"></span>
              Sup'
            </span>{' '}
            <span className="relative inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              <span className="absolute inset-0 -z-10 translate-y-3 bg-secondary/5 blur-2xl"></span>
              Domain
            </span>
          </h1>
          <p className="mb-8 text-center text-base text-text-muted sm:text-lg">
            Search domains safely. No sneaky snatching.
          </p>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative flex items-center">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                <SearchIcon />
              </span>
              <input
                type="text"
                name="domain"
                id="domain"
                placeholder="Search for a domain name here..."
                value={domain}
                onChange={handleDomainChange}
                className={`w-full rounded-lg border border-background-lighter bg-background py-3 pl-10 pr-[120px] text-base shadow-sm ring-1 ring-background-lighter transition-all duration-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:py-3.5 sm:pr-[140px] ${
                  isMainDomainAvailable
                    ? 'border-green-600/20 font-medium text-green-600 ring-green-600/20 focus:border-green-600 focus:ring-green-600'
                    : isMainDomainUnavailable
                      ? 'border-red-600/50 text-red-600 ring-red-600/20 focus:border-red-600 focus:ring-red-600'
                      : 'text-text'
                }`}
              />
              <div className="absolute right-1 top-1/2 flex h-[calc(100%-8px)] -translate-y-1/2 items-center gap-1">
                <ShareButton displayDomain={domain} />
                <SubmitButton loading={loading} />
              </div>

              <ImplicitComSuffix domain={domain} />
            </div>

            {domain && <DomainScore domain={sanitizedDomain} />}
          </form>

          {error && (
            <div className="mt-4 rounded-lg border-l-4 border-primary bg-primary/5 p-4 text-text">
              <p className="font-medium">{error}</p>
            </div>
          )}
        </div>

        <FilterControls
          availabilityFilter={filters.availabilityFilter}
          tldFilter={filters.tldFilter}
          onAvailabilityFilterChange={setAvailabilityFilter}
          onTldFilterChange={setTldFilter}
        />

        {/* Results Section */}
        {domainVariations.length > 0 ? (
          <div className="mb-8 w-full space-y-8">
            {/* Original Domain */}
            {mainDomain && (
              <div className="w-full">
                <DomainResult
                  key={mainDomain.domain}
                  parts={mainDomain}
                  data={domainResults[mainDomain.domain].data}
                  loading={domainResults[mainDomain.domain]?.loading}
                  onRetry={() => retryDomainCheck(mainDomain.domain)}
                  showPrice={true}
                />
              </div>
            )}

            {/* AI Suggestions */}
            <AISuggestionsResults
              aiSuggestions={aiSuggestions}
              filteredAiSuggestions={filteredAiSuggestions}
              domainResults={domainResults}
              isGeneratingAI={isGeneratingAI}
              retryDomainCheck={retryDomainCheck}
              onGenerateAI={() => handleGenerateAI(sanitizedDomain, checkSingleDomain)}
            />

            {/* Alternative Extensions */}
            <AlternativeExtensionsResults
              alternativeExtensions={alternativeExtensions}
              filteredAlternativeExtensions={filteredAlternativeExtensions}
              domainResults={domainResults}
              retryDomainCheck={retryDomainCheck}
            />

            {/* Alternative .com Suggestions */}
            <AlternativeComResults
              alternativeSuggestions={alternativeSuggestions}
              filteredAlternativeSuggestions={filteredAlternativeSuggestions}
              domainResults={domainResults}
              retryDomainCheck={retryDomainCheck}
            />
          </div>
        ) : (
          <NoResultPlaceholder domain={domain} sanitizedDomain={sanitizedDomain} />
        )}
      </div>
    </div>
  );
}

export default App;
