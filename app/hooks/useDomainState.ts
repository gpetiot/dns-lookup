import { useState, useEffect } from 'react';
import { checkDomain } from '@/services/whoisService';
import { generateDomainVariations, sanitizeDomain } from '@/utils/domainUtils';
import type { DomainParts, DomainResults } from '@/types/domain';
import { parseFeaturedDomain } from '@/utils/domainHelpers';
import { featuredDomains } from '../../data/featured';

export interface DomainState {
  domain: string;
  sanitizedDomain: string;
  displayDomain: string;
  domainVariations: DomainParts[];
  domainResults: DomainResults;
  loading: boolean;
  error: string | null;
}

export interface DomainStateActions {
  setDomain: (value: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  retryDomainCheck: (domainToRetry: string) => Promise<void>;
  checkSingleDomain: (domainToCheck: string) => Promise<any>;
}

export function useDomainState(): [DomainState, DomainStateActions] {
  const [domain, setDomain] = useState('');
  const [sanitizedDomain, setSanitizedDomain] = useState('');
  const [displayDomain, setDisplayDomain] = useState('');
  const [domainVariations, setDomainVariations] = useState<DomainParts[]>([]);
  const [domainResults, setDomainResults] = useState<DomainResults>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Effect to check featured domains on initial load
  useEffect(() => {
    const checkFeaturedDomains = async () => {
      const featuredVariations = featuredDomains.map(domain => parseFeaturedDomain(domain));

      // Set initial variations with featured domains
      setDomainVariations(featuredVariations);

      // Initialize results for featured domains
      const initialResults: DomainResults = {};
      featuredVariations.forEach(variation => {
        initialResults[variation.domain] = { loading: true };
      });
      setDomainResults(initialResults);

      // Check each featured domain
      featuredVariations.forEach((variation, index) => {
        setTimeout(() => {
          checkSingleDomain(variation.domain);
        }, index * 300);
      });
    };

    checkFeaturedDomains();
  }, []);

  // Effect to read query parameter on initial load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryDomain = urlParams.get('q');
    if (queryDomain) {
      const decodedDomain = decodeURIComponent(queryDomain);
      setDomain(decodedDomain);
      setSanitizedDomain(sanitizeDomain(decodedDomain));
    }
  }, []);

  // Effect to debounce domain changes
  useEffect(() => {
    if (!sanitizedDomain) return;

    const timer = setTimeout(() => {
      if (sanitizedDomain && sanitizedDomain !== displayDomain) {
        setDisplayDomain(sanitizedDomain);
        handleSubmit(new Event('submit') as any);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [sanitizedDomain, displayDomain]);

  const handleDomainChange = (value: string) => {
    setDomain(value);
    setSanitizedDomain(sanitizeDomain(value));
  };

  const checkSingleDomain = async (domainToCheck: string) => {
    try {
      const result = await checkDomain(domainToCheck);
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

  const retryDomainCheck = async (domainToRetry: string) => {
    setDomainResults(prev => ({
      ...prev,
      [domainToRetry]: { loading: true },
    }));

    try {
      await checkSingleDomain(domainToRetry);
    } catch (err) {
      // Error already handled in checkSingleDomain
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!domain) {
      setError('Please enter a domain');
      return;
    }

    if (sanitizedDomain === displayDomain && domainVariations.length > 0) {
      return;
    }

    setDisplayDomain(sanitizedDomain);
    setLoading(true);
    setError(null);

    // Generate new variations and combine with featured domains
    const searchVariations = generateDomainVariations(sanitizedDomain, domain);
    const featuredVariations = featuredDomains.map(domain => parseFeaturedDomain(domain));
    const allVariations = [...searchVariations, ...featuredVariations];
    setDomainVariations(allVariations);

    // Initialize results for new domains only
    const initialResults: DomainResults = {};
    searchVariations.forEach(variation => {
      initialResults[variation.domain] = { loading: true };
    });
    setDomainResults(prev => ({ ...prev, ...initialResults }));

    try {
      let completedCount = 0;
      const totalToCheck = searchVariations.length;

      searchVariations.forEach((variation, index) => {
        setTimeout(() => {
          checkSingleDomain(variation.domain).finally(() => {
            completedCount++;
            if (completedCount === totalToCheck) {
              setLoading(false);
            }
          });
        }, index * 300);
      });
    } catch (err) {
      console.error('Error processing domain check:', err);
      setError('An error occurred while checking domains. Please try again later.');
      setLoading(false);
    } finally {
      setTimeout(
        () => {
          if (loading) {
            console.log('Backup loading state reset triggered');
            setLoading(false);
          }
        },
        searchVariations.length * 300 + 5000
      );
    }
  };

  return [
    { domain, sanitizedDomain, displayDomain, domainVariations, domainResults, loading, error },
    { setDomain: handleDomainChange, handleSubmit, retryDomainCheck, checkSingleDomain },
  ];
}
