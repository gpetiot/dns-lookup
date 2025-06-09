import React, { useEffect, useRef } from 'react';

interface ImplicitComSuffixProps {
  domain: string;
}

const ImplicitComSuffix: React.FC<ImplicitComSuffixProps> = ({ domain }) => {
  const textMeasureRef = useRef<HTMLSpanElement>(null);
  const [showComSuffix, setShowComSuffix] = React.useState(false);
  const [suffixLeft, setSuffixLeft] = React.useState(48);

  // Effect to show/hide the (.com) suffix and calculate its position
  useEffect(() => {
    const shouldShow = domain.length > 0 && !domain.includes('.');
    setShowComSuffix(shouldShow);

    if (shouldShow && textMeasureRef.current) {
      textMeasureRef.current.textContent = domain;
      const inputPaddingLeftPx = 48; // pl-12 = 3rem = 48px
      const gapPx = 4;
      const textWidthPx = textMeasureRef.current.offsetWidth;
      setSuffixLeft(inputPaddingLeftPx + textWidthPx + gapPx);
    } else if (!shouldShow) {
      setSuffixLeft(48); // Match the input padding-left
    }
  }, [domain]);

  return (
    <>
      <span
        ref={textMeasureRef}
        aria-hidden="true"
        className="invisible absolute left-0 top-0 z-[-1] h-0 overflow-hidden whitespace-pre text-lg"
      />
      {showComSuffix && (
        <span
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-nowrap text-gray-400"
          style={{ left: `${suffixLeft}px` }}
        >
          (.com)
        </span>
      )}
    </>
  );
};

export default ImplicitComSuffix;
