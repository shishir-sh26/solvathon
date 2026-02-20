import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';

import Auth from './features/auth/Auth';
import Layout from './shared/components/Layout';
import StudentPage from './pages/StudentPage';
import TpoPage from './pages/TpoPage';
import RecruiterPage from './pages/RecruiterPage';

function App() {
  // Check the global login status
  const { userRole } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Routes>
        {/* PUBLIC ROUTE: The Login Screen */}
        <Route 
          path="/" 
          element={userRole ? <Navigate to={`/${userRole.toLowerCase()}`} /> : <Auth />} 
        />

        {/* PROTECTED ROUTES: Only accessible if logged in */}
        <Route 
          path="/student" 
          element={userRole === 'STUDENT' ? <Layout><StudentPage /></Layout> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/tpo" 
          element={userRole === 'TPO' ? <Layout><TpoPage /></Layout> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/recruiter" 
          element={userRole === 'RECRUITER' ? <Layout><RecruiterPage /></Layout> : <Navigate to="/" />} 
        />
        
        {/* Fallback for unknown URLs */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;