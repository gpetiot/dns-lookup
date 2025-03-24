// Prefixes for domain variations
export const prefixes = ['get', 'try', 'use', 'hey', 'join', 'go', 'the', 'my', 'app'];

// Suffixes for domain variations
export const suffixes = [
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

/**
 * Generate domain variations based on a base name
 * @param {string} baseName - The base domain name
 * @returns {Array} Array of domain variations
 */
export const generateDomainVariations = baseName => {
  // Remove domain extension if present
  const nameOnly = baseName.split('.')[0];

  const variations = [];

  // First: the original domain with .com (always first)
  variations.push(`${nameOnly}.com`);

  // Second: Common TLDs for the base name
  const commonTlds = ['.net', '.org', '.io', '.co', '.app'];
  commonTlds.forEach(tld => {
    variations.push(`${nameOnly}${tld}`);
  });

  // Third: Prefixed variations (alphabetically)
  const sortedPrefixes = [...prefixes].sort();
  sortedPrefixes.forEach(prefix => {
    variations.push(`${prefix}${nameOnly}.com`);
  });

  // Fourth: Suffixed variations (alphabetically)
  const sortedSuffixes = [...suffixes].sort();
  sortedSuffixes.forEach(suffix => {
    variations.push(`${nameOnly}${suffix}.com`);
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

/**
 * Analyzes domain preview content to determine if a domain is genuinely in use
 * @param {Object} preview - The preview object returned by fetchDomainPreview
 * @returns {boolean} false if domain appears unused, true otherwise
 */
export const inferDomainUsage = preview => {
  // If the preview request failed, mark as unused
  if (!preview.success) {
    return false;
  }

  const { title, description } = preview;

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
  const contentToCheck = (title + ' ' + description).toLowerCase();

  for (const keyword of forSaleKeywords) {
    if (contentToCheck.includes(keyword.toLowerCase())) {
      return false;
    }
  }

  // Check for common domain parking services in title
  if (
    title.includes('Domain for sale') ||
    title.includes('Parking') ||
    (title.includes('GoDaddy') && description.includes('hosting')) ||
    title.includes('This domain is for sale')
  ) {
    return false;
  }

  return true;
};
