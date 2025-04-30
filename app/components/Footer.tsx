import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full border-t border-background-lighter bg-background py-6">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-text-muted">
          © {currentYear} Sup' Domain. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
