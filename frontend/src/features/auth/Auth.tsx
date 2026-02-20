import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export default function Auth() {
  const { setUserRole } = useAppStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (role: 'TPO' | 'STUDENT' | 'RECRUITER') => {
    if (!email || !password) {
      alert("Please enter a mock email and password to continue.");
      return;
    }
    
    // 1. Set the global Zustand state
    setUserRole(role);
    
    // 2. Redirect to the correct URL based on their role
    if (role === 'STUDENT') navigate('/student');
    if (role === 'TPO') navigate('/tpo');
    if (role === 'RECRUITER') navigate('/recruiter');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white border-4 border-black p-8 w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        
        <div className="text-center mb-8 border-b-4 border-black pb-6">
          <h1 className="text-3xl font-black uppercase tracking-widest mb-2">PlacementPro</h1>
          <p className="text-gray-600 font-bold text-sm">Centralized Campus Career Suite</p>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Email / ID</label>
            <input 
              type="text" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-black p-3 font-bold focus:outline-none focus:bg-gray-100"
              placeholder="admin@college.edu"
            />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Password</label>
            <input 
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-black p-3 font-bold focus:outline-none focus:bg-gray-100"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold text-center text-gray-500 uppercase mb-2">Simulate Login As:</p>
          <button onClick={() => handleLogin('STUDENT')} className="w-full bg-white text-black border-2 border-black font-bold py-3 uppercase tracking-wide hover:bg-gray-100">
            Login as Student
          </button>
          <button onClick={() => handleLogin('TPO')} className="w-full bg-black text-white border-2 border-black font-bold py-3 uppercase tracking-wide hover:bg-gray-800">
            Login as TPO Admin
          </button>
          <button onClick={() => handleLogin('RECRUITER')} className="w-full bg-white text-black border-2 border-black font-bold py-3 uppercase tracking-wide hover:bg-gray-100">
            Login as Recruiter
          </button>
        </div>

      </div>
    </div>
  );
}