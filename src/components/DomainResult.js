import React, { useEffect, useState, useRef } from 'react';
import { getPricing, getRenewalPrice } from '../services/porkbunService';
import { fetchDomainPreview, inferDomainUsage } from '../utils/domainUtils';
import ExternalLinkIcon from './icons/ExternalLinkIcon';
import LoadingIcon from './icons/LoadingIcon';
import ErrorIcon from './icons/ErrorIcon';
import AvailableIcon from './icons/AvailableIcon';
import RegisteredIcon from './icons/RegisteredIcon';
import RetryIcon from './icons/RetryIcon';

const DomainResult = ({ domain, data, loading, onRetry, preloadedPreview }) => {
  const [price, setPrice] = useState(null);
  const [renewalPrice, setRenewalPrice] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [preview, setPreview] = useState(preloadedPreview || null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [isReallyUsed, setIsReallyUsed] = useState(null);
  const previewTimerRef = useRef(null);
  const hasStartedLoadingRef = useRef(Boolean(preloadedPreview));

  useEffect(() => {
    // Get pricing when domain or data changes
    if (domain) {
      const domainPrice = getPricing(domain);
      const domainRenewalPrice = getRenewalPrice(domain);
      setPrice(domainPrice);
      setRenewalPrice(domainRenewalPrice);
    }
  }, [domain, data]);

  // Update if preloaded preview changes (from parent component)
  useEffect(() => {
    if (preloadedPreview) {
      setPreview(preloadedPreview);
      hasStartedLoadingRef.current = true;
    }
  }, [preloadedPreview]);

  // Clean up any pending timeouts when the component unmounts
  useEffect(() => {
    return () => {
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
      }
    };
  }, []);

  // Update usage status when preview data changes
  useEffect(() => {
    if (preview) {
      setIsReallyUsed(inferDomainUsage(preview));
    }
  }, [preview]);

  const isAvailable = data?.result === 'available';
  const hasError = data?.error || false;

  // Apply neutral styling for loading state, otherwise use status-based colors
  const bgColorClass = loading
    ? 'bg-gray-50 border-gray-200'
    : hasError
      ? 'bg-gray-100'
      : isAvailable
        ? 'bg-green-50'
        : isReallyUsed === false
          ? 'bg-yellow-50'
          : 'bg-red-50';

  // Start loading the preview data, but with a slight delay
  const startPreviewLoad = () => {
    // If we already have a preloaded preview, use it
    if (preloadedPreview && !preview) {
      setPreview(preloadedPreview);
      hasStartedLoadingRef.current = true;
      return;
    }

    // Only load preview for registered domains that aren't already loading
    // and haven't been loaded or started loading yet
    if (
      !isAvailable &&
      !hasError &&
      !loading &&
      !preview &&
      !loadingPreview &&
      !hasStartedLoadingRef.current
    ) {
      // Mark that we've initiated loading
      hasStartedLoadingRef.current = true;

      // Set a delay before starting to load to avoid unnecessary requests
      // for quick hover-overs
      previewTimerRef.current = setTimeout(() => {
        setLoadingPreview(true);

        // Use a separate async function to avoid blocking
        const loadPreview = async () => {
          try {
            const domainPreview = await fetchDomainPreview(domain);
            // Check if component is still mounted and preview is still needed
            setPreview(domainPreview);
            setIsReallyUsed(inferDomainUsage(domainPreview));
            if (showPreview) {
              setShowPreview(true);
            }
          } catch (error) {
            console.error('Failed to load preview:', error);
          } finally {
            setLoadingPreview(false);
          }
        };

        // Start the loading without waiting (non-blocking)
        loadPreview();
      }, 500); // Wait 500ms before loading to avoid unnecessary requests
    } else if (preview) {
      // If preview is already loaded, just show it immediately
      setShowPreview(true);
    }
  };

  const handleMouseOver = () => {
    // Show loading state immediately
    setShowPreview(true);
    startPreviewLoad();
  };

  const handleMouseOut = () => {
    setShowPreview(false);
    // Cancel pending preview load if mouse moves away quickly
    // and hasn't completed loading yet
    if (previewTimerRef.current) {
      clearTimeout(previewTimerRef.current);
      previewTimerRef.current = null;
    }
  };

  return (
    <div
      className={`flex items-center justify-between py-2 px-3 border-b ${bgColorClass} relative`}
      onMouseEnter={!isAvailable && !hasError && !loading ? handleMouseOver : undefined}
      onMouseLeave={handleMouseOut}
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

        {isAvailable && price && (
          <a
            href={`https://porkbun.com/checkout/search?q=${domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-xs hover:underline"
          >
            <span className="font-semibold text-gray-700">Porkbun:</span>
            <span className="text-blue-600 ml-1">${price}</span>
            {renewalPrice && (
              <>
                <span className="text-gray-500 mx-1">/</span>
                <span className="text-purple-600">${renewalPrice}</span>
              </>
            )}
            <ExternalLinkIcon className="h-3 w-3 text-gray-500 ml-1" />
          </a>
        )}
      </div>

      {/* Domain Preview Popup */}
      {showPreview && !loading && !isAvailable && !hasError && (
        <div className="absolute left-0 top-full z-10 mt-1 w-full max-w-md bg-white rounded shadow-lg border border-gray-300 p-3 text-sm">
          {loadingPreview && !preview ? (
            <div className="flex items-center justify-center p-4">
              <LoadingIcon className="h-4 w-4 text-gray-400" />
              <span className="ml-2 text-gray-600">Loading preview...</span>
            </div>
          ) : preview ? (
            <>
              <h3 className="font-bold text-gray-800 mb-1">{preview.title}</h3>
              <p className="text-gray-600 text-xs">{preview.description}</p>
              {!preview.success && (
                <div className="mt-2 text-xs text-blue-500">
                  <a
                    href={`https://${domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    Visit website
                    <ExternalLinkIcon className="h-3 w-3 ml-1" />
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center p-4">
              <span className="text-gray-600">Hover for a moment to load preview...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DomainResult;
