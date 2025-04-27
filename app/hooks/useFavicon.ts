import { useEffect } from 'react';
import type { DomainResults } from '@/types/domain';

export function useFavicon(displayDomain: string, domainResults: DomainResults) {
  useEffect(() => {
    const faviconLink = document.getElementById('dynamic-favicon') as HTMLLinkElement | null;
    if (!faviconLink) return;

    const mainResult = domainResults[displayDomain];

    if (displayDomain && mainResult && !mainResult.loading) {
      if (mainResult.data?.isAvailable) {
        faviconLink.href = '/favicon-available.svg';
      } else {
        faviconLink.href = '/favicon-unavailable.svg';
      }
    } else {
      faviconLink.href = '/favicon-default.svg';
    }
  }, [displayDomain, domainResults]);
}
