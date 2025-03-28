import React from 'react';
import { DomainParts } from '@/utils/domainUtils';
import ExternalLinkIcon from './icons/ExternalLinkIcon';
import LoadingIcon from './icons/LoadingIcon';
import ErrorIcon from './icons/ErrorIcon';
import AvailableIcon from './icons/AvailableIcon';
import RegisteredIcon from './icons/RegisteredIcon';
import RetryIcon from './icons/RetryIcon';
import LogoPreview from './LogoPreview';
import type { WhoIsResult } from 'whois-parsed';

interface DomainResultProps {
  parts: DomainParts;
  data?: WhoIsResult;
  loading: boolean;
  onRetry: () => void;
}

const DomainResult: React.FC<DomainResultProps> = ({ parts, data, loading, onRetry }) => {
  const hasError = false;
  const isAvailable = data?.isAvailable;

  // Apply neutral styling for loading state, otherwise use status-based colors
  const bgColorClass = loading
    ? 'bg-gray-50 border-gray-200'
    : isAvailable
      ? 'bg-green-100'
      : hasError
        ? 'bg-gray-100'
        : 'bg-red-50/50';

  return (
    <div
      className={`flex items-center justify-between border-b px-3 py-2 ${bgColorClass} relative`}
    >
      {/* Left Column: Status Icon + Domain */}
      <div className="flex flex-grow items-center">
        <div className="mr-2 w-8 flex-shrink-0">
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
            <span className="text-gray-500">{parts.domain}</span>
          ) : hasError ? (
            <span className="text-gray-600">{parts.domain}</span>
          ) : isAvailable ? (
            <LogoPreview parts={parts} />
          ) : (
            <a
              href={`https://${parts.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-red-600 hover:underline"
            >
              {parts.domain}
              <ExternalLinkIcon className="ml-1 inline-block h-3 w-3 flex-shrink-0" />
            </a>
          )}
        </div>
      </div>

      {/* Right Column: Error or Broker Link */}
      <div className="flex items-center justify-end">
        {loading && <div className="text-xs text-gray-500">Checking...</div>}

        {hasError && data?.status && (
          <div className="flex items-center">
            <div className="mr-2 max-w-xs truncate text-xs text-gray-600">{data.status}</div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="rounded bg-blue-500 px-2 py-1 text-xs font-medium text-white transition duration-200 hover:bg-blue-600"
              >
                <RetryIcon />
                Retry
              </button>
            )}
          </div>
        )}

        {isAvailable && (
          <a
            href={`https://porkbun.com/checkout/search?q=${parts.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 transition-colors duration-200 hover:border-indigo-300 hover:bg-indigo-100"
          >
            Porkbun
            <ExternalLinkIcon className="ml-1.5 h-3 w-3 text-indigo-500" />
          </a>
        )}
      </div>
    </div>
  );
};

export default DomainResult;
