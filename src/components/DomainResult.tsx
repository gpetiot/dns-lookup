import React, { useEffect, useState, useRef } from 'react';
import { fetchDomainPreview, inferDomainUsage, DomainParts } from '../utils/domainUtils';
import ExternalLinkIcon from './icons/ExternalLinkIcon';
import LoadingIcon from './icons/LoadingIcon';
import ErrorIcon from './icons/ErrorIcon';
import AvailableIcon from './icons/AvailableIcon';
import RegisteredIcon from './icons/RegisteredIcon';
import RetryIcon from './icons/RetryIcon';
import LogoPreview from './LogoPreview';

interface DomainResultProps {
  parts: DomainParts;
  data: any;
  loading: boolean;
  onRetry: () => void;
  preloadedPreview: any;
}

const DomainResult: React.FC<DomainResultProps> = ({
  parts,
  data,
  loading,
  onRetry,
  preloadedPreview,
}) => {
  const [preview, setPreview] = useState<any>(preloadedPreview || null);
  const [isReallyUsed, setIsReallyUsed] = useState<boolean | null>(null);
  const hasStartedLoadingRef = useRef(Boolean(preloadedPreview));

  const isAvailable = data?.result === 'available';
  const hasError = data?.error || false;

  // Update if preloaded preview changes (from parent component)
  useEffect(() => {
    if (preloadedPreview) {
      setPreview(preloadedPreview);
      hasStartedLoadingRef.current = true;
    }
  }, [preloadedPreview]);

  // Load the preview data for domain usage inference
  useEffect(() => {
    const loadPreview = async () => {
      // Only load preview for registered domains that aren't already loaded
      if (!isAvailable && !hasError && !loading && !preview && !hasStartedLoadingRef.current) {
        hasStartedLoadingRef.current = true;

        try {
          const domainPreview = await fetchDomainPreview(parts.domain);
          setPreview(domainPreview);
          inferDomainUsage(domainPreview).then(setIsReallyUsed);
        } catch (error) {
          console.error('Failed to load preview:', error);
        }
      }
    };

    loadPreview();
  }, [isAvailable, hasError, loading, preview, parts.domain]);

  // Apply neutral styling for loading state, otherwise use status-based colors
  const bgColorClass = loading
    ? 'bg-gray-50 border-gray-200'
    : hasError
      ? 'bg-gray-100'
      : isAvailable
        ? 'bg-green-100'
        : isReallyUsed === false
          ? 'bg-yellow-50/50'
          : 'bg-red-50/50';

  return (
    <div
      className={`flex items-center justify-between py-2 px-3 border-b ${bgColorClass} relative`}
    >
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
              className="text-red-600 hover:underline flex items-center"
            >
              {parts.domain}
              <ExternalLinkIcon className="h-3 w-3 ml-1 inline-block flex-shrink-0" />
            </a>
          )}
        </div>
      </div>

      {/* Right Column: Error/Expiry or Broker Link */}
      <div className="flex items-center justify-end">
        {loading && <div className="text-xs text-gray-500">Checking...</div>}

        {hasError && data?.error && (
          <div className="flex items-center">
            <div className="text-xs text-gray-600 max-w-xs truncate mr-2">{data.error}</div>
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

        {!loading && !hasError && !isAvailable && (
          <div className="flex items-center space-x-2">
            {isReallyUsed === false && (
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full whitespace-nowrap">
                Probably unused
              </span>
            )}
            {data?.expiry && (
              <div className="text-xs text-gray-500 whitespace-nowrap">
                Exp: {new Date(data.expiry).toLocaleDateString()}
              </div>
            )}
          </div>
        )}

        {isAvailable && (
          <a
            href={`https://porkbun.com/checkout/search?q=${parts.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-full hover:bg-indigo-100 hover:border-indigo-300 transition-colors duration-200"
          >
            Porkbun
            <ExternalLinkIcon className="h-3 w-3 ml-1.5 text-indigo-500" />
          </a>
        )}
      </div>
    </div>
  );
};

export default DomainResult;
