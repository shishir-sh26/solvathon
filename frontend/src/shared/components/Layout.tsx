import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
            <span className="text-xl font-bold text-gray-900 italic">PLACEMENT PRO</span>
          </div>
          <nav className="flex items-center gap-6">
            <button className="text-sm font-medium text-gray-500 hover:text-primary-600">Features</button>
            <button className="text-sm font-medium text-gray-500 hover:text-primary-600">Alumni</button>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">Sign In</button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-white border-t py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          &copy; 2024 Placement Pro. Accelerating Careers with AI.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
