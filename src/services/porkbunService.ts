import porkbunPricing from '../assets/porkbun-pricing.json';

// Cache for storing pricing by TLD
const priceCache = {
  registration: {},
  renewal: {},
};

/**
 * Get registration price for a specific TLD from PorkBun
 * @param {string} domain - Domain name to check (e.g., "example.com")
 * @returns {string|null} - Registration price or null if TLD not found
 */
export const getPricing = domain => {
  try {
    if (!domain) return null;

    // Extract the TLD from the domain
    const tld = domain.split('.').slice(1).join('.');

    // Check if this TLD is already in the cache
    if (priceCache.registration[tld] !== undefined) {
      return priceCache.registration[tld];
    }

    // If not in cache, look up the price
    if (
      porkbunPricing.status === 'SUCCESS' &&
      porkbunPricing.pricing &&
      porkbunPricing.pricing[tld]
    ) {
      // Store in cache
      priceCache.registration[tld] = porkbunPricing.pricing[tld].registration;
      return priceCache.registration[tld];
    }

    // Store null in cache for TLDs without pricing
    priceCache.registration[tld] = null;
    return null;
  } catch (error) {
    console.error('Error getting PorkBun pricing:', error);
    return null;
  }
};

/**
 * Get renewal price for a specific TLD from PorkBun
 * @param {string} domain - Domain name to check (e.g., "example.com")
 * @returns {string|null} - Renewal price or null if TLD not found
 */
export const getRenewalPrice = domain => {
  try {
    if (!domain) return null;

    // Extract the TLD from the domain
    const tld = domain.split('.').slice(1).join('.');

    // Check if this TLD is already in the cache
    if (priceCache.renewal[tld] !== undefined) {
      return priceCache.renewal[tld];
    }

    // Check if pricing exists for this TLD
    if (
      porkbunPricing.status === 'SUCCESS' &&
      porkbunPricing.pricing &&
      porkbunPricing.pricing[tld]
    ) {
      // Store in cache
      priceCache.renewal[tld] = porkbunPricing.pricing[tld].renewal;
      return priceCache.renewal[tld];
    }

    // Store null in cache for TLDs without pricing
    priceCache.renewal[tld] = null;
    return null;
  } catch (error) {
    console.error('Error getting PorkBun pricing:', error);
    return null;
  }
};
