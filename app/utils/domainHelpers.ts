import type { DomainParts } from '@/types/domain';

export function categorizeResults(domainVariations: DomainParts[], displayDomain: string) {
  if (!domainVariations.length)
    return {
      mainDomain: null,
      alternativeExtensions: [],
      alternativeSuggestions: [],
      featuredDomains: [],
    };

  const isFeatured = (domain: string) =>
    domainVariations.some(variation => variation.domain === domain && variation.isFeatured);

  const mainDomain = domainVariations.find(
    variation => !variation.isFeatured && variation.domain === displayDomain
  );

  const alternativeExtensions = domainVariations.filter(
    variation =>
      !variation.isFeatured &&
      variation.prefix === undefined &&
      variation.suffix === undefined &&
      variation.domain !== displayDomain
  );

  const alternativeSuggestions = domainVariations.filter(
    variation =>
      !variation.isFeatured && (variation.prefix !== undefined || variation.suffix !== undefined)
  );

  const featuredDomains = domainVariations.filter(variation => variation.isFeatured);

  return {
    mainDomain,
    alternativeExtensions,
    alternativeSuggestions,
    featuredDomains,
  };
}

export function parseFeaturedDomain(input: string) {
  const base = input.replace(/\s+/g, '');
  const ext = 'com';
  return {
    domain: `${base}.${ext}`,
    prefix: '',
    base,
    suffix: '',
    ext,
    input,
    isFeatured: true,
  };
}
