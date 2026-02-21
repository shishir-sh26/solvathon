import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocketAuth } from '../../hooks/useWebSocketAuth';
import type { UserRole } from '../../hooks/useWebSocketAuth';

export default function Auth() {
  const { approvedUsers, pendingUsers, requestAccess, directRegister } = useWebSocketAuth();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("--- SUBMIT TRIGGERED ---");

    if (!email) return alert("Please enter an email address.");

    if (isSignUp) {
      const exists = [...approvedUsers, ...pendingUsers].some(u => u.email === email);
      if (exists) return alert("This email is already registered.");

      if (selectedRole === 'TPO') {
        directRegister(email, 'TPO');

        // 1. Save to localStorage
        localStorage.setItem('currentUserRole', 'TPO');
        localStorage.setItem('currentUserId', email);

        // 2. DISPATCH CUSTOM EVENT (Forces App.tsx to wake up)
        window.dispatchEvent(new Event('login-success'));

        alert("TPO Account created! Redirecting...");
        navigate('/tpo');
      } else {
        requestAccess(email, selectedRole);
        alert(`Request sent! Please wait for TPO approval.`);
        setIsSignUp(false);
      }
    } else {
      // LOGIN LOGIC
      const user = approvedUsers.find(u => u.email === email);

      if (user) {
        if (user.role !== selectedRole) {
          return alert(`Oops! Registered as ${user.role}, not ${selectedRole}.`);
        }

        console.log("Success! Updating storage and firing event...");

        // 1. Save to localStorage
        localStorage.setItem('currentUserRole', user.role);
        localStorage.setItem('currentUserId', user.email);

        // 2. DISPATCH CUSTOM EVENT (This fixes the redirect lag)
        window.dispatchEvent(new Event('login-success'));

        // 3. Navigate
        navigate(`/${user.role.toLowerCase()}`);

      } else if (pendingUsers.some(u => u.email === email)) {
        alert("Your account is still pending TPO approval.");
      } else {
        alert("Account not found. Please sign up.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white border-4 border-black p-8 w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-center mb-8 border-b-4 border-black pb-6">
          <h1 className="text-3xl font-black uppercase tracking-widest mb-2">PlacementPro</h1>
          <p className="text-gray-600 font-bold text-sm">
            {isSignUp ? 'Create New Account' : 'Member Login'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-bold uppercase mb-1">I am a...</label>
            <select
              value={selectedRole} onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full border-2 border-black p-3 font-bold bg-white focus:outline-none focus:bg-yellow-50"
            >
              <option value="STUDENT">Student</option>
              <option value="RECRUITER">Recruiter</option>
              <option value="TPO">TPO / Admin</option>
            </select>
          </div>

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

          <button type="submit" className="w-full bg-black text-white border-2 border-black font-bold py-3 uppercase tracking-wide hover:bg-gray-800 transition-colors mt-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-1">
            {isSignUp ? 'Register' : 'Sign In'}
          </button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm font-bold uppercase underline hover:text-gray-600"
          >
            {isSignUp ? 'Back to Login' : 'New here? Request Access'}
          </button>
        </div>
      </div>
    </div>
  );
}