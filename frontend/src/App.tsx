import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

import Layout from './shared/components/Layout';
import Auth from './features/auth/Auth';
import ChatWindow from './features/shared/placementBot/components/ChatWindow';
import AlumniConnect from './features/alumni-connect/AlumniConnect';
import MarketIntelligence from './features/analytics/MarketIntelligence';
import VirtualInterview from './features/interview/components/InterviewPanel';
import StudentPage from './pages/StudentPage';
import TpoPage from './pages/TpoPage';
import RecruiterPage from './pages/RecruiterPage';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout><div className="max-w-4xl mx-auto py-20 text-center"><h1 className="text-6xl font-extrabold text-gray-900 tracking-tight">Accelerate Your <span className="text-primary-600">Career</span> with AI</h1><p className="mt-8 text-xl text-gray-500 leading-relaxed">The ultimate ecosystem for TPOs, Students, and Alumni to drive placement success.</p><div className="mt-10 flex justify-center gap-4"><button className="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all">Get Started</button><button className="px-8 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all">Learn More</button></div></div></Layout>} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/tpo/*" element={<TpoPage />} />
          <Route path="/student/*" element={<StudentPage />} />
          <Route path="/recruiter" element={<RecruiterPage />} />
          <Route path="/alumni" element={<AlumniConnect />} />
          <Route path="/analytics" element={<MarketIntelligence />} />
          <Route path="/interview" element={<VirtualInterview />} />
        </Routes>
        <ChatWindow />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
