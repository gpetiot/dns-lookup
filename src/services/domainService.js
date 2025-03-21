import { fetchWithTimeout } from '../utils/domainUtils';

/**
 * Check a single domain availability
 * @param {string} domainToCheck - Domain to check
 * @returns {Object} Object containing domain and data
 */
export const checkDomain = async (domainToCheck) => {
  try {
    // Get API key from environment variables
    const apiKey = process.env.REACT_APP_WHOIS_API_KEY;
    
    if (!apiKey) {
      throw new Error('API key is missing. Please check your environment configuration.');
    }
    
    console.log('Fetching data for domain:', domainToCheck);
    
    // Create headers as specified
    const myHeaders = new Headers();
    myHeaders.append("apikey", apiKey);
    
    // Create request options as specified
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders
    };
    
    // Use the new endpoint with the check parameter
    const response = await fetchWithTimeout(
      `https://api.apilayer.com/whois/check?domain=${encodeURIComponent(domainToCheck)}`,
      requestOptions,
      15000 // 15 seconds timeout
    );
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (response.status === 401 || response.status === 403) {
        throw new Error('API key invalid or unauthorized access.');
      } else if (response.status === 404) {
        throw new Error('Domain information not found.');
      } else {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
    }
    
    // Use text() instead of json() as per the provided code
    const result = await response.text();
    
    // Parse the text if it's JSON
    try {
      const data = JSON.parse(result);
      if (!data || Object.keys(data).length === 0) {
        return { domain: domainToCheck, data: { error: 'No data returned' } };
      }
      
      return { domain: domainToCheck, data };
    } catch (jsonError) {
      // If it's not valid JSON, just return the text
      return { domain: domainToCheck, data: { response: result } };
    }
  } catch (err) {
    console.error(`Error checking ${domainToCheck}:`, err);
    return { domain: domainToCheck, data: { error: err.message } };
  }
};
