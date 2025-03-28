import React from 'react';

interface NoResultPlaceholderProps {
  domain: string;
  sanitizedDomain: string;
}

const NoResultPlaceholder: React.FC<NoResultPlaceholderProps> = ({ domain, sanitizedDomain }) => {
  return (
    <div className="mb-8 w-full">
      <div className="relative flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2 opacity-70">
        <div className="flex flex-grow items-center">
          <div className="mr-2 w-8 flex-shrink-0">
            <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200" />
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
      <div className="mt-4 text-center text-sm text-gray-500">
        {domain
          ? "We'll also show you alternative domains and extensions"
          : "We'll help you find the perfect domain name and show alternatives"}
      </div>
    </div>
  );
};

export default NoResultPlaceholder;
