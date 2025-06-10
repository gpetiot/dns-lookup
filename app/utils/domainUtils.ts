import { AIService, DEFAULT_PROVIDER } from '@/services/AIService';
import type { DomainParts } from '@/types/domain';

const aiService = new AIService(DEFAULT_PROVIDER);

// Common TLDs for domain variations
const commonTlds = [
  'com',
  'net',
  'org',
  'io',
  'co',
  'app',
  'dev',
  'ai',
  'me',
  //'info',
  //'pro',
  'cc',
  'tech',
  //'site',
  'studio',
  'xyz',
  //'online',
  //'store',
  //'blog',
  //'cloud',
];

// Prefixes for domain variations
export const prefixes: string[] = [
  //'get',
  //'try',
  //'use',
  //'hey',
  //'join',
  //'go',
  //'the',
  //'my',
];

// Suffixes for domain variations
export const suffixes: string[] = [
  'app',
  'hq',
  //'hub',
  'studio',
  'labs',
  //'way',
  //'me',
  //'tools',
  //'kit',
  //'tech',
  //'cloud',
  //'works',
  //'space',
  //'plus',
  //'pro',
  //'base',
];

/**
 * Sanitize domain input
 * @param {string} input - Raw domain input
 * @returns {string} Sanitized domain
 */
export const sanitizeDomain = (input: string) => {
  // Remove all spaces
  let sanitized = input.trim().replace(/\s+/g, '');

  // Convert to lowercase
  sanitized = sanitized.toLowerCase();

  // If there's no dot (extension), add .com
  if (!sanitized.includes('.')) {
    sanitized = `${sanitized}.com`;
  }

  // Remove any protocol prefixes (http://, https://, etc.)
  sanitized = sanitized.replace(/^(https?:\/\/)?(www\.)?/i, '');

  // Remove any trailing slashes or paths
  sanitized = sanitized.split('/')[0];

  return sanitized;
};

/**
 * Generate AI domain suggestions based on a base name
 * @param {string} baseName - The base domain name
 * @param {boolean} isFirstTime - Whether this is the first time generating suggestions
 * @returns {Promise<DomainParts[]>} Array of AI-generated domain variations
 */
export const generateAIDomainSuggestions = async (
  baseName: string,
  isFirstTime: boolean
): Promise<DomainParts[]> => {
  const aiService = new AIService(DEFAULT_PROVIDER);
  const nameOnly = baseName.split('.')[0];

  const prompt = isFirstTime
    ? `Generate 5 creative and memorable domain name variations for "${nameOnly}". Consider:
       - Using synonyms or shorter alternatives for words in the name
       - Adding relevant prefixes/suffixes
       - Using alternative spellings
       - Combining with related words
       IMPORTANT: 
       - All suggestions MUST end with .com
       - Do NOT use hyphens or numbers
       - Do NOT use "com" as a suffix (e.g., "myappcom.com" is not allowed)
       - Each suggestion must be unique
       - Names must be brandable and memorable
       - Maximum 10 characters or 3 words (not counting .com)
       Format: Return only the domain names, one per line, without any explanations or additional text.`
    : `Generate 5 more unique and creative domain name variations for "${nameOnly}". Names must be brandable, maximum 10 characters or 3 words (not counting .com). Do not repeat any previous suggestions. Return only the domain names, one per line.`;

  try {
    const response = await aiService.generateContent(prompt);
    const suggestions = response
      .split('\n')
      .filter(Boolean)
      .map(domain => {
        // Ensure .com extension
        const domainWithoutExt = domain.split('.')[0];
        return {
          base: domainWithoutExt,
          ext: 'com',
          domain: `${domainWithoutExt}.com`,
          input: `${domainWithoutExt}.com`, // Use the generated domain as input
          isAISuggestion: true,
        };
      })
      // Filter out any suggestions that end with 'com' before the extension
      .filter(suggestion => !suggestion.base.toLowerCase().endsWith('com'))
      // Filter out suggestions that are too long
      .filter(suggestion => {
        const base = suggestion.base;
        const wordCount = base.split(/[^a-zA-Z0-9]/).filter(Boolean).length;
        return base.length <= 10 || wordCount <= 3;
      });

    return suggestions;
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    return [];
  }
};

/**
 * Generate only the main domain (user's input)
 * @param {string} baseName - The base domain name
 * @param {string} userInput - The original user input before sanitization
 * @returns {DomainParts[]} Array containing only the main domain
 */
export const generateMainDomain = (baseName: string, userInput: string): DomainParts[] => {
  return [
    {
      base: baseName.split('.')[0],
      ext: baseName.split('.')[1] || 'com',
      domain: baseName,
      input: userInput,
    },
  ];
};

/**
 * Generate alternative TLD extensions for the same domain name
 * @param {string} baseName - The base domain name
 * @param {string} userInput - The original user input before sanitization
 * @returns {DomainParts[]} Array of alternative TLD variations
 */
export const generateAlternativeExtensions = (
  baseName: string,
  userInput: string
): DomainParts[] => {
  const variations: DomainParts[] = [];
  const nameOnly = baseName.split('.')[0];

  // Add all TLD variations except the original
  commonTlds.forEach(tld => {
    const targetDomain = `${nameOnly}.${tld}`;
    if (targetDomain !== baseName) {
      if (nameOnly.endsWith(tld)) {
        const base = nameOnly.slice(0, -tld.length);
        const userInputWithoutTld = userInput.slice(0, -tld.length);
        variations.push({
          base,
          ext: tld,
          domain: `${base}.${tld}`,
          input: userInputWithoutTld,
        });
      } else {
        variations.push({
          base: nameOnly,
          ext: tld,
          domain: `${nameOnly}.${tld}`,
          input: userInput,
        });
      }
    }
  });

  return variations;
};

/**
 * Generate prefix/suffix .com suggestions
 * @param {string} baseName - The base domain name
 * @param {string} userInput - The original user input before sanitization
 * @returns {DomainParts[]} Array of prefix/suffix variations
 */
export const generateAlternativeSuggestions = (
  baseName: string,
  userInput: string
): DomainParts[] => {
  const variations: DomainParts[] = [];
  const nameOnly = baseName.split('.')[0];

  // Add prefixed variations with .com
  const sortedPrefixes = [...prefixes].sort();
  sortedPrefixes.forEach(prefix => {
    variations.push({
      prefix,
      base: nameOnly,
      ext: 'com',
      domain: `${prefix}${nameOnly}.com`,
      input: userInput,
    });
  });

  // Add suffixed variations with .com
  const sortedSuffixes = [...suffixes].sort();
  sortedSuffixes.forEach(suffix => {
    variations.push({
      base: nameOnly,
      suffix,
      ext: 'com',
      domain: `${nameOnly}${suffix}.com`,
      input: userInput,
    });
  });

  return variations;
};
