// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Auth from './features/auth/Auth';
import StudentPage from './pages/StudentPage';
import TpoPage from './pages/TpoPage';
import RecruiterPage from './pages/RecruiterPage';

function App() {
  const [role, setRole] = useState<string | null>(localStorage.getItem('currentUserRole'));

  useEffect(() => {
    const syncRole = () => {
      setRole(localStorage.getItem('currentUserRole'));
    };

    window.addEventListener('login-success', syncRole);
    window.addEventListener('storage', syncRole);
    // Add a logout listener
    window.addEventListener('logout', syncRole);

    return () => {
      window.removeEventListener('login-success', syncRole);
      window.removeEventListener('storage', syncRole);
      window.removeEventListener('logout', syncRole);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* If no role, ALWAYS show Auth. If role exists, redirect to specific dashboard */}
        <Route 
          path="/" 
          element={!role ? <Auth /> : <Navigate to={`/${role.toLowerCase()}`} replace />} 
        />

        <Route 
          path="/student" 
          element={role === 'STUDENT' ? <StudentPage /> : <Navigate to="/" replace />} 
        />
        
        <Route 
          path="/tpo" 
          element={role === 'TPO' ? <TpoPage /> : <Navigate to="/" replace />} 
        />
        
        <Route 
          path="/recruiter" 
          element={role === 'RECRUITER' ? <RecruiterPage /> : <Navigate to="/" replace />} 
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;