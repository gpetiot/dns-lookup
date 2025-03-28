import type { WhoIsResult } from 'whois-parsed';

interface ApiResponse {
  domain: string;
  data: WhoIsResult;
}

/**
 * Check if a domain is registered using whois-parsed via API
 * @param {string} domainToCheck - Domain to check
 * @returns {Object} Object containing domain data
 */
export const checkDomain = async (domainToCheck: string): Promise<ApiResponse> => {
  try {
    console.log('Checking domain via API:', domainToCheck);

    const response = await fetch(`/api/check-domain?domain=${encodeURIComponent(domainToCheck)}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const result = (await response.json()) as ApiResponse;
    return result;
  } catch (err: any) {
    console.error(`Error checking ${domainToCheck}:`, err);
    return {
      domain: domainToCheck,
      data: {
        domainName: domainToCheck,
        isAvailable: false,
        status: err.message,
      },
    };
  }
};
