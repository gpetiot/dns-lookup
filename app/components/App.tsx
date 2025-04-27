'use client';

import React, { useRef, useEffect } from 'react';
import DomainResult from './DomainResult';
import DomainScore from './DomainScore';
import NoResultPlaceholder from './NoResultPlaceholder';
import NoAISuggestionPlaceholder from './NoAISuggestionPlaceholder';
import LoadingIcon from './icons/LoadingIcon';
import SearchIcon from './icons/SearchIcon';
import ShareButton from './ShareButton';
import FilterControls from './FilterControls';
import GenerateAIButton from './GenerateAIButton';
import { useDomainState } from '@/hooks/useDomainState';
import { useAISuggestions } from '@/hooks/useAISuggestions';
import { useFilters } from '@/hooks/useFilters';
import { useFavicon } from '@/hooks/useFavicon';
import { categorizeResults } from '@/utils/domainHelpers';
import type { AvailabilityFilter, TldFilter } from '@/types/domain';

function App() {
  const [
    { domain, sanitizedDomain, displayDomain, domainVariations, domainResults, loading, error },
    { setDomain, handleSubmit, retryDomainCheck, checkSingleDomain },
  ] = useDomainState();

  const [{ aiSuggestions, isGeneratingAI }, { handleGenerateAI }] = useAISuggestions();
  const { filters, setAvailabilityFilter, setTldFilter, checkDomainAgainstFilters } = useFilters();

  useFavicon(displayDomain, domainResults);

  const textMeasureRef = useRef<HTMLSpanElement>(null);
  const [showComSuffix, setShowComSuffix] = React.useState(false);
  const [suffixLeft, setSuffixLeft] = React.useState(40);

  // Effect to show/hide the (.com) suffix and calculate its position
  useEffect(() => {
    const shouldShow = domain.length > 0 && !domain.includes('.');
    setShowComSuffix(shouldShow);

    if (shouldShow && textMeasureRef.current) {
      textMeasureRef.current.textContent = domain;
      const inputPaddingLeftPx = 40;
      const gapPx = 4;
      const textWidthPx = textMeasureRef.current.offsetWidth;
      setSuffixLeft(inputPaddingLeftPx + textWidthPx + gapPx);
    } else if (!shouldShow) {
      setSuffixLeft(40);
    }
  }, [domain]);

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

  const availabilityChoices: { value: AvailabilityFilter; text: string }[] = [
    { value: 'all', text: 'All' },
    { value: 'available', text: 'Available' },
  ];

  const tldChoices: { value: TldFilter; text: string }[] = [
    { value: 'all', text: 'All' },
    { value: 'com', text: '.com Only' },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 p-4">
      {/* Hidden span for text measurement */}
      <span
        ref={textMeasureRef}
        aria-hidden="true"
        className="invisible absolute left-0 top-0 z-[-1] h-0 overflow-hidden whitespace-pre text-lg"
      />

      <div className="w-full max-w-7xl">
        {/* Header and Search Form */}
        <div className="mb-8">
          <h1 className="mb-20 mt-24 text-center text-6xl font-black tracking-tight">
            <span className="relative inline-block bg-blue-600 bg-clip-text text-transparent">
              <span className="absolute inset-0 -z-10 bg-orange-500/10 blur-2xl"></span>
              Domain
            </span>{' '}
            <span className="relative inline-block bg-blue-600 bg-clip-text text-transparent">
              <span className="absolute inset-0 -z-10 bg-orange-500/10 blur-2xl"></span>
              Checker
            </span>
          </h1>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative flex items-center">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </span>
              <input
                type="text"
                name="domain"
                id="domain"
                placeholder="Search for a domain name here..."
                value={domain}
                onChange={handleDomainChange}
                className={`w-full rounded-lg border border-gray-300 py-4 pl-10 pr-[140px] text-lg shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-1 ${
                  isMainDomainAvailable ? 'font-medium text-green-500 focus:text-green-600' : ''
                } ${isMainDomainUnavailable ? 'text-red-500 line-through focus:text-red-600' : ''}`}
              />
              <div className="absolute right-1 top-1/2 flex h-[calc(100%-8px)] -translate-y-1/2 items-center gap-1">
                <ShareButton displayDomain={displayDomain} />
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-full items-center rounded-md border border-blue-400/20 bg-blue-500 px-4 font-bold text-white transition duration-300 hover:bg-blue-600 focus:outline-none disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-1.5">
                      Checking
                      <LoadingIcon />
                    </span>
                  ) : (
                    <>
                      Check
                      <span className="ml-1.5 inline-block rounded border border-white/30 px-1">
                        ↵
                      </span>
                    </>
                  )}
                </button>
              </div>

              {showComSuffix && (
                <span
                  className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-nowrap text-gray-400"
                  style={{ left: `${suffixLeft}px` }}
                >
                  (.com)
                </span>
              )}
            </div>

            {domain && <DomainScore domain={sanitizedDomain} />}
          </form>

          {error && (
            <div className="mt-4 border-l-4 border-red-500 bg-red-100 p-4 text-red-700">
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
                />
              </div>
            )}

            {/* AI Suggestions */}
            <div className="w-full">
              <div className="mb-4 flex items-center gap-3 border-b pb-2">
                <h2 className="text-xl font-semibold text-gray-800">AI-Generated Suggestions</h2>
                <GenerateAIButton
                  isGenerating={isGeneratingAI}
                  onClick={() => handleGenerateAI(sanitizedDomain, checkSingleDomain)}
                />
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

            {/* Alternative Extensions */}
            {alternativeExtensions.length > 0 && (
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
            )}

            {/* Alternative .com Suggestions */}
            {alternativeSuggestions.length > 0 && (
              <div className="w-full">
                <h2 className="mb-4 border-b pb-2 text-xl font-semibold text-gray-800">
                  Alternative .com Suggestions
                </h2>
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
            )}
          </div>
        ) : (
          <NoResultPlaceholder domain={domain} sanitizedDomain={sanitizedDomain} />
        )}
      </div>
    </div>
  );
}

export default App;
