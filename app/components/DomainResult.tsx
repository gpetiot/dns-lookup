import React, { useEffect, useState } from 'react';
import type { DomainParts, DomainPrice } from '@/types/domain';
import ExternalLinkIcon from './icons/ExternalLinkIcon';
import LoadingIcon from './icons/LoadingIcon';
import ErrorIcon from './icons/ErrorIcon';
import AvailableIcon from './icons/AvailableIcon';
import RegisteredIcon from './icons/RegisteredIcon';
import RetryIcon from './icons/RetryIcon';
import WarningIcon from './icons/WarningIcon';
import LogoPreview from './LogoPreview';
import type { WhoIsResult } from '@/types/domain';
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
  const hasError = data?.isRateLimited || false;
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
        ? 'bg-amber-500/5 border-amber-500/10'
        : 'bg-background-lighter/30';

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div
      className={`flex flex-row items-start justify-between rounded-lg border px-2.5 py-2 sm:px-4 sm:py-3 ${bgColorClass} relative gap-3 shadow-sm`}
    >
      {/* Left Column: Status Icon + Domain */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center">
          <div className="mr-2 w-5 flex-shrink-0 sm:mr-3 sm:w-8">
            {loading ? (
              <LoadingIcon />
            ) : data?.isRateLimited ? (
              <WarningIcon />
            ) : hasError ? (
              <ErrorIcon />
            ) : isAvailable ? (
              <AvailableIcon />
            ) : (
              <RegisteredIcon />
            )}
          </div>

          <div className="sm:text-md truncate text-sm font-medium">
            {loading ? (
              <span className="text-text-muted">{parts.domain}</span>
            ) : data?.isRateLimited ? (
              <span className="text-amber-500">{parts.domain}</span>
            ) : hasError ? (
              <span className="text-text-muted">{parts.domain}</span>
            ) : isAvailable ? (
              <span className="font-medium text-primary">{parts.domain}</span>
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

        {/* Error message */}
        {(hasError || data?.isRateLimited) && data?.status && (
          <div className="pl-7 sm:pl-11">
            <div className="text-xs text-amber-500">{data.status}</div>
          </div>
        )}

        {isAvailable && (
          <div className="pl-7 sm:pl-11">
            <LogoPreview parts={parts} />
          </div>
        )}
      </div>

      {/* Right Column: Retry Button, Price, or Broker Link */}
      <div className={`flex min-w-fit flex-col items-end justify-center gap-1.5 sm:gap-3`}>
        {loading && <div className="text-xs text-text-muted">Checking...</div>}

        {(hasError || data?.isRateLimited) && onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1 whitespace-nowrap rounded-md bg-amber-500 px-2 py-1 text-xs font-medium text-white transition duration-200 hover:bg-amber-600 sm:px-3 sm:py-1.5"
          >
            <RetryIcon />
            <span>Retry</span>
          </button>
        )}

        {isAvailable && (
          <div className="flex flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-4">
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
                    <span className="rounded-full bg-amber-500/10 px-1.5 py-0.5 text-xs font-medium text-amber-500">
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
              className="inline-flex items-center rounded-md border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary transition-colors duration-200 hover:border-primary/30 hover:bg-primary/10 sm:px-3 sm:py-1.5"
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
