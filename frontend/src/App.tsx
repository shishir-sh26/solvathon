// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Auth from './features/auth/Auth';
import StudentPage from './pages/StudentPage';
import TpoPage from './pages/TpoPage';
import RecruiterPage from './pages/RecruiterPage';

function App() {
  // Pull initial role from localStorage
  const [role, setRole] = useState<string | null>(localStorage.getItem('currentUserRole'));

  useEffect(() => {
    const syncRole = () => {
      // Update local state when localStorage changes
      setRole(localStorage.getItem('currentUserRole'));
    };

    // Listen for custom events and browser storage sync
    window.addEventListener('login-success', syncRole);
    window.addEventListener('storage', syncRole);
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
        {/* PUBLIC ROUTE: If no role, show Auth. Otherwise, redirect to dashboard */}
        <Route 
          path="/" 
          element={!role ? <Auth /> : <Navigate to={`/${role.toLowerCase()}`} replace />} 
        />

        {/* PROTECTED ROUTES: Verify role before rendering page */}
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
        
        {/* Fallback for invalid paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;