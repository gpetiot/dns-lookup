import { useState } from 'react'
import './App.css'

function App() {
  const [domain, setDomain] = useState('')
  const [domainInfo, setDomainInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!domain) {
      setError('Please enter a domain')
      return
    }
    
    setLoading(true)
    setDomainInfo(null)
    setError(null)
    
    try {
      const apiKey = import.meta.env.VITE_API_KEY
      
      const response = await fetch(`https://api.apilayer.com/whois/query?domain=${domain}`, {
        method: 'GET',
        headers: {
          'apikey': apiKey
        }
      })
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const data = await response.json()
      setDomainInfo(data)
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Domain Information Checker</h1>
        </div>
        
        <div className="px-6 py-4">
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-4">
              <label htmlFor="domain" className="block text-gray-700 text-sm font-bold mb-2">
                Enter Domain Name
              </label>
              <input
                type="text"
                id="domain"
                placeholder="example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              {loading ? 'Loading...' : 'Check Domain'}
            </button>
          </form>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {domainInfo && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Domain Information</h2>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {JSON.stringify(domainInfo, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
