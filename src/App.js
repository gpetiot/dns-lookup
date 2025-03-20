import React, { useState } from 'react';

function App() {
  const [domain, setDomain] = useState('');
  const [domainInfo, setDomainInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
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
    
    setLoading(true);
    setDomainInfo(null);
    setError(null);
    
    try {
      // Get API key from environment variables
      const apiKey = process.env.REACT_APP_API_KEY;
      
      if (!apiKey) {
        throw new Error('API key is missing. Please check your environment configuration.');
      }
      
      console.log('Fetching data for domain:', domain);
      
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
        `https://api.apilayer.com/whois/check?domain=${encodeURIComponent(domain)}`,
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
        setDomainInfo({ response: result });
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
    <div className="min-h-screen bg-blue-100 p-4 flex flex-col items-center justify-center">
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
        
        {domainInfo && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">Domain Information</h2>
            <div className="bg-gray-50 rounded-md border border-gray-200 p-4">
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-gray-700">
                {JSON.stringify(domainInfo, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 