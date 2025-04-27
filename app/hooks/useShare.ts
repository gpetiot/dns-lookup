import { useState } from 'react';

export function useShare() {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async (displayDomain: string) => {
    if (!displayDomain) return;

    const shareUrl = `${window.location.origin}${window.location.pathname}?q=${encodeURIComponent(displayDomain)}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy share URL:', err);
    }
  };

  return { isCopied, handleShare };
}
