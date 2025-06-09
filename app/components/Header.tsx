import React from 'react';

export default function Header() {
  return (
    <header className="w-full pt-8 sm:pt-12 lg:pt-16">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="mb-4 font-display text-2xl font-medium text-gray-900 sm:text-3xl">
          Sup&apos; Domain
        </h1>
        <p className="mx-auto mb-6 max-w-lg text-base text-gray-600 sm:mb-8 sm:text-lg">
          Search domains safely. No sneaky snatching.
        </p>
      </div>
    </header>
  );
}
