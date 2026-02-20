import { Routes, Route, Link } from 'react-router-dom'
import StudentPage from './pages/StudentPage'
import TpoPage from './pages/TpoPage'
import RecruiterPage from './pages/RecruiterPage'
import Auth from './features/auth/Auth'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Global Navigation Bar */}
      <nav className="bg-blue-900 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-wider">PLACEMENT PRO</h1>
          <div className="space-x-4">
            <Link to="/" className="hover:text-blue-300">Login</Link>
            <Link to="/student" className="hover:text-blue-300">Student Portal</Link>
            <Link to="/tpo" className="hover:text-blue-300">TPO Dashboard</Link>
            <Link to="/recruiter" className="hover:text-blue-300">Recruiter</Link>
          </div>
        </div>
      </nav>

      {/* Page Routing */}
      <main className="container mx-auto p-4 mt-4">
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/student" element={<StudentPage />} />
          <Route path="/tpo" element={<TpoPage />} />
          <Route path="/recruiter" element={<RecruiterPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App