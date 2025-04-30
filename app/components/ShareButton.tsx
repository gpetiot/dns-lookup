import React from 'react';
import CopyIcon from './icons/CopyIcon';
import CheckIcon from './icons/CheckIcon';
import { useShare } from '@/hooks/useShare';

interface ShareButtonProps {
  displayDomain: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ displayDomain }) => {
  const { isCopied, handleShare } = useShare();

  return (
    <button
      type="button"
      onClick={() => handleShare(displayDomain)}
      title="Copy shareable link"
      disabled={!displayDomain || isCopied}
      className={`flex h-full items-center rounded-md px-2.5 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
        isCopied
          ? 'bg-primary/5 text-primary'
          : 'bg-background-lighter text-text-muted hover:bg-background-lighter hover:text-text'
      }`}
    >
      {isCopied ? <CheckIcon className="h-5 w-5" /> : <CopyIcon className="h-5 w-5" />}
    </button>
  );
};

export default ShareButton;
