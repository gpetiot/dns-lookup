import React from 'react';

export default function Header() {
  return (
    <header className="w-full pt-24 sm:pt-32 lg:pt-40">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="mb-8 font-display text-3xl font-medium text-gray-900">Sup&apos; Domain</h1>
        <p className="mx-auto mb-12 max-w-lg text-lg text-gray-600">
          Search domains safely. No sneaky snatching.
        </p>
      </div>
    </header>
  );
}
