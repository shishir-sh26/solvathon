import { ReactNode } from 'react';
import { useAppStore } from '../../store/useAppStore';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { userRole, setUserRole } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-100 text-black font-sans selection:bg-gray-300 relative">
      <nav className="border-b-4 border-black bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <h1 className="text-xl font-black uppercase tracking-widest">PlacementPro</h1>
        <div className="flex gap-4">
          <button onClick={() => setUserRole('TPO')} className={`text-sm font-bold uppercase ${userRole === 'TPO' ? 'border-b-2 border-black' : 'text-gray-500'}`}>TPO</button>
          <button onClick={() => setUserRole('STUDENT')} className={`text-sm font-bold uppercase ${userRole === 'STUDENT' ? 'border-b-2 border-black' : 'text-gray-500'}`}>Student</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
}