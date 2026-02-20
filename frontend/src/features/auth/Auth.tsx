import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import type { UserRole } from '../../store/useAppStore';

export default function Auth() {
  const { setUserRole, approvedUsers, pendingUsers, requestAccess, directRegister } = useAppStore();
  const navigate = useNavigate();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return alert("Please enter an email address.");

    if (isSignUp) {
      // Check if already exists
      const exists = [...approvedUsers, ...pendingUsers].some(u => u.email === email);
      if (exists) return alert("This email is already registered.");

      if (selectedRole === 'TPO') {
        // DIRECT LOGIN FOR TPO
        directRegister(email, 'TPO');
        setUserRole('TPO');
        alert("TPO Account created successfully!");
        navigate('/tpo');
      } else {
        // APPROVAL REQUIRED FOR OTHERS
        requestAccess(email, selectedRole);
        alert("Registration submitted! Please wait for TPO approval.");
        setIsSignUp(false);
      }
      setEmail('');
      setPassword('');
    } else {
      // Login Logic
      const user = approvedUsers.find(u => u.email === email);
      if (user) {
        setUserRole(user.role);
        navigate(`/${user.role.toLowerCase()}`);
      } else if (pendingUsers.some(u => u.email === email)) {
        alert("Your account is still pending TPO approval.");
      } else {
        alert("Account not found. Please sign up first.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white border-4 border-black p-8 w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        
        <div className="text-center mb-8 border-b-4 border-black pb-6">
          <h1 className="text-3xl font-black uppercase tracking-widest mb-2">PlacementPro</h1>
          <p className="text-gray-600 font-bold text-sm">
            {isSignUp ? 'Create Account' : 'Secure Login Portal'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Email</label>
            <input 
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-black p-3 font-bold focus:outline-none focus:bg-gray-100"
              placeholder="name@college.edu" required
            />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Password</label>
            <input 
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-black p-3 font-bold focus:outline-none focus:bg-gray-100"
              placeholder="••••••••" required
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Select Role</label>
              <select 
                value={selectedRole} onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full border-2 border-black p-3 font-bold bg-white focus:outline-none focus:bg-gray-100"
              >
                <option value="STUDENT">Student (Needs Approval)</option>
                <option value="RECRUITER">Recruiter (Needs Approval)</option>
                <option value="TPO">TPO Admin (Instant Access)</option>
              </select>
            </div>
          )}

          <button type="submit" className="w-full bg-black text-white border-2 border-black font-bold py-3 uppercase tracking-wide hover:bg-gray-800 transition-colors mt-4">
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <div className="text-center">
          <button 
            type="button" 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm font-bold uppercase underline hover:text-gray-600"
          >
            {isSignUp ? 'Back to Login' : 'Need access? Sign up here'}
          </button>
        </div>
      </div>
    </div>
  );
}