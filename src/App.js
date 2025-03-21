import React, { useState } from 'react';

// Domain Result component to display availability status
const DomainResult = ({ domain, data }) => {
  const isAvailable = data?.result === 'available';
  
  return (
    <div className={`mb-4 p-4 rounded-md ${isAvailable ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {isAvailable ? (
            <span className="flex items-center text-green-600 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Available
            </span>
          ) : (
            <span className="flex items-center text-gray-600 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              Registered
            </span>
          )}
        </div>
        <div className="text-lg font-bold">
          {isAvailable ? (
            <span className="text-green-600">{domain}</span>
          ) : (
            <a 
              href={`https://${domain}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center"
            >
              {domain}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </a>
          )}
        </div>
      </div>
      {!isAvailable && data?.expiry && (
        <div className="mt-2 text-sm text-gray-500">
          Expires: {new Date(data.expiry).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

function App() {
  const [domain, setDomain] = useState('');
  const [processedDomain, setProcessedDomain] = useState('');
  const [domainInfo, setDomainInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Function to sanitize domain input
  const sanitizeDomain = (input) => {
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
  
  // Function to fetch with timeout
  const fetchWithTimeout = async (url, options, timeout = 10000) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!domain) {
      setError('Please enter a domain');
      return;
    }
    
    // Process and sanitize the domain input
    const sanitized = sanitizeDomain(domain);
    setProcessedDomain(sanitized);
    
    if (sanitized !== domain) {
      console.log(`Domain sanitized from "${domain}" to "${sanitized}"`);
    }
    
    setLoading(true);
    setDomainInfo(null);
    setError(null);
    
    try {
      // Get API key from environment variables
      const apiKey = process.env.REACT_APP_API_KEY;
      
      if (!apiKey) {
        throw new Error('API key is missing. Please check your environment configuration.');
      }
      
      console.log('Fetching data for domain:', sanitized);
      
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
        `https://api.apilayer.com/whois/check?domain=${encodeURIComponent(sanitized)}`,
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
          throw new Error('No data returned for this domain.');
        }
        
        console.log('Data received successfully');
        setDomainInfo(data);
      } catch (jsonError) {
        // If it's not valid JSON, just display the text
        console.log('Received non-JSON response');
        const data = { response: result };
        setDomainInfo(data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      
      // Create user-friendly error messages
      let errorMessage;
      if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (err.message.includes('timed out')) {
        errorMessage = 'The request timed out. The server might be busy, please try again later.';
      } else {
        errorMessage = err.message || 'An unexpected error occurred.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 p-4 flex flex-col items-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Domain Checker</h1>
        
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-4">
            <label htmlFor="domain" className="block text-gray-700 font-semibold mb-2">
              Enter Domain Name
            </label>
            <input
              type="text"
              id="domain"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Spaces will be removed. If no extension is provided, ".com" will be added.
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300"
          >
            {loading ? 'Loading...' : 'Check Domain'}
          </button>
        </form>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p className="font-medium">{error}</p>
          </div>
        )}
        
        {domainInfo && processedDomain && (
          <div className="mt-6">
            <DomainResult 
              domain={processedDomain}
              data={domainInfo}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 