import { useState, useEffect, useCallback } from 'react';
import { checkDomain } from '@/services/whoisService';
import {
  generateMainDomain,
  generateAlternativeExtensions,
  generateAlternativeSuggestions,
  sanitizeDomain,
} from '@/utils/domainUtils';
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
  loadAlternativeExtensions: () => Promise<void>;
  loadAlternativeSuggestions: () => Promise<void>;
}

export function useDomainState(): [DomainState, DomainStateActions] {
  const [domain, setDomain] = useState('');
  const [sanitizedDomain, setSanitizedDomain] = useState('');
  const [displayDomain, setDisplayDomain] = useState('');
  const [domainVariations, setDomainVariations] = useState<DomainParts[]>([]);
  const [domainResults, setDomainResults] = useState<DomainResults>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoize the checkSingleDomain function to prevent recreating it on every render
  const checkSingleDomain = useCallback(async (domainToCheck: string) => {
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
  }, []);

  // Helper function to check multiple domains with delay
  const checkDomainsWithDelay = useCallback(
    (variations: DomainParts[], onComplete?: () => void) => {
      variations.forEach((variation, index) => {
        setTimeout(() => {
          checkSingleDomain(variation.domain).finally(() => {
            if (index === variations.length - 1 && onComplete) {
              onComplete();
            }
          });
        }, index * 100);
      });
    },
    [checkSingleDomain]
  );

  // Effect to check featured domains on initial load
  useEffect(() => {
    const featuredVariations = featuredDomains.map(parseFeaturedDomain);
    setDomainVariations(featuredVariations);

    const initialResults: DomainResults = {};
    featuredVariations.forEach(variation => {
      initialResults[variation.domain] = { loading: true };
    });
    setDomainResults(initialResults);

    checkDomainsWithDelay(featuredVariations);
  }, [checkDomainsWithDelay]);

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

  const handleDomainChange = useCallback((value: string) => {
    setDomain(value);
    setSanitizedDomain(sanitizeDomain(value));
  }, []);

  const retryDomainCheck = useCallback(
    async (domainToRetry: string) => {
      setDomainResults(prev => ({
        ...prev,
        [domainToRetry]: { loading: true },
      }));

      try {
        await checkSingleDomain(domainToRetry);
      } catch (err) {
        // Error already handled in checkSingleDomain
      }
    },
    [checkSingleDomain]
  );

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

    // Generate only main domain initially, combine with featured domains
    const mainDomainVariations = generateMainDomain(sanitizedDomain, domain);
    const featuredVariations = featuredDomains.map(parseFeaturedDomain);
    const allVariations = [...mainDomainVariations, ...featuredVariations];
    setDomainVariations(allVariations);

    // Initialize results for main domain only
    const initialResults: DomainResults = {};
    mainDomainVariations.forEach((variation: DomainParts) => {
      initialResults[variation.domain] = { loading: true };
    });
    setDomainResults(prev => ({ ...prev, ...initialResults }));

    try {
      checkDomainsWithDelay(mainDomainVariations, () => setLoading(false));
    } catch (err) {
      console.error('Error processing domain check:', err);
      setError('An error occurred while checking domains. Please try again later.');
      setLoading(false);
    } finally {
      // Backup loading state reset
      setTimeout(
        () => {
          if (loading) {
            console.log('Backup loading state reset triggered');
            setLoading(false);
          }
        },
        mainDomainVariations.length * 300 + 5000
      );
    }
  };

  const loadAlternativeExtensions = useCallback(async () => {
    if (!sanitizedDomain) return;

    const extensionVariations = generateAlternativeExtensions(sanitizedDomain, domain);

    // Check if these variations are already loaded
    const newVariations = extensionVariations.filter(
      variation => !domainVariations.some(existing => existing.domain === variation.domain)
    );

    if (newVariations.length === 0) {
      // All variations already exist, no need to query again
      return;
    }

    // Add only new domain variations
    setDomainVariations(prev => [...prev, ...newVariations]);

    // Initialize loading state for new domains only
    const initialResults: DomainResults = {};
    newVariations.forEach((variation: DomainParts) => {
      initialResults[variation.domain] = { loading: true };
    });
    setDomainResults(prev => ({ ...prev, ...initialResults }));

    // Check only the new domains
    checkDomainsWithDelay(newVariations);
  }, [sanitizedDomain, domain, domainVariations, checkDomainsWithDelay]);

  const loadAlternativeSuggestions = useCallback(async () => {
    if (!sanitizedDomain) return;

    const suggestionVariations = generateAlternativeSuggestions(sanitizedDomain, domain);

    // Check if these variations are already loaded
    const newVariations = suggestionVariations.filter(
      variation => !domainVariations.some(existing => existing.domain === variation.domain)
    );

    if (newVariations.length === 0) {
      // All variations already exist, no need to query again
      return;
    }

    // Add only new domain variations
    setDomainVariations(prev => [...prev, ...newVariations]);

    // Initialize loading state for new domains only
    const initialResults: DomainResults = {};
    newVariations.forEach((variation: DomainParts) => {
      initialResults[variation.domain] = { loading: true };
    });
    setDomainResults(prev => ({ ...prev, ...initialResults }));

    // Check only the new domains
    checkDomainsWithDelay(newVariations);
  }, [sanitizedDomain, domain, domainVariations, checkDomainsWithDelay]);

  return [
    { domain, sanitizedDomain, displayDomain, domainVariations, domainResults, loading, error },
    {
      setDomain: handleDomainChange,
      handleSubmit,
      retryDomainCheck,
      checkSingleDomain,
      loadAlternativeExtensions,
      loadAlternativeSuggestions,
    },
  ];
}
