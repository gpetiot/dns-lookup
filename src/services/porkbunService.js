import porkbunPricing from '../../porkbun-pricing.json';

/**
 * Get registration price for a specific TLD from PorkBun
 * @param {string} domain - Domain name to check (e.g., "example.com")
 * @returns {string|null} - Registration price or null if TLD not found
 */
export const getPricing = (domain) => {
  try {
    if (!domain) return null;
    
    // Extract the TLD from the domain
    const tld = domain.split('.').slice(1).join('.');
    
    // Check if pricing exists for this TLD
    if (porkbunPricing.status === 'SUCCESS' && 
        porkbunPricing.pricing && 
        porkbunPricing.pricing[tld]) {
      return porkbunPricing.pricing[tld].registration;
    }
    
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
export const getRenewalPrice = (domain) => {
  try {
    if (!domain) return null;
    
    // Extract the TLD from the domain
    const tld = domain.split('.').slice(1).join('.');
    
    // Check if pricing exists for this TLD
    if (porkbunPricing.status === 'SUCCESS' && 
        porkbunPricing.pricing && 
        porkbunPricing.pricing[tld]) {
      return porkbunPricing.pricing[tld].renewal;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting PorkBun pricing:', error);
    return null;
  }
}; 