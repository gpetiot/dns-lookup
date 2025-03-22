import React, { useEffect, useState } from 'react';
import { getPricing, getRenewalPrice } from '../services/porkbunService';
import ExternalLinkIcon from './icons/ExternalLinkIcon';
import LoadingIcon from './icons/LoadingIcon';
import ErrorIcon from './icons/ErrorIcon';
import AvailableIcon from './icons/AvailableIcon';
import RegisteredIcon from './icons/RegisteredIcon';
import RetryIcon from './icons/RetryIcon';

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
            <LoadingIcon />
          ) : hasError ? (
            <ErrorIcon />
          ) : isAvailable ? (
            <AvailableIcon />
          ) : (
            <RegisteredIcon />
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
                <RetryIcon />
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
