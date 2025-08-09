import React from 'react';
import GitHubIcon from './icons/GitHubIcon';

export default function Header() {
  return (
    <header className="lg:pt relative w-full bg-gradient-to-b from-violet-50 via-white to-white pb-8 pt-10 sm:pt-16">
      <div className="absolute right-6 top-6 z-20">
        <a
          href="https://github.com/gpetiot/dns-lookup"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View on GitHub"
          className="group flex h-12 w-12 items-center justify-center rounded-full border border-violet-400 bg-white text-violet-600 shadow-lg transition-all duration-200 hover:border-violet-600 hover:bg-violet-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-400/30"
        >
          <GitHubIcon width={24} height={24} />
        </a>
      </div>
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-8">
        <div className="relative mb-5 flex flex-col items-center">
          <span className="mb-2 inline-block rounded-full bg-gradient-to-r from-violet-500 to-purple-500 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white shadow-sm">
            Sup' Domain
          </span>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-violet-500 bg-clip-text text-transparent drop-shadow-sm">
              Find Your Domain
            </span>
          </h1>
        </div>
      </div>
    </header>
  );
}
