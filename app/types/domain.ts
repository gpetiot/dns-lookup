import type { WhoIsResult as BaseWhoIsResult } from 'whois-parsed';

// Extend the WhoIsResult type to include our custom properties
export interface WhoIsResult extends BaseWhoIsResult {
  isRateLimited?: boolean;
}

export interface DomainPrice {
  registration: number;
  renewal: number;
  transfer: number;
  isPremium: boolean;
  currency: string;
}

export interface DomainParts {
  domain: string;
  base: string;
  ext: string;
  type?: 'original' | 'alternative' | 'featured' | 'ai';
  prefix?: string;
  suffix?: string;
  input?: string;
}

export interface DomainResult {
  loading: boolean;
  data?: WhoIsResult;
}

export type DomainResults = Record<string, DomainResult>;

export type AvailabilityFilter = 'all' | 'available';
export type TldFilter = 'all' | 'com';

export interface FilterState {
  availabilityFilter: AvailabilityFilter;
  tldFilter: TldFilter;
}
