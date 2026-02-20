import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState<'student' | 'tpo' | 'alumni'>('student');
    
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, call the backend /signup or /login
        // Mocking successful auth for now
        login({ email, fullName: fullName || email }, role);
        if (role === 'tpo') navigate('/tpo');
        else navigate('/student');
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                {isLogin ? 'Welcome Back' : 'Join Placement Pro'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input 
                            type="text" 
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 transition-all"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input 
                        type="email" 
                        required
                        className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input 
                        type="password" 
                        required
                        className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {!isLogin && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">I am a...</label>
                        <select 
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 transition-all"
                            value={role}
                            onChange={(e) => setRole(e.target.value as any)}
                        >
                            <option value="student">Student</option>
                            <option value="tpo">TPO (Officer)</option>
                            <option value="alumni">Alumni / Mentor</option>
                        </select>
                    </div>
                )}
                <button 
                    type="submit"
                    className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all shadow-lg"
                >
                    {isLogin ? 'Sign In' : 'Create Account'}
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-500">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-primary-600 font-semibold hover:underline"
                >
                    {isLogin ? 'Sign Up' : 'Log In'}
                </button>
            </p>
        </div>
    );
};

export default Auth;
