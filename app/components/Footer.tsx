import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full border-t border-background-lighter bg-background/80 py-8 backdrop-blur-sm">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-2 px-6">
        <p className="text-center text-xs tracking-wide text-text-muted sm:text-sm">
          <span className="font-semibold text-text">© {currentYear} Sup' Domain</span>. All rights
          reserved.
        </p>
        <div className="flex items-center gap-1 text-xs sm:text-sm">
          <span>View source on</span>
          <a
            href="https://github.com/gpetiot/dns-lookup"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded text-primary underline underline-offset-2 transition-colors duration-150 hover:text-primary/80 focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            <svg
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="inline-block align-text-bottom"
            >
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.58 2 12.26c0 4.48 2.87 8.28 6.84 9.63.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.18 9.18 0 0 1 12 7.43c.85.004 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"
              />
            </svg>
            <span className="sr-only">GitHub</span>
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
