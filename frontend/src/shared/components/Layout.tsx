import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import ChatWindow from '../../features/placement-bot/components/ChatWindow'; // Ensure this path is correct!

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { userRole, setUserRole } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUserRole(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black font-sans selection:bg-gray-300">
      
      {/* Protected Navigation Bar */}
      <nav className="border-b-4 border-black bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-black uppercase tracking-widest">PlacementPro</h1>
          <span className="bg-black text-white text-xs font-bold px-2 py-1 uppercase tracking-wider">
            {userRole} PORTAL
          </span>
        </div>
        
        <button 
          onClick={handleLogout} 
          className="text-sm font-bold uppercase border-2 border-black px-4 py-1 hover:bg-gray-100 transition-colors"
        >
          Logout
        </button>
      </nav>

      {/* Main Page Content */}
      <main className="max-w-7xl mx-auto p-6">
        {children}
      </main>

      {/* Global Bot is available to all logged-in users */}
      <ChatWindow />
    </div>
  );
}