import React from 'react';

interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`tg-viewport min-h-screen bg-gray-900 text-gray-50 flex flex-col safe-area-inset ${className}`}>
      <div className="w-full max-w-md mx-auto flex-grow px-4 py-2">
        {children}
      </div>
    </div>
  );
};

export default BaseLayout;