import React from 'react';
import type { DomainParts } from '@/types/domain';

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

  const baseStyle = "font-['Syne'] text-gray-800";
  const getHighlightStyle = (text: string) => `font-['Work_Sans'] ${getColorForText(text)}`;
  const input = parts.input.split('.')[0];

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
      ) : (
        <>
          <span className={baseStyle}>{capitalizeWords(substitute(input))}</span>
          <span className={getHighlightStyle(parts.ext)}>{capitalizeWords(parts.ext)}</span>
        </>
      )}
    </div>
  );
};

export default LogoPreview;
