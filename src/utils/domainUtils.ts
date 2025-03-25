import { AIService, AIProvider, DEFAULT_PROVIDER } from '../services/AIService';

const aiService = new AIService(DEFAULT_PROVIDER);

// Common TLDs for domain variations
export const commonTlds = [
  '.com', // Most common, used as default
  '.net',
  '.org',
  '.io',
  '.co',
  '.app',
  '.dev',
  '.ai',
  '.me',
  '.info',
  '.pro',
  '.cc',
  '.tech',
  '.site',
  '.xyz',
  '.online',
  '.store',
  '.blog',
  '.cloud',
];

// Prefixes for domain variations
export const prefixes: string[] = ['get', 'try', 'use', 'hey', 'join', 'go', 'the', 'my'];

// Suffixes for domain variations
export const suffixes: string[] = [
  'app',
  'hq',
  'hub',
  'studio',
  'labs',
  'way',
  'me',
  'tools',
  'kit',
  'tech',
  'cloud',
  'works',
  'space',
  'plus',
  'pro',
  'base',
];

export interface DomainParts {
  prefix?: string;
  base: string;
  suffix?: string;
  ext: string;
  domain: string;
  input: string; // Original user input before sanitization
}

/**
 * Generate domain variations based on a base name
 * @param {string} baseName - The base domain name
 * @param {string} userInput - The original user input before sanitization
 * @returns {DomainParts[]} Array of domain variations
 */
export const generateDomainVariations = (baseName: string, userInput: string): DomainParts[] => {
  const variations: DomainParts[] = [];
  const nameOnly = baseName.split('.')[0];

  // Add all TLD variations
  commonTlds.forEach(tld => {
    variations.push({
      base: nameOnly,
      ext: tld.slice(1), // remove the dot
      domain: `${nameOnly}${tld}`,
      input: userInput,
    });
  });

  // Add prefixed variations with .com
  const sortedPrefixes = [...prefixes].sort();
  sortedPrefixes.forEach(prefix => {
    variations.push({
      prefix,
      base: nameOnly,
      ext: 'com',
      domain: `${prefix}${nameOnly}.com`,
      input: userInput,
    });
  });

  // Add suffixed variations with .com
  const sortedSuffixes = [...suffixes].sort();
  sortedSuffixes.forEach(suffix => {
    variations.push({
      base: nameOnly,
      suffix,
      ext: 'com',
      domain: `${nameOnly}${suffix}.com`,
      input: userInput,
    });
  });

  return variations;
};

/**
 * Sanitize domain input
 * @param {string} input - Raw domain input
 * @returns {string} Sanitized domain
 */
export const sanitizeDomain = input => {
  // Remove all spaces
  let sanitized = input.trim().replace(/\s+/g, '');

  // Convert to lowercase
  sanitized = sanitized.toLowerCase();

  // If there's no dot (extension), add .com
  if (!sanitized.includes('.')) {
    sanitized = `${sanitized}.com`;
  }

  // Remove any protocol prefixes (http://, https://, etc.)
  sanitized = sanitized.replace(/^(https?:\/\/)?(www\.)?/i, '');

  // Remove any trailing slashes or paths
  sanitized = sanitized.split('/')[0];

  return sanitized;
};

/**
 * Fetch with timeout functionality
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise} Fetch promise with timeout
 */
export const fetchWithTimeout = async (url, options, timeout = 10000) => {
  const controller = new AbortController();
  const { signal } = controller;

  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  }
};

/**
 * Fetches a preview of a domain by getting the title and description
 * @param {string} domain - The domain to fetch preview for
 * @returns {Promise<{title: string, description: string, success: boolean}>}
 */
export const fetchDomainPreview = async domain => {
  try {
    // Use a shorter timeout for preview requests to avoid blocking the UI
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    // Use a CORS proxy to avoid cross-origin issues
    const corsProxyUrl = 'https://api.allorigins.win/raw?url=';
    const url = `${corsProxyUrl}https://${domain}`;

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'text/html',
      },
    });

    // Clear the timeout as we've gotten a response
    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        title: domain,
        description: `Could not load website (Status: ${response.status})`,
        success: false,
      };
    }

    const html = await response.text();

    // Extract title
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : domain;

    // Extract description from meta tag or first paragraph
    let description = '';
    const metaDescMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["']/i
    );

    if (metaDescMatch) {
      description = metaDescMatch[1].trim();
    } else {
      // Try to find the first paragraph with actual content
      const paragraphs = html.match(/<p[^>]*>(.*?)<\/p>/gi);
      if (paragraphs && paragraphs.length > 0) {
        // Find first paragraph with decent length
        for (const p of paragraphs) {
          // Strip HTML tags and get plain text
          const text = p.replace(/<[^>]*>/g, '').trim();
          if (text.length > 20) {
            // Only use paragraphs with sufficient content
            description = text;
            break;
          }
        }
      }
    }

    // Extract meta refresh information
    let metaRefresh = null;
    const metaRefreshMatch = html
      .toLowerCase()
      .match(/<meta[^>]*http-equiv=["']refresh["'][^>]*content=["']([^"']+)["']/i);
    if (metaRefreshMatch) {
      const content = metaRefreshMatch[1].toLowerCase();
      const urlMatch = content.match(/url=(.+)$/i);
      if (urlMatch) {
        metaRefresh = {
          url: urlMatch[1],
        };
      }
    }

    // Fallback if we couldn't extract a description
    if (!description) {
      description = `Visit ${domain} to learn more`;
    }

    // Limit description length
    if (description.length > 200) {
      description = description.substring(0, 197) + '...';
    }

    return {
      title,
      description,
      metaRefresh,
      success: true,
    };
  } catch (error) {
    // Handle timeout errors specifically
    if (error.name === 'AbortError') {
      return {
        title: domain,
        description: 'Preview request timed out. The site may be slow to respond.',
        success: false,
      };
    }

    // Handle other errors
    return {
      title: domain,
      description: `Could not load preview: ${error.message || 'Unknown error'}`,
      success: false,
    };
  }
};

const inferDomainUsageAI = async (preview: {
  title: string;
  description: string;
  metaRefresh?: { url: string | null } | null;
}): Promise<boolean | null> => {
  try {
    const prompt = `Based on the following website information, determine if this domain is actively used or parked/for sale. 
    Title: "${preview.title}"
    Description: "${preview.description}"
    ${preview.metaRefresh?.url ? `Meta Refresh: redirects to ${preview.metaRefresh.url}` : ''}
    
    Respond with only "true" if the domain appears to be actively used, or "false" if it appears to be parked (eg. godaddy, namecheap, afternic, etc) or for sale.`;

    const response = await aiService.generateContent(prompt);
    const result = response.toLowerCase().trim();

    if (result === 'true') return true;
    if (result === 'false') return false;
    return null; // If AI response is unclear, fall back to heuristics
  } catch (error) {
    console.error('Error in AI-based domain usage inference:', error);
    return null; // Fall back to heuristics on error
  }
};

const inferDomainUsageHeuristics = (preview: {
  title: string;
  description: string;
  metaRefresh?: { url: string | null } | null;
}): boolean => {
  // If there's a meta refresh, check if it points to a known reseller
  if (preview.metaRefresh?.url) {
    const redirectUrl = preview.metaRefresh.url.toLowerCase();
    const resellerDomains = [
      'sedo.com',
      'afternic.com',
      'godaddy.com',
      'dan.com',
      'hugedomains.com',
    ];

    // Check if the redirect URL contains any of the reseller domains
    if (resellerDomains.some(domain => redirectUrl.includes(domain))) {
      return false;
    }

    // Check for common landing page paths
    if (redirectUrl.endsWith('/lander') || redirectUrl.endsWith('/listing')) {
      return false;
    }
  }

  // Common keywords for parked or for-sale domains
  const forSaleKeywords = [
    'domain for sale',
    'buy this domain',
    'domain is for sale',
    'purchase this domain',
    'acquire this domain',
    'domain parking',
    'parked domain',
    'domain marketplace',
    'this domain may be for sale',
    'inquire about this domain',
    'sedo',
    'hugedomains',
    'uniregistry',
    'afternic',
    'domains for sale',
    'premium domain',
    'this web page is parked',
    'the domain',
    'domainmarket',
    'domainholder',
    'dan.com',
  ];

  // Check title and description for for-sale indicators
  const contentToCheck = (preview.title + ' ' + preview.description).toLowerCase();

  for (const keyword of forSaleKeywords) {
    if (contentToCheck.includes(keyword.toLowerCase())) {
      return false;
    }
  }

  // Check for common domain parking services in title
  if (
    preview.title.includes('Domain for sale') ||
    preview.title.includes('Parking') ||
    (preview.title.includes('GoDaddy') && preview.description.includes('hosting')) ||
    preview.title.includes('This domain is for sale')
  ) {
    return false;
  }

  return true;
};

export const inferDomainUsage = async (preview: {
  success: boolean;
  title: string;
  description: string;
}): Promise<boolean> => {
  // If the preview request failed, mark as unused
  if (!preview.success) {
    return false;
  }

  // Try AI-based inference first
  const aiResult = await inferDomainUsageAI(preview);
  if (aiResult !== null) {
    return aiResult;
  }

  // Fall back to heuristics if AI inference failed or was unclear
  return inferDomainUsageHeuristics(preview);
};
