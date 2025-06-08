import React from 'react';
import LoadingIcon from './icons/LoadingIcon';

interface SubmitButtonProps {
  loading: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ loading }) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex h-full items-center rounded-full border border-blue-500 bg-blue-500 px-6 font-medium text-white transition-all duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:border-gray-300 disabled:bg-gray-300"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <LoadingIcon className="h-5 w-5 text-white" />
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <span>Check</span>
          <span className="hidden rounded bg-white/20 px-1.5 py-0.5 text-sm font-normal text-white sm:inline-block">
            ↵
          </span>
        </span>
      )}
    </button>
  );
};

export default SubmitButton;
