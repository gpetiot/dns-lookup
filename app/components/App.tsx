'use client';

import React from 'react';
import DomainResult from './DomainResult';
import NoResultPlaceholder from './NoResultPlaceholder';
import SearchIcon from './icons/SearchIcon';
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
import AvailableIcon from './icons/AvailableIcon';
import RegisteredIcon from './icons/RegisteredIcon';
import LoadingIcon from './icons/LoadingIcon';
import FeaturedResults from './FeaturedResults';

function App() {
  const [
    { domain, sanitizedDomain, displayDomain, domainVariations, domainResults, loading, error },
    { setDomain, handleSubmit, retryDomainCheck, checkSingleDomain },
  ] = useDomainState();

  const [{ aiSuggestions, isGeneratingAI }, { handleGenerateAI }] = useAISuggestions();
  const { filters, setAvailableOnly, setDotComOnly, checkDomainAgainstFilters } = useFilters();

  useFavicon(displayDomain, domainResults);

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value);
  };

  const { mainDomain, alternativeExtensions, alternativeSuggestions, featuredDomains } =
    categorizeResults(domainVariations, displayDomain);

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
  const filteredFeaturedDomains = featuredDomains.filter(domain =>
    checkDomainAgainstFilters(domain.domain, domainResults)
  );

  const mainDomainResult = domainResults[displayDomain];
  const isMainDomainAvailable =
    mainDomainResult && !mainDomainResult.loading && mainDomainResult.data?.isAvailable === true;
  const isMainDomainUnavailable =
    mainDomainResult && !mainDomainResult.loading && mainDomainResult.data?.isAvailable === false;

  return (
    <div className="flex min-h-screen flex-col items-center bg-white">
      <div className="w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header and Search Form */}
        <div className="flex flex-col items-center justify-center pt-16 sm:pt-24">
          <h1 className="mb-8 font-display text-3xl font-medium text-gray-900">Sup' Domain</h1>

          <p className="mb-12 max-w-lg text-center text-lg text-gray-600">
            Search domains safely. No sneaky snatching.
          </p>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative mb-6">
              <div className="relative flex items-center">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {mainDomainResult?.loading ? (
                    <LoadingIcon className="h-5 w-5" />
                  ) : isMainDomainAvailable ? (
                    <AvailableIcon className="h-5 w-5 text-green-600" />
                  ) : isMainDomainUnavailable ? (
                    <RegisteredIcon className="h-5 w-5 text-red-600" />
                  ) : (
                    <SearchIcon className="h-5 w-5" />
                  )}
                </span>
                <input
                  type="text"
                  name="domain"
                  id="domain"
                  placeholder="Search for a domain name here..."
                  value={domain}
                  onChange={handleDomainChange}
                  className={`w-full rounded-full border-2 bg-white py-4 pl-12 pr-[200px] text-lg shadow-sm transition-all duration-200 focus:outline-none ${
                    isMainDomainAvailable
                      ? 'border-green-600/30 font-medium text-green-700 ring-green-600/20 focus:border-green-600 focus:ring-2 focus:ring-green-600/20'
                      : isMainDomainUnavailable
                        ? 'border-red-600/30 text-red-700 ring-red-600/20 focus:border-red-600 focus:ring-2 focus:ring-red-600/20'
                        : 'border-gray-200 text-gray-900 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  }`}
                />
                <div className="absolute right-2 top-1/2 flex h-[calc(100%-16px)] -translate-y-1/2 items-center gap-1.5">
                  <FilterControls
                    availableOnly={filters.availableOnly}
                    dotComOnly={filters.dotComOnly}
                    onAvailableOnlyChange={setAvailableOnly}
                    onDotComOnlyChange={setDotComOnly}
                  />
                  <SubmitButton loading={loading} />
                </div>

                <ImplicitComSuffix domain={domain} />
              </div>

              {error && (
                <div className="mb-6 rounded-lg border-l-4 border-red-500 bg-red-50 p-4 text-red-700">
                  <p className="font-medium">{error}</p>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Results Section */}
        {domainVariations.length > 0 ? (
          <div className="mb-16 space-y-8">
            {/* Original Domain */}
            {mainDomain && (
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
                <DomainResult
                  key={mainDomain.domain}
                  parts={mainDomain}
                  data={domainResults[mainDomain.domain].data}
                  loading={domainResults[mainDomain.domain]?.loading}
                  onRetry={() => retryDomainCheck(mainDomain.domain)}
                  showPrice={false}
                />
              </div>
            )}

            {/* Featured Domains */}
            <div className="space-y-4">
              <FeaturedResults
                featuredDomains={featuredDomains}
                filteredFeaturedDomains={filteredFeaturedDomains}
                domainResults={domainResults}
                retryDomainCheck={retryDomainCheck}
              />
            </div>

            {/* AI Suggestions */}
            <div className="space-y-4">
              <AISuggestionsResults
                aiSuggestions={aiSuggestions}
                filteredAiSuggestions={filteredAiSuggestions}
                domainResults={domainResults}
                isGeneratingAI={isGeneratingAI}
                retryDomainCheck={retryDomainCheck}
                onGenerateAI={() => handleGenerateAI(sanitizedDomain, checkSingleDomain)}
              />
            </div>

            {/* Alternative Extensions */}
            <div className="space-y-4">
              <AlternativeExtensionsResults
                alternativeExtensions={alternativeExtensions}
                filteredAlternativeExtensions={filteredAlternativeExtensions}
                domainResults={domainResults}
                retryDomainCheck={retryDomainCheck}
              />
            </div>

            {/* Alternative .com Suggestions */}
            <div className="space-y-4">
              <AlternativeComResults
                alternativeSuggestions={alternativeSuggestions}
                filteredAlternativeSuggestions={filteredAlternativeSuggestions}
                domainResults={domainResults}
                retryDomainCheck={retryDomainCheck}
              />
            </div>
          </div>
        ) : (
          <NoResultPlaceholder domain={domain} sanitizedDomain={sanitizedDomain} />
        )}
      </div>
    </div>
  );
}

export default App;
