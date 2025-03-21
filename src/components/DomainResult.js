import React from 'react';

const DomainResult = ({ domain, data, loading }) => {
  if (loading) {
    return (
      <div className="p-3 rounded-md bg-gray-50 border border-gray-200 h-full flex items-center">
        <div className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="flex items-center text-gray-400 font-medium">
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Checking...
              </span>
            </div>
            <div className="text-md font-bold text-gray-500 truncate">
              {domain}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isAvailable = data?.result === 'available';
  const hasError = data?.error || false;
  
  return (
    <div className={`p-3 rounded-md h-full ${
      hasError 
        ? 'bg-gray-50 border border-gray-200' 
        : isAvailable 
          ? 'bg-green-50 border border-green-200' 
          : 'bg-red-50 border border-red-200'
    }`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          {hasError ? (
            <span className="flex items-center text-gray-600 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Error
            </span>
          ) : isAvailable ? (
            <span className="flex items-center text-green-600 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Available
            </span>
          ) : (
            <span className="flex items-center text-red-600 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              Registered
            </span>
          )}
        </div>
      </div>
      <div className="text-md font-bold break-words">
        {hasError ? (
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 inline-block flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
          </a>
        )}
      </div>
      {hasError && (
        <div className="mt-2 text-xs text-gray-600">
          {data.error}
        </div>
      )}
      {!isAvailable && !hasError && data?.expiry && (
        <div className="mt-2 text-xs text-gray-500">
          Expires: {new Date(data.expiry).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default DomainResult;
