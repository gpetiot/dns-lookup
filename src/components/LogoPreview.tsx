import React from 'react';
import { DomainParts } from '../utils/domainUtils';

interface LogoPreviewProps {
  parts: DomainParts;
}

const LogoPreview: React.FC<LogoPreviewProps> = ({ parts }) => {
  // Generate a consistent random gradient for a given domain
  const getGradientForDomain = (domain: string) => {
    // List of tailwind gradient color pairs that work well together
    const gradientPairs = [
      ['from-indigo-500 to-purple-500'],
      ['from-blue-500 to-teal-500'],
      ['from-purple-500 to-pink-500'],
      ['from-green-500 to-teal-500'],
      ['from-pink-500 to-rose-500'],
      ['from-amber-500 to-orange-500'],
      ['from-violet-500 to-purple-500'],
      ['from-cyan-500 to-blue-500'],
    ];

    // Use string to generate a consistent index
    const charSum = domain.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const index = charSum % gradientPairs.length;
    return gradientPairs[index][0];
  };

  const baseStyle = "font-['Syne'] text-gray-800";
  const getHighlightStyle = (text: string) =>
    `font-['Work_Sans'] text-white px-0.5 rounded bg-gradient-to-r ${getGradientForDomain(text)}`;

  return (
    <div className="font-medium bg-white px-1 py-0.5 rounded-lg inline-flex items-center gap-1.5 transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer">
      {parts.prefix ? (
        <>
          <span className={getHighlightStyle(parts.prefix)}>{parts.prefix}</span>
          <span className={baseStyle}>{parts.input}</span>
        </>
      ) : parts.suffix ? (
        <>
          <span className={baseStyle}>{parts.input}</span>
          <span className={getHighlightStyle(parts.suffix)}>{parts.suffix}</span>
        </>
      ) : (
        <>
          <span className={baseStyle}>{parts.input}</span>
          <span className={getHighlightStyle(parts.ext)}>{parts.ext}</span>
        </>
      )}
    </div>
  );
};

export default LogoPreview;
