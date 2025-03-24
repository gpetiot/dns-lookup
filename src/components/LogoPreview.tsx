import React from 'react';
import { DomainParts } from '../utils/domainUtils';

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
    return text
      .split(/([^a-zA-Z0-9])/)
      .map(word =>
        word.match(/[a-zA-Z0-9]/) ? word.charAt(0).toUpperCase() + word.slice(1) : word
      )
      .join('');
  };

  const baseStyle = "font-['Syne'] text-gray-800";
  const getHighlightStyle = (text: string) => `font-['Work_Sans'] ${getColorForText(text)}`;

  return (
    <div className="font-medium bg-white px-1 py-0.5 rounded-lg inline-flex items-center gap-1.5 transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer">
      {parts.prefix ? (
        <>
          <span className={getHighlightStyle(parts.prefix)}>{capitalizeWords(parts.prefix)}</span>
          <span className={baseStyle}>{capitalizeWords(parts.input)}</span>
        </>
      ) : parts.suffix ? (
        <>
          <span className={baseStyle}>{capitalizeWords(parts.input)}</span>
          <span className={getHighlightStyle(parts.suffix)}>{capitalizeWords(parts.suffix)}</span>
        </>
      ) : (
        <>
          <span className={baseStyle}>{capitalizeWords(parts.input)}</span>
          <span className={getHighlightStyle(parts.ext)}>{capitalizeWords(parts.ext)}</span>
        </>
      )}
    </div>
  );
};

export default LogoPreview;
