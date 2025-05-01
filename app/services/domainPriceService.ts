import type { DomainPrice } from '@/types/domain';

/**
 * Fetch domain pricing information from the API
 * @param {string} domain - Domain to check pricing for
 * @returns {Promise<DomainPrice>} Object containing pricing information
 */
export const getDomainPrice = async (domain: string): Promise<DomainPrice> => {
  try {
    const response = await fetch(
      `/api/check-price?domain=${encodeURIComponent(domain)}&available=true`
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details available');
      throw new Error(`API error: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (err: any) {
    return {
      registration: 0,
      renewal: 0,
      transfer: 0,
      isPremium: false,
      currency: 'USD',
    };
  }
};
