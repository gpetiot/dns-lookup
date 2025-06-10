'use client';

import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import DomainResult from './DomainResult';
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
  const [showConfetti, setShowConfetti] = useState(false);
  const [showExtensions, setShowExtensions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const [
    { domain, sanitizedDomain, displayDomain, domainVariations, domainResults, loading, error },
    {
      setDomain,
      handleSubmit,
      retryDomainCheck,
      checkSingleDomain,
      loadAlternativeExtensions,
      loadAlternativeSuggestions,
    },
  ] = useDomainState();

  const [{ aiSuggestions, isGeneratingAI }, { handleGenerateAI }] = useAISuggestions();
  const { filters, setAvailableOnly, setDotComOnly, checkDomainAgainstFilters } = useFilters();

  useFavicon(displayDomain, domainResults);

  // Reset toggle states when displayDomain changes (new search)
  useEffect(() => {
    setShowExtensions(false);
    setShowSuggestions(false);
    setShowAI(false);
  }, [displayDomain]);

  // Effect to trigger confetti when main domain becomes available
  useEffect(() => {
    const mainDomainResult = domainResults[displayDomain];
    const isMainDomainAvailable =
      mainDomainResult && !mainDomainResult.loading && mainDomainResult.data?.isAvailable === true;

    if (isMainDomainAvailable && displayDomain) {
      setShowConfetti(true);
    }
  }, [domainResults, displayDomain]);

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value);
  };

  // Handlers for loading alternatives
  const handleLoadExtensions = async () => {
    if (!showExtensions) {
      setShowExtensions(true);
      await loadAlternativeExtensions();
    } else {
      setShowExtensions(false);
    }
  };

  const handleLoadSuggestions = async () => {
    if (!showSuggestions) {
      setShowSuggestions(true);
      await loadAlternativeSuggestions();
    } else {
      setShowSuggestions(false);
    }
  };

  const handleToggleAI = () => {
    setShowAI(!showAI);
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
    <div className="flex flex-col items-center py-8 sm:py-12">
      <div className="w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Search Form */}
        <div className="mb-4 flex flex-col items-center justify-center sm:mb-6">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative">
              <div className="relative flex items-center">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {mainDomainResult?.loading ? (
                    <LoadingIcon className="h-5 w-5" />
                  ) : isMainDomainAvailable ? (
                    <AvailableIcon className="h-5 w-5 text-emerald-600" />
                  ) : isMainDomainUnavailable ? (
                    <RegisteredIcon className="h-5 w-5 text-rose-600" />
                  ) : (
                    <></>
                  )}
                </span>
                <input
                  type="text"
                  name="domain"
                  id="domain"
                  placeholder="Search for a domain name here..."
                  value={domain}
                  onChange={handleDomainChange}
                  className={`w-full rounded-2xl border-2 bg-white py-4 pl-12 pr-[200px] text-lg shadow-md transition-all duration-200 focus:outline-none ${
                    isMainDomainAvailable
                      ? 'border-emerald-400 font-medium text-emerald-700 ring-emerald-500/20 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20'
                      : isMainDomainUnavailable
                        ? 'border-rose-400 text-rose-700 ring-rose-500/20 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20'
                        : 'border-gray-200 text-gray-900 hover:border-gray-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20'
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
                <div className="mb-6 rounded-2xl border-l-4 border-rose-500 bg-rose-50 p-4 text-rose-700">
                  <p className="font-medium">{error}</p>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Results Section */}
        {domainVariations.length > 0 ? (
          <div className="space-y-6">
            {/* Original Domain */}
            {mainDomain && (
              <div className="mb-14 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-200 hover:border-gray-300 hover:shadow-xl">
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
            <div className="mt-8 space-y-4">
              {!showAI ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                  <button
                    onClick={handleToggleAI}
                    className="flex w-full items-center justify-between text-left transition-colors hover:text-blue-600"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">AI Suggestions</h3>
                        <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-2 py-0.5 text-xs font-medium text-yellow-600">
                          Experimental
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Get creative AI-generated domain suggestions
                      </p>
                    </div>
                    <span className="text-2xl text-gray-400">+</span>
                  </button>
                </div>
              ) : (
                <AISuggestionsResults
                  aiSuggestions={aiSuggestions}
                  filteredAiSuggestions={filteredAiSuggestions}
                  domainResults={domainResults}
                  isGeneratingAI={isGeneratingAI}
                  retryDomainCheck={retryDomainCheck}
                  onGenerateAI={() => handleGenerateAI(sanitizedDomain, checkSingleDomain)}
                  onToggle={handleToggleAI}
                />
              )}
            </div>

            {/* Alternative Extensions */}
            <div className="space-y-4">
              {!showExtensions ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                  <button
                    onClick={handleLoadExtensions}
                    className="flex w-full items-center justify-between text-left transition-colors hover:text-blue-600"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Alternative Extensions Suggestions
                      </h3>
                      <p className="text-sm text-gray-600">
                        Try different extensions (.net, .org, .io, etc.)
                      </p>
                    </div>
                    <span className="text-2xl text-gray-400">+</span>
                  </button>
                </div>
              ) : (
                <AlternativeExtensionsResults
                  alternativeExtensions={alternativeExtensions}
                  filteredAlternativeExtensions={filteredAlternativeExtensions}
                  domainResults={domainResults}
                  retryDomainCheck={retryDomainCheck}
                  onToggle={handleLoadExtensions}
                />
              )}
            </div>

            {/* Alternative .com Suggestions */}
            <div className="space-y-4">
              {!showSuggestions ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                  <button
                    onClick={handleLoadSuggestions}
                    className="flex w-full items-center justify-between text-left transition-colors hover:text-blue-600"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Alternative .com Suggestions
                      </h3>
                      <p className="text-sm text-gray-600">
                        Creative variations with prefixes and suffixes
                      </p>
                    </div>
                    <span className="text-2xl text-gray-400">+</span>
                  </button>
                </div>
              ) : (
                <AlternativeComResults
                  alternativeSuggestions={alternativeSuggestions}
                  filteredAlternativeSuggestions={filteredAlternativeSuggestions}
                  domainResults={domainResults}
                  retryDomainCheck={retryDomainCheck}
                  onToggle={handleLoadSuggestions}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">Enter a domain name to get started</div>
        )}

        {/* Confetti Animation - Shown when main domain is available */}
        {showConfetti && (
          <div className="pointer-events-none fixed inset-0 z-50">
            <Confetti
              recycle={false}
              numberOfPieces={200}
              gravity={0.15}
              colors={['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#6366f1']}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
