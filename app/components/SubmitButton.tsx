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
      className="flex h-full items-center rounded-md border border-primary bg-primary px-4 font-medium text-background transition-all duration-200 hover:border-primary-dark hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          Checking
          <LoadingIcon />
        </span>
      ) : (
        <>
          Check
          <span className="ml-2 inline-block rounded border border-background/20 px-1 text-sm">
            ↵
          </span>
        </>
      )}
    </button>
  );
};

export default SubmitButton;
