import React, { useState } from 'react';
import DomainResult from './components/DomainResult';
import { prefixes, suffixes, generateDomainVariations, sanitizeDomain } from './utils/domainUtils';
import { checkDomain } from './services/whoisAPILayerService';

function App() {
  const [domain, setDomain] = useState('');
  const [processedDomain, setProcessedDomain] = useState('');
  const [domainVariations, setDomainVariations] = useState([]);
  const [domainResults, setDomainResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to retry checking a specific domain
  const retryDomainCheck = async (domainToRetry) => {
    // Update just this domain to loading state
    setDomainResults(prev => ({
      ...prev,
      [domainToRetry]: { loading: true }
    }));
    
    try {
      // Check just this one domain
      const result = await checkDomain(domainToRetry);
      
      // Update the result for this domain
      setDomainResults(prev => ({
        ...prev,
        [domainToRetry]: { loading: false, data: result.data }
      }));
    } catch (err) {
      console.error(`Error retrying check for ${domainToRetry}:`, err);
      setDomainResults(prev => ({
        ...prev,
        [domainToRetry]: { 
          loading: false, 
          data: { error: err.message || 'Retry failed' } 
        }
      }));
    }
  };

  // Function to check a single domain and update its result
  const checkSingleDomain = async (domainToCheck) => {
    try {
      const result = await checkDomain(domainToCheck);
      // Update the result for this domain
      setDomainResults(prev => ({
        ...prev,
        [domainToCheck]: { loading: false, data: result.data }
      }));
      return result;
    } catch (err) {
      console.error(`Error checking ${domainToCheck}:`, err);
      setDomainResults(prev => ({
        ...prev,
        [domainToCheck]: { 
          loading: false, 
          data: { error: err.message || 'Request failed' } 
        }
      }));
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!domain) {
      setError('Please enter a domain');
      return;
    }
    
    // Process and sanitize the domain input
    const sanitized = sanitizeDomain(domain);
    setProcessedDomain(sanitized);
    
    if (sanitized !== domain) {
      console.log(`Domain sanitized from "${domain}" to "${sanitized}"`);
    }
    
    setLoading(true);
    setError(null);
    
    // Generate variations of the domain name
    const variations = generateDomainVariations(sanitized);
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
          checkSingleDomain(domainVariation)
            .finally(() => {
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
      setTimeout(() => {
        if (loading) {
          console.log('Backup loading state reset triggered');
          setLoading(false);
        }
      }, variations.length * 300 + 5000); // Wait for all possible requests plus a buffer
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 p-4 flex flex-col items-center">
      {/* Input Card */}
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-6 border border-gray-200 mb-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Domain Checker</h1>
        
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <label htmlFor="domain" className="block text-gray-700 font-semibold mb-2">
                Enter Domain Name
              </label>
              <input
                type="text"
                id="domain"
                placeholder="example"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll check your domain with common prefixes and suffixes.
              </p>
            </div>
            <div className="pt-8">
              <button
                type="submit"
                disabled={loading}
                className="h-10 bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300 whitespace-nowrap"
              >
                {loading ? 'Checking...' : 'Check Domains'}
              </button>
            </div>
          </div>
        </form>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            <p className="font-medium">{error}</p>
          </div>
        )}
      </div>
      
      {/* Results Section - Full Width */}
      {domainVariations.length > 0 && (
        <div className="w-full max-w-7xl">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
              Domain Check Results
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {domainVariations.map((domainName) => (
                <DomainResult 
                  key={domainName}
                  domain={domainName}
                  data={domainResults[domainName]?.data}
                  loading={domainResults[domainName]?.loading}
                  onRetry={() => retryDomainCheck(domainName)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
