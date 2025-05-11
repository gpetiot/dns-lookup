import type { WhoIsResult } from 'whois-parsed';

export interface DomainPrice {
  registration: number;
  renewal: number;
  transfer: number;
  isPremium: boolean;
  currency: string;
}

export interface DomainParts {
  domain: string;
  prefix?: string;
  suffix?: string;
  base: string;
  ext: string;
  input: string;
  isFeatured?: boolean;
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
