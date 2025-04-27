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
      className="flex h-full items-center rounded-md border border-blue-400/20 bg-blue-500 px-4 font-bold text-white transition duration-300 hover:bg-blue-600 focus:outline-none disabled:opacity-50"
    >
      {loading ? (
        <span className="flex items-center gap-1.5">
          Checking
          <LoadingIcon />
        </span>
      ) : (
        <>
          Check
          <span className="ml-1.5 inline-block rounded border border-white/30 px-1">↵</span>
        </>
      )}
    </button>
  );
};

export default SubmitButton;
