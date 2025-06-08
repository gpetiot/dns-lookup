import { useState } from 'react';
import type { DomainResults } from '@/types/domain';

export function useFilters() {
  const [availableOnly, setAvailableOnly] = useState(false);
  const [dotComOnly, setDotComOnly] = useState(false);

  const checkDomainAgainstFilters = (domainToCheck: string, results: DomainResults): boolean => {
    const result = results[domainToCheck];

    // Skip filters if none are active
    if (!availableOnly && !dotComOnly) return true;

    // Check filters
    const isAvailable =
      !availableOnly || (result && !result.loading && result.data?.isAvailable === true);
    const isDotCom = !dotComOnly || domainToCheck.endsWith('.com');

    return isAvailable && isDotCom;
  };

  return {
    filters: { availableOnly, dotComOnly },
    setAvailableOnly,
    setDotComOnly,
    checkDomainAgainstFilters,
  };
}
