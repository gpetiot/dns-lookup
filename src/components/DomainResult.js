import React, { useEffect, useState } from 'react';
import { getPricing, getRenewalPrice } from '../services/porkbunService';
import ExternalLinkIcon from './icons/ExternalLinkIcon';

const DomainResult = ({ domain, data, loading, onRetry }) => {
  const [price, setPrice] = useState(null);
  const [renewalPrice, setRenewalPrice] = useState(null);

  useEffect(() => {
    // Get pricing when domain or data changes
    if (domain) {
      const domainPrice = getPricing(domain);
      const domainRenewalPrice = getRenewalPrice(domain);
      setPrice(domainPrice);
      setRenewalPrice(domainRenewalPrice);
    }
  }, [domain, data]);

  const isAvailable = data?.result === 'available';
  const hasError = data?.error || false;
  
  // Apply neutral styling for loading state, otherwise use status-based colors
  const bgColorClass = loading 
    ? 'bg-gray-50 border-gray-200'
    : hasError 
      ? 'bg-gray-100' 
      : isAvailable 
        ? 'bg-green-50' 
        : 'bg-red-50';
  
  return (
    <div className={`flex items-center justify-between py-2 px-3 border-b ${bgColorClass}`}>
      {/* Left Column: Status Icon + Domain */}
      <div className="flex items-center flex-grow">
        <div className="flex-shrink-0 w-8 mr-2">
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : hasError ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : isAvailable ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        
        <div className="text-md font-medium">
          {loading ? (
            <span className="text-gray-500">{domain}</span>
          ) : hasError ? (
            <span className="text-gray-600">{domain}</span>
          ) : isAvailable ? (
            <span className="text-green-600">{domain}</span>
          ) : (
            <a 
              href={`https://${domain}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-red-600 hover:underline flex items-center"
            >
              {domain}
              <ExternalLinkIcon className="h-3 w-3 ml-1 inline-block flex-shrink-0" />
            </a>
          )}
        </div>
      </div>
      
      {/* Right Column: Error/Expiry or Pricing */}
      <div className="flex items-center justify-end">
        {loading && (
          <div className="text-xs text-gray-500">
            Checking...
          </div>
        )}
      
        {hasError && data?.error && (
          <div className="flex items-center">
            <div className="text-xs text-gray-600 max-w-xs truncate mr-2">
              {data.error}
            </div>
            {onRetry && (
              <button 
                onClick={onRetry}
                className="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white font-medium rounded transition duration-200"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-3 w-3 inline-block mr-1" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Retry
              </button>
            )}
          </div>
        )}
        
        {!loading && !hasError && !isAvailable && data?.expiry && (
          <div className="text-xs text-gray-500">
            Exp: {new Date(data.expiry).toLocaleDateString()}
          </div>
        )}
        
        {isAvailable && price && (
          <a 
            href={`https://porkbun.com/checkout/search?q=${domain}`} 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-xs hover:underline"
          >
            <span className="font-semibold text-gray-700">Porkbun:</span>
            <span className="text-blue-600 ml-1">
              ${price}
            </span>
            {renewalPrice && (
              <>
                <span className="text-gray-500 mx-1">/</span>
                <span className="text-purple-600">
                  ${renewalPrice}
                </span>
              </>
            )}
            <ExternalLinkIcon className="h-3 w-3 text-gray-500 ml-1" />
          </a>
        )}
      </div>
    </div>
  );
};

export default DomainResult;
