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
      className={`flex h-full items-center rounded-md px-2 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
        isCopied
          ? 'bg-green-100 text-green-700'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
      }`}
    >
      {isCopied ? <CheckIcon className="h-5 w-5" /> : <CopyIcon className="h-5 w-5" />}
    </button>
  );
};

export default ShareButton;
