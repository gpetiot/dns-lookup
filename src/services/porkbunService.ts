import porkbunPricing from '../assets/porkbun-pricing.json';

// Cache for storing pricing by TLD
const priceCache = {
  registration: {},
  renewal: {},
};

/**
 * Get registration price for a specific TLD from PorkBun
 * @param {string} ext - Extension to check (e.g., "com")
 * @returns {string|null} - Registration price or null if extension not found
 */
export const getPricing = (ext: string) => {
  try {
    if (!ext) return null;

    // Check if this extension is already in the cache
    if (priceCache.registration[ext] !== undefined) {
      return priceCache.registration[ext];
    }

    // If not in cache, look up the price
    if (
      porkbunPricing.status === 'SUCCESS' &&
      porkbunPricing.pricing &&
      porkbunPricing.pricing[ext]
    ) {
      // Store in cache
      priceCache.registration[ext] = porkbunPricing.pricing[ext].registration;
      return priceCache.registration[ext];
    }

    // Store null in cache for extensions without pricing
    priceCache.registration[ext] = null;
    return null;
  } catch (error) {
    console.error('Error getting PorkBun pricing:', error);
    return null;
  }
};

/**
 * Get renewal price for a specific TLD from PorkBun
 * @param {string} ext - Extension to check (e.g., "com")
 * @returns {string|null} - Renewal price or null if extension not found
 */
export const getRenewalPrice = (ext: string) => {
  try {
    if (!ext) return null;

    // Check if this extension is already in the cache
    if (priceCache.renewal[ext] !== undefined) {
      return priceCache.renewal[ext];
    }

    // Check if pricing exists for this extension
    if (
      porkbunPricing.status === 'SUCCESS' &&
      porkbunPricing.pricing &&
      porkbunPricing.pricing[ext]
    ) {
      // Store in cache
      priceCache.renewal[ext] = porkbunPricing.pricing[ext].renewal;
      return priceCache.renewal[ext];
    }

    // Store null in cache for extensions without pricing
    priceCache.renewal[ext] = null;
    return null;
  } catch (error) {
    console.error('Error getting PorkBun pricing:', error);
    return null;
  }
};
