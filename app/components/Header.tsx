import React from 'react';

export default function Header() {
  return (
    <header className="w-full pt-8 sm:pt-12 lg:pt-16">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <div className="relative mb-4">
          <h1 className="font-display text-3xl font-black tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Sup&apos;{' '}
            <span className="relative inline-block">
              Domain
              <div className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600"></div>
            </span>
          </h1>
        </div>
        <p className="mx-auto mb-6 max-w-lg text-base font-medium text-gray-600 sm:mb-8 sm:text-lg">
          Search domains safely. No sneaky snatching.
        </p>
      </div>
    </header>
  );
}
