import React from 'react';

interface NoResultPlaceholderProps {
  domain: string;
  sanitizedDomain: string;
}

const NoResultPlaceholder: React.FC<NoResultPlaceholderProps> = ({ domain, sanitizedDomain }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between py-2 px-3 border-b bg-gray-50 border-gray-200 relative opacity-70">
        <div className="flex items-center flex-grow">
          <div className="flex-shrink-0 w-8 mr-2">
            <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
          </div>
          <div className="text-md font-medium text-gray-400">
            {domain ? sanitizedDomain || 'example.com' : 'Type a domain name to check'}
          </div>
        </div>
        <div className="flex items-center">
          <div className="text-sm text-gray-400">
            {domain
              ? 'Click Check to see availability and suggestions →'
              : 'Start by entering your desired domain name above ↑'}
          </div>
        </div>
      </div>
      <div className="mt-4 text-center text-gray-500 text-sm">
        {domain
          ? "We'll also show you alternative domains and extensions"
          : "We'll help you find the perfect domain name and show alternatives"}
      </div>
    </div>
  );
};

export default NoResultPlaceholder;
