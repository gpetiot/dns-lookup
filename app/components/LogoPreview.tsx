import React from 'react';
import type { DomainParts } from '@/types/domain';
import { suffixes } from '@/utils/domainUtils';

interface LogoPreviewProps {
  parts: DomainParts;
}

const LogoPreview: React.FC<LogoPreviewProps> = ({ parts }) => {
  // Generate a consistent color for a given text
  const getColorForText = (text: string) => {
    // List of tailwind text colors that work well together
    const colors = [
      'text-indigo-500',
      'text-blue-500',
      'text-purple-500',
      'text-green-500',
      'text-pink-500',
      'text-amber-500',
      'text-violet-500',
      'text-cyan-500',
    ];

    // Use string to generate a consistent index
    const charSum = text.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const index = charSum % colors.length;
    return colors[index];
  };

  // Get a consistent font for a given text
  const getFontForText = (text: string) => {
    // List of distinctly different sans-serif fonts optimized for logos
    const fonts = [
      {
        font: "font-['Montserrat']", // Geometric sans-serif, very popular in tech
        spacing: 'tracking-normal',
      },
      {
        font: "font-['Oswald']", // Condensed sans-serif, strong presence
        spacing: 'tracking-wider',
      },
      {
        font: "font-['Poppins']", // Geometric with personality, startup favorite
        spacing: 'tracking-normal',
      },
      {
        font: "font-['DM_Sans']", // Modern with unique character, tech-friendly
        spacing: 'tracking-normal',
      },
      {
        font: "font-['Open_Sans']", // Humanist sans-serif, highly readable
        spacing: 'tracking-tight', // Naturally wide spacing, can be tightened
      },
      {
        font: "font-['Roboto']", // Clean and neutral, versatile
        spacing: 'tracking-normal',
      },
    ];

    // Use the full domain to generate a consistent random index
    const fullDomain = parts.domain;
    const randomIndex =
      Math.abs(
        fullDomain.split('').reduce((acc, char) => {
          return (acc << 5) - acc + char.charCodeAt(0);
        }, 0)
      ) % fonts.length;

    const selectedFont = fonts[randomIndex];
    return `${selectedFont.font} ${selectedFont.spacing}`;
  };

  // Capitalize each word in a string
  const capitalizeWords = (text: string) => {
    // Special case for .io and .ai extensions
    if (text === 'io' || text === 'ai') {
      return text.toUpperCase();
    }
    return text
      .split(/([^a-zA-Z0-9])/)
      .map(word =>
        word.match(/[a-zA-Z0-9]/) ? word.charAt(0).toUpperCase() + word.slice(1) : word
      )
      .join('');
  };

  const substitute = (text: string) => {
    const substitutions = [
      {
        subText: 'and',
        replacement: '&',
      },
    ];
    return substitutions.reduce((acc, substitution) => {
      return acc.replace(substitution.subText, substitution.replacement);
    }, text);
  };

  const input = parts.input.split('.')[0];
  const selectedFont = getFontForText(parts.input);
  const baseStyle = `${selectedFont} text-gray-800`;
  const getHighlightStyle = (text: string) => `${selectedFont} ${getColorForText(text)}`;

  return (
    <div className="inline-flex items-center gap-1.5 rounded-lg bg-white px-1 py-0.5 font-medium">
      {parts.prefix ? (
        <>
          <span className={getHighlightStyle(parts.prefix)}>{capitalizeWords(parts.prefix)}</span>
          <span className={baseStyle}>{capitalizeWords(substitute(input))}</span>
        </>
      ) : parts.suffix ? (
        <>
          <span className={baseStyle}>{capitalizeWords(substitute(input))}</span>
          <span className={getHighlightStyle(parts.suffix)}>{capitalizeWords(parts.suffix)}</span>
        </>
      ) : suffixes.includes(parts.ext) ? (
        <>
          <span className={baseStyle}>{capitalizeWords(substitute(input))}</span>
          <span className={getHighlightStyle(parts.ext)}>{capitalizeWords(parts.ext)}</span>
        </>
      ) : (
        <span className={baseStyle}>{capitalizeWords(substitute(input))}</span>
      )}
    </div>
  );
};

export default LogoPreview;
