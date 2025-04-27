import { useState } from 'react';
import type { AvailabilityFilter, TldFilter, DomainResults } from '@/types/domain';

export interface FilterState {
  availabilityFilter: AvailabilityFilter;
  tldFilter: TldFilter;
}

export function useFilters() {
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>('all');
  const [tldFilter, setTldFilter] = useState<TldFilter>('all');

  const checkDomainAgainstFilters = (domainToCheck: string, results: DomainResults): boolean => {
    // Availability Check
    const result = results[domainToCheck];
    let isAvailableOk = true;
    if (availabilityFilter === 'available') {
      isAvailableOk = result && !result.loading && result.data?.isAvailable === true;
    }

    // TLD Check
    let isTldOk = true;
    if (tldFilter === 'com') {
      isTldOk = domainToCheck.endsWith('.com');
    }

    return isAvailableOk && isTldOk;
  };

  return {
    filters: { availabilityFilter, tldFilter },
    setAvailabilityFilter,
    setTldFilter,
    checkDomainAgainstFilters,
  };
}
