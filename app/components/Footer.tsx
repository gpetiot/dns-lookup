import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full bg-gray-100 py-4">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-gray-600">
          © {currentYear} Domain Checker. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
