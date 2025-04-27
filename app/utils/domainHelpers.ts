import type { DomainParts } from '@/types/domain';

export function categorizeResults(domainVariations: DomainParts[], displayDomain: string) {
  if (!domainVariations.length)
    return { mainDomain: null, alternativeExtensions: [], alternativeSuggestions: [] };

  const mainDomain = domainVariations.find(variation => variation.domain === displayDomain);

  const alternativeExtensions = domainVariations.filter(
    variation =>
      variation.prefix === undefined &&
      variation.suffix === undefined &&
      variation.domain !== displayDomain
  );

  const alternativeSuggestions = domainVariations.filter(
    variation => variation.prefix !== undefined || variation.suffix !== undefined
  );

  return {
    mainDomain,
    alternativeExtensions,
    alternativeSuggestions,
  };
}
