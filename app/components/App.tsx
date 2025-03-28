'use client';

import React, { useState } from 'react';
import DomainResult from './DomainResult';
import DomainScore from './DomainScore';
import NoResultPlaceholder from './NoResultPlaceholder';
import {
  generateDomainVariations,
  generateAIDomainSuggestions,
  sanitizeDomain,
  DomainParts,
} from '@/utils/domainUtils';
import { checkDomain } from '@/services/whoisService';
import type { WhoIsResult } from 'whois-parsed';

function App() {
  const [domain, setDomain] = useState('');
  const [sanitizedDomain, setSanitizedDomain] = useState('');
  const [displayDomain, setDisplayDomain] = useState('');
  const [domainVariations, setDomainVariations] = useState<DomainParts[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<DomainParts[]>([]);
  const [domainResults, setDomainResults] = useState<
    Record<string, { loading: boolean; data?: WhoIsResult }>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Function to retry checking a specific domain
  const retryDomainCheck = async (domainToRetry: string) => {
    // Update just this domain to loading state
    setDomainResults(prev => ({
      ...prev,
      [domainToRetry]: { loading: true },
    }));

    try {
      // Check just this one domain
      const result = await checkDomain(domainToRetry);

      // Update the result for this domain
      setDomainResults(prev => ({
        ...prev,
        [domainToRetry]: { loading: false, data: result.data },
      }));
    } catch (err: any) {
      console.error(`Error retrying check for ${domainToRetry}:`, err);
      setDomainResults(prev => ({
        ...prev,
        [domainToRetry]: {
          loading: false,
          data: {
            domainName: domainToRetry,
            isAvailable: false,
            status: err.message,
          },
        },
      }));
    }
  };

  // Function to check a single domain and update its result
  const checkSingleDomain = async (domainToCheck: string) => {
    try {
      const result = await checkDomain(domainToCheck);
      // Update the result for this domain
      setDomainResults(prev => ({
        ...prev,
        [domainToCheck]: { loading: false, data: result.data },
      }));
      return result;
    } catch (err: any) {
      console.error(`Error checking ${domainToCheck}:`, err);
      setDomainResults(prev => ({
        ...prev,
        [domainToCheck]: {
          loading: false,
          data: {
            domainName: domainToCheck,
            isAvailable: false,
            status: err.message,
          },
        },
      }));
      throw err;
    }
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDomain(value);
    setSanitizedDomain(sanitizeDomain(value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!domain) {
      setError('Please enter a domain');
      return;
    }

    // Update the display domain when submitting
    setDisplayDomain(sanitizedDomain);

    // Use the already sanitized domain from state
    if (sanitizedDomain !== domain) {
      console.log(`Domain sanitized from "${domain}" to "${sanitizedDomain}"`);
    }

    setLoading(true);
    setError(null);

    // Generate variations of the domain name using the original user input
    const variations = generateDomainVariations(sanitizedDomain, domain);
    setDomainVariations(variations);

    // Initialize all domains with loading state
    const initialResults: Record<string, { loading: boolean }> = {};
    variations.forEach(variation => {
      initialResults[variation.domain] = { loading: true };
    });
    setDomainResults(initialResults);

    try {
      // Process all domains independently with a small stagger
      let completedCount = 0;

      // Start checking all domains with a small delay between each
      variations.forEach((variation, index) => {
        // Stagger the requests by 300ms each to avoid rate limiting
        setTimeout(() => {
          checkSingleDomain(variation.domain).finally(() => {
            completedCount++;
            // When all domains have been checked, set loading to false
            if (completedCount === variations.length) {
              setLoading(false);
            }
          });
        }, index * 300); // 300ms delay between each request
      });
    } catch (err) {
      console.error('Error processing domain check:', err);
      setError('An error occurred while checking domains. Please try again later.');
      setLoading(false);
    } finally {
      // This ensures the loading state is reset if forEach above throws an error
      setTimeout(
        () => {
          if (loading) {
            console.log('Backup loading state reset triggered');
            setLoading(false);
          }
        },
        variations.length * 300 + 5000
      ); // Wait for all possible requests plus a buffer
    }
  };

  // Functions to categorize domains
  const getMainDomain = () => {
    if (!domainVariations.length) return null;
    // Return the exact domain that was requested
    return domainVariations.find(variation => variation.domain === displayDomain);
  };

  const getAlternativeExtensions = () => {
    if (!domainVariations.length) return [];

    return domainVariations.filter(
      variation =>
        variation.prefix === undefined &&
        variation.suffix === undefined &&
        variation.domain !== displayDomain
    );
  };

  const getAlternativeSuggestions = () => {
    if (!domainVariations.length) return [];

    return domainVariations.filter(
      variation => variation.prefix !== undefined || variation.suffix !== undefined
    );
  };

  const mainDomain = getMainDomain();
  const alternativeExtensions = getAlternativeExtensions();
  const alternativeSuggestions = getAlternativeSuggestions();

  const handleGenerateAI = async () => {
    if (!sanitizedDomain) return;

    setIsGeneratingAI(true);
    setError(null);

    try {
      const suggestions = await generateAIDomainSuggestions(
        sanitizedDomain,
        aiSuggestions.length === 0
      );

      // Filter out any duplicates with existing suggestions
      const existingDomains = new Set([...domainVariations, ...aiSuggestions].map(d => d.domain));
      const newSuggestions = suggestions.filter(s => !existingDomains.has(s.domain));

      if (newSuggestions.length === 0) {
        setError('No new unique suggestions generated. Try again for different variations.');
        return;
      }

      setAiSuggestions(prev => [...prev, ...newSuggestions]);

      // Initialize loading state for new suggestions
      const newResults: Record<string, { loading: boolean }> = {};
      newSuggestions.forEach(suggestion => {
        newResults[suggestion.domain] = { loading: true };
      });
      setDomainResults(prev => ({ ...prev, ...newResults }));

      // Check availability for new suggestions
      newSuggestions.forEach((suggestion, index) => {
        setTimeout(() => {
          checkSingleDomain(suggestion.domain);
        }, index * 300);
      });
    } catch (err) {
      console.error('Error generating AI suggestions:', err);
      setError('Failed to generate AI suggestions. Please try again.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 p-4">
      <div className="w-full max-w-7xl">
        {/* Header and Search Form */}
        <div className="mb-8">
          <h1 className="mb-6 text-center text-3xl font-bold text-blue-600">Domain Checker</h1>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  name="domain"
                  id="domain"
                  placeholder="Search for a domain name here..."
                  value={domain}
                  onChange={handleDomainChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {domain && <DomainScore domain={sanitizedDomain} />}
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="focus:shadow-outline h-10 whitespace-nowrap rounded-md bg-blue-500 px-4 font-bold text-white transition duration-300 hover:bg-blue-600 focus:outline-none"
                >
                  {loading ? 'Checking...' : 'Check'}
                </button>
                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={isGeneratingAI}
                  className="focus:shadow-outline h-10 whitespace-nowrap rounded-md bg-purple-500 px-4 font-bold text-white transition duration-300 hover:bg-purple-600 focus:outline-none"
                >
                  {isGeneratingAI ? 'Generating...' : 'Generate AI Suggestions'}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="mt-4 border-l-4 border-red-500 bg-red-100 p-4 text-red-700">
              <p className="font-medium">{error}</p>
            </div>
          )}
        </div>

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
              <h2 className="mb-4 border-b pb-2 text-xl font-semibold text-gray-800">
                AI-Generated Suggestions
              </h2>
              {aiSuggestions.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {aiSuggestions.map(variation => (
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
                <div className="relative flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2 opacity-70">
                  <div className="flex flex-grow items-center">
                    <div className="mr-2 w-8 flex-shrink-0">
                      <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200" />
                    </div>
                    <div className="text-md font-medium text-gray-400">
                      Click "Generate AI Suggestions" to get creative domain ideas
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm text-gray-400">
                      {isGeneratingAI ? 'Generating suggestions...' : 'Powered by AI'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Alternative Extensions */}
            {alternativeExtensions.length > 0 && (
              <div className="w-full">
                <h2 className="mb-4 border-b pb-2 text-xl font-semibold text-gray-800">
                  Alternative Extensions Suggestions
                </h2>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {alternativeExtensions.map(variation => (
                    <DomainResult
                      key={variation.domain}
                      parts={variation}
                      data={domainResults[variation.domain]?.data}
                      loading={domainResults[variation.domain]?.loading}
                      onRetry={() => retryDomainCheck(variation.domain)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Alternative .com Suggestions */}
            {alternativeSuggestions.length > 0 && (
              <div className="w-full">
                <h2 className="mb-4 border-b pb-2 text-xl font-semibold text-gray-800">
                  Alternative .com Suggestions
                </h2>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {alternativeSuggestions.map(variation => (
                    <DomainResult
                      key={variation.domain}
                      parts={variation}
                      data={domainResults[variation.domain]?.data}
                      loading={domainResults[variation.domain]?.loading}
                      onRetry={() => retryDomainCheck(variation.domain)}
                    />
                  ))}
                </div>
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
