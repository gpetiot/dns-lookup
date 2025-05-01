import React, { useEffect, useState } from 'react';
import { DomainParts } from '@/utils/domainUtils';
import type { DomainPrice } from '@/types/domain';
import ExternalLinkIcon from './icons/ExternalLinkIcon';
import LoadingIcon from './icons/LoadingIcon';
import ErrorIcon from './icons/ErrorIcon';
import AvailableIcon from './icons/AvailableIcon';
import RegisteredIcon from './icons/RegisteredIcon';
import RetryIcon from './icons/RetryIcon';
import LogoPreview from './LogoPreview';
import type { WhoIsResult } from 'whois-parsed';
import { getDomainPrice } from '@/services/domainPriceService';

interface DomainResultProps {
  parts: DomainParts;
  data?: WhoIsResult;
  loading: boolean;
  onRetry: () => void;
  showPrice?: boolean;
}

const DomainResult: React.FC<DomainResultProps> = ({
  parts,
  data,
  loading,
  onRetry,
  showPrice = false,
}) => {
  const [price, setPrice] = useState<DomainPrice | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const hasError = false;
  const isAvailable = data?.isAvailable;

  useEffect(() => {
    const fetchPrice = async () => {
      if (showPrice && isAvailable && !loading) {
        setLoadingPrice(true);
        try {
          const priceData = await getDomainPrice(parts.domain);
          setPrice(priceData);
        } catch (error) {
          console.error('Error fetching price:', error);
        } finally {
          setLoadingPrice(false);
        }
      }
    };

    fetchPrice();
  }, [parts.domain, isAvailable, loading, showPrice]);

  // Apply neutral styling for loading state, otherwise use status-based colors
  const bgColorClass = loading
    ? 'bg-background border-background-lighter'
    : isAvailable
      ? 'bg-primary/5 border-primary/10'
      : hasError
        ? 'bg-background'
        : 'bg-background-lighter/30';

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div
      className={`flex items-center justify-between rounded-lg border px-4 py-3 ${bgColorClass} relative shadow-sm`}
    >
      {/* Left Column: Status Icon + Domain */}
      <div className="flex flex-grow items-center">
        <div className="mr-3 w-8 flex-shrink-0">
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
            <span className="text-text-muted">{parts.domain}</span>
          ) : hasError ? (
            <span className="text-text-muted">{parts.domain}</span>
          ) : isAvailable ? (
            <span className="flex items-center gap-4">
              <span className="font-medium text-primary">{parts.domain}</span>
              <LogoPreview parts={parts} />
            </span>
          ) : (
            <a
              href={`https://${parts.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-text-muted hover:text-text hover:underline"
            >
              {parts.domain}
              <ExternalLinkIcon className="ml-1 inline-block h-3 w-3 flex-shrink-0" />
            </a>
          )}
        </div>
      </div>

      {/* Right Column: Error, Price, or Broker Link */}
      <div className="flex items-center justify-end">
        {loading && <div className="text-xs text-text-muted">Checking...</div>}

        {hasError && data?.status && (
          <div className="flex items-center">
            <div className="mr-2 max-w-xs truncate text-xs text-text-muted">{data.status}</div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-background transition duration-200 hover:bg-primary-dark"
              >
                <RetryIcon />
                Retry
              </button>
            )}
          </div>
        )}

        {isAvailable && (
          <div className="flex items-center gap-4">
            {loadingPrice ? (
              <div className="text-xs text-text-muted">Loading price...</div>
            ) : price ? (
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1">
                  <span
                    className={`text-sm font-medium ${price.isPremium ? 'text-amber-500' : 'text-primary'}`}
                  >
                    {formatPrice(price.registration, price.currency)}
                  </span>
                  {price.isPremium && (
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-500">
                      Premium
                    </span>
                  )}
                </div>
                <div className="text-xs text-text-muted">
                  Renewal: {formatPrice(price.renewal, price.currency)}/yr
                </div>
              </div>
            ) : null}
            <a
              href={`https://porkbun.com/checkout/search?q=${parts.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-colors duration-200 hover:border-primary/30 hover:bg-primary/10"
            >
              Porkbun
              <ExternalLinkIcon className="ml-1.5 h-3 w-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainResult;
