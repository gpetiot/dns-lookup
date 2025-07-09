import React from 'react';
import GitHubIcon from './icons/GitHubIcon';

export default function Header() {
  return (
    <header className="relative w-full pt-8 sm:pt-12 lg:pt-16">
      <a
        href="https://github.com/gpetiot/dns-lookup"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View on GitHub"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-violet-500 bg-violet-500 text-white shadow transition-all duration-200 hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
      >
        <GitHubIcon width={24} height={24} />
      </a>
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
          Find available domains privately
        </p>
      </div>
    </header>
  );
}
