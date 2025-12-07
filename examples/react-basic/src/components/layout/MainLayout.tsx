import React from 'react';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Header />
        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {children}
        </main>
        <footer className="mt-12 text-center text-gray-400 text-sm">
          <p>Powered by i18n-bakery 🥯</p>
        </footer>
      </div>
    </div>
  );
};
