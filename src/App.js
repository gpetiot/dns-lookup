import React, { useState } from 'react';

function App() {
  const [domain, setDomain] = useState('');
  const [domainInfo, setDomainInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      const apiKey = process.env.WHOIS_API_KEY;
      
      const response = await fetch(`https://api.apilayer.com/whois/query?domain=${domain}`, {
        method: 'GET',
        headers: {
          'apikey': apiKey
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      setDomainInfo(data);
    } catch (err) {
      setError(err.message || 'An error occurred');
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