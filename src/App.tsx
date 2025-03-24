import React, { useState, useEffect } from 'react';
import DomainResult from './components/DomainResult';
import DomainScore from './components/DomainScore';
import NoResultPlaceholder from './components/NoResultPlaceholder';
import {
  prefixes,
  suffixes,
  generateDomainVariations,
  sanitizeDomain,
  fetchDomainPreview,
} from './utils/domainUtils';
import { checkDomain } from './services/whoisAPILayerService';

function App() {
  const [domain, setDomain] = useState('');
  const [sanitizedDomain, setSanitizedDomain] = useState('');
  const [displayDomain, setDisplayDomain] = useState('');
  const [domainVariations, setDomainVariations] = useState([]);
  const [domainResults, setDomainResults] = useState({});
  const [domainPreviews, setDomainPreviews] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load previews for registered domains
  useEffect(() => {
    const loadDomainPreviews = async () => {
      // Find all registered domains
      const registeredDomains = Object.keys(domainResults).filter(domain => {
        const result = domainResults[domain];
        return (
          !result.loading && result.data && !result.data.error && result.data.result !== 'available'
        );
      });

      // Preload previews for registered domains that don't have previews yet
      for (const domain of registeredDomains) {
        if (!domainPreviews[domain]) {
          try {
            console.log(`Preloading preview for ${domain}`);
            const preview = await fetchDomainPreview(domain);

            setDomainPreviews(prev => ({
              ...prev,
              [domain]: preview,
            }));
          } catch (error) {
            console.error(`Error loading preview for ${domain}:`, error);
          }
        }
      }
    };

    if (Object.keys(domainResults).length > 0) {
      loadDomainPreviews();
    }
  }, [domainResults, domainPreviews]);

  // Function to retry checking a specific domain
  const retryDomainCheck = async domainToRetry => {
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
    } catch (err) {
      console.error(`Error retrying check for ${domainToRetry}:`, err);
      setDomainResults(prev => ({
        ...prev,
        [domainToRetry]: {
          loading: false,
          data: { error: err.message || 'Retry failed' },
        },
      }));
    }
  };

  // Function to check a single domain and update its result
  const checkSingleDomain = async domainToCheck => {
    try {
      const result = await checkDomain(domainToCheck);
      // Update the result for this domain
      setDomainResults(prev => ({
        ...prev,
        [domainToCheck]: { loading: false, data: result.data },
      }));
      return result;
    } catch (err) {
      console.error(`Error checking ${domainToCheck}:`, err);
      setDomainResults(prev => ({
        ...prev,
        [domainToCheck]: {
          loading: false,
          data: { error: err.message || 'Request failed' },
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

  const handleSubmit = async e => {
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
    // Clear previous results and previews
    setDomainPreviews({});

    // Generate variations of the domain name
    const variations = generateDomainVariations(sanitizedDomain);
    setDomainVariations(variations);

    // Initialize all domains with loading state
    const initialResults = {};
    variations.forEach(variation => {
      initialResults[variation] = { loading: true };
    });
    setDomainResults(initialResults);

    try {
      // Process all domains independently with a small stagger
      let completedCount = 0;

      // Start checking all domains with a small delay between each
      variations.forEach((domainVariation, index) => {
        // Stagger the requests by 300ms each to avoid rate limiting
        setTimeout(() => {
          checkSingleDomain(domainVariation).finally(() => {
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
      // The loading state is also handled in each individual request's finally,
      // but this is a backup to ensure it always gets reset
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
    // Find the original domain with .com extension
    return domainVariations.find(domain => {
      // Match the base domain name + .com
      const baseDomainName = displayDomain.split('.')[0];
      return domain === `${baseDomainName}.com`;
    });
  };

  const getAlternativeExtensions = () => {
    if (!domainVariations.length) return [];
    const baseDomainName = displayDomain.split('.')[0];

    // All domains that start with the base name but aren't .com
    return domainVariations.filter(domain => {
      const domainParts = domain.split('.');
      return domainParts[0] === baseDomainName && domainParts[1] !== 'com';
    });
  };

  const getAlternativeSuggestions = () => {
    if (!domainVariations.length) return [];
    const baseDomainName = displayDomain.split('.')[0];

    // All .com domains that have been modified with prefixes or suffixes
    return domainVariations.filter(domain => {
      const domainParts = domain.split('.');
      return domainParts[0] !== baseDomainName && domainParts[1] === 'com';
    });
  };

  const mainDomain = getMainDomain();
  const alternativeExtensions = getAlternativeExtensions();
  const alternativeSuggestions = getAlternativeSuggestions();

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center">
      <div className="w-full max-w-7xl">
        {/* Header and Search Form */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Domain Checker</h1>

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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {domain && <DomainScore domain={sanitizedDomain} />}
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="h-10 bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300 whitespace-nowrap"
                >
                  {loading ? 'Checking...' : 'Check'}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
              <p className="font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {domainVariations.length > 0 ? (
          <div className="w-full mb-8 space-y-8">
            {/* Original Domain */}
            {mainDomain && (
              <div className="w-full">
                <DomainResult
                  key={mainDomain}
                  domain={mainDomain}
                  data={domainResults[mainDomain]?.data}
                  loading={domainResults[mainDomain]?.loading}
                  onRetry={() => retryDomainCheck(mainDomain)}
                  preloadedPreview={domainPreviews[mainDomain]}
                />
              </div>
            )}

            {/* Alternative Extensions */}
            {alternativeExtensions.length > 0 && (
              <div className="w-full">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                  Alternative Extensions Suggestions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {alternativeExtensions.map(domainName => (
                    <DomainResult
                      key={domainName}
                      domain={domainName}
                      data={domainResults[domainName]?.data}
                      loading={domainResults[domainName]?.loading}
                      onRetry={() => retryDomainCheck(domainName)}
                      preloadedPreview={domainPreviews[domainName]}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Alternative .com Suggestions */}
            {alternativeSuggestions.length > 0 && (
              <div className="w-full">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                  Alternative .com Suggestions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {alternativeSuggestions.map(domainName => (
                    <DomainResult
                      key={domainName}
                      domain={domainName}
                      data={domainResults[domainName]?.data}
                      loading={domainResults[domainName]?.loading}
                      onRetry={() => retryDomainCheck(domainName)}
                      preloadedPreview={domainPreviews[domainName]}
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
