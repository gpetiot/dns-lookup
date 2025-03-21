// Prefixes for domain variations
export const prefixes = [
  'get', 'try', 'use', 'hey', 'join', 'go', 'the', 'my', 'app'
];

// Suffixes for domain variations
export const suffixes = [
  'app', 'hq', 'hub', 'studio', 'labs', 'way', 'me', 'tools', 
  'kit', 'tech', 'cloud', 'works', 'space', 'plus', 'pro', 'base'
];

/**
 * Generate domain variations based on a base name
 * @param {string} baseName - The base domain name
 * @returns {Array} Array of domain variations
 */
export const generateDomainVariations = (baseName) => {
  // Remove domain extension if present
  const nameOnly = baseName.split('.')[0];
  
  const variations = [
    // Original domain with .com
    `${nameOnly}.com`
  ];
  
  // Add prefix variations
  prefixes.forEach(prefix => {
    variations.push(`${prefix}${nameOnly}.com`);
  });
  
  // Add suffix variations
  suffixes.forEach(suffix => {
    variations.push(`${nameOnly}${suffix}.com`);
  });
  
  return variations;
};

/**
 * Sanitize domain input
 * @param {string} input - Raw domain input
 * @returns {string} Sanitized domain
 */
export const sanitizeDomain = (input) => {
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
      signal 
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
