import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, FileCheck, BarChart, Send, CheckSquare, XSquare, 
  LogOut, Search, Loader2 
} from 'lucide-react';

// --- MOCK DATA ---
const mockCandidates = [
  { id: 1, name: 'Alex Johnson', branch: 'CS', matchScore: 92, status: 'Shortlisted', docsVerified: true, skills: ['React', 'Node', 'TypeScript'] },
  { id: 2, name: 'Priya Sharma', branch: 'IS', matchScore: 85, status: 'Applied', docsVerified: false, skills: ['Python', 'Django', 'SQL'] },
  { id: 3, name: 'Rahul Verma', branch: 'EC', matchScore: 68, status: 'Interview', docsVerified: true, skills: ['C++', 'IoT', 'Embedded'] },
];

const mockHistoricalData = [
  { year: '2023', hired: 15, avgCtc: '12 LPA', topBranch: 'CS' },
  { year: '2024', hired: 22, avgCtc: '14 LPA', topBranch: 'IS' },
  { year: '2025', hired: 18, avgCtc: '15 LPA', topBranch: 'CS' },
];

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pipeline' | 'docs' | 'reports'>('pipeline');
  const [candidates, setCandidates] = useState(mockCandidates);
  
  // Search & Matching Engine State
  const [searchQuery, setSearchQuery] = useState('');
  const [isMatching, setIsMatching] = useState(false);

  // --- LOGOUT HANDLER ---
  const handleLogout = () => {
    localStorage.removeItem('currentUserRole');
    window.dispatchEvent(new Event('logout'));
    navigate('/');
  };

  // --- MATCHING ENGINE INTEGRATION ---
  // This connects to the matching_engine.py via your FastAPI backend
  const handleMatchSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsMatching(true);
    try {
      // API call to the backend which uses matching_engine.py
      const response = await fetch(`http://localhost:8000/api/recruiter/match?job_description=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error("Matching engine failed");
      
      const result = await response.json();
      // Assuming result returns a list of matched students from your dummy dataset
      if (result.matches) {
        setCandidates(result.matches);
      }
      alert("AI Matching Engine: Students re-ranked based on your requirements.");
    } catch (error) {
      console.error("Match error:", error);
      alert("Error connecting to Matching Engine. Using local filters.");
    } finally {
      setIsMatching(false);
    }
  };

  const handleNotify = (target: 'Student' | 'TPO') => {
    alert(`System Jarvis: Notification sent to ${target}s regarding upcoming interview slots.`);
  };

  const verifyDocs = (id: number) => {
    setCandidates(candidates.map(c => c.id === id ? { ...c, docsVerified: true } : c));
    alert("Documents verified successfully.");
  };

  return (
    <>
      {/* Top Header Section with Logout and Search */}
      <div className="bg-black text-white p-4 border-b-4 border-yellow-400 flex items-center justify-between sticky top-0 z-50">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 border-2 border-white font-black text-xs uppercase transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] active:translate-y-1 active:shadow-none"
        >
          <LogOut size={16} /> Logout
        </button>

        <form onSubmit={handleMatchSearch} className="relative w-1/2 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
            <input 
              type="text" 
              placeholder="PASTE JOB DESCRIPTION TO MATCH CANDIDATES..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-white bg-gray-100 text-black focus:outline-none focus:ring-4 focus:ring-yellow-400 font-bold text-xs uppercase" 
            />
          </div>
          <button 
            type="submit" 
            disabled={isMatching}
            className="bg-yellow-400 text-black px-4 py-2 font-black text-xs uppercase border-2 border-white hover:bg-yellow-300 disabled:opacity-50 flex items-center gap-2"
          >
            {isMatching ? <Loader2 className="animate-spin" size={16} /> : "Match AI"}
          </button>
        </form>
      </div>

      <div className="p-6 bg-white text-black border-2 border-black font-sans">
        
        {/* Header Info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 border-b-2 border-black pb-4 gap-4">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-wider">Recruiter Portal</h2>
            <p className="text-gray-700 mt-1 font-bold">Company: TechNova Global • Active Drive: Software Engineer Intern</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleNotify('TPO')} className="bg-white border-2 border-black px-4 py-2 font-bold text-sm hover:bg-gray-100 flex items-center gap-2">
              <Send size={16} /> Notify TPO
            </button>
            <button onClick={() => handleNotify('Student')} className="bg-black text-white border-2 border-black px-4 py-2 font-bold text-sm hover:bg-gray-800 flex items-center gap-2">
              <Send size={16} /> Notify Students
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b-4 border-black mb-6">
          <button 
            onClick={() => setActiveTab('pipeline')}
            className={`flex-1 py-3 font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-colors ${activeTab === 'pipeline' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
          >
            <Users size={18} /> Candidate Pipeline
          </button>
          <button 
            onClick={() => setActiveTab('docs')}
            className={`flex-1 py-3 font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-colors border-l-4 border-black ${activeTab === 'docs' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
          >
            <FileCheck size={18} /> Document Verification
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`flex-1 py-3 font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-colors border-l-4 border-black ${activeTab === 'reports' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
          >
            <BarChart size={18} /> Historical Reports
          </button>
        </div>

        {/* --- TAB CONTENT: PIPELINE --- */}
        {activeTab === 'pipeline' && (
          <div className="animate-in fade-in duration-300">
            <h3 className="font-bold text-lg mb-4 border-b border-black inline-block">Matching & Shortlisting</h3>
            <div className="overflow-x-auto border-2 border-black">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200 border-b-2 border-black">
                    <th className="p-3 border-r border-black font-bold">Candidate</th>
                    <th className="p-3 border-r border-black font-bold text-center">AI Match Score</th>
                    <th className="p-3 border-r border-black font-bold">Skills</th>
                    <th className="p-3 border-r border-black font-bold text-center">Docs Status</th>
                    <th className="p-3 font-bold text-center">Pipeline Action</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((c) => (
                    <tr key={c.id} className="border-b border-gray-300 hover:bg-gray-50">
                      <td className="p-3 border-r border-gray-300 font-bold">{c.name} <br/><span className="text-xs text-gray-500 font-normal">{c.branch}</span></td>
                      <td className="p-3 border-r border-gray-300">
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-black text-lg">{c.matchScore}%</span>
                          <div className="w-full h-2 bg-gray-300 border border-black overflow-hidden">
                            <div className="h-full bg-black transition-all duration-500" style={{ width: `${c.matchScore}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 border-r border-gray-300 text-sm font-medium">{c.skills.join(', ')}</td>
                      <td className="p-3 border-r border-gray-300 text-center">
                        {c.docsVerified ? <span className="text-[10px] bg-black text-white px-2 py-1 uppercase font-black">Verified</span> : <span className="text-[10px] border border-black px-2 py-1 uppercase font-bold text-gray-500">Pending</span>}
                      </td>
                      <td className="p-3 text-center">
                        <select className="border-2 border-black p-1 text-xs font-bold bg-white focus:outline-none">
                          <option value="Applied">Applied</option>
                          <option value="Shortlisted">Shortlist</option>
                          <option value="Interview">Schedule Interview</option>
                          <option value="Selected">Select / Hire</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB CONTENT: DOCUMENT VERIFICATION --- */}
        {activeTab === 'docs' && (
          <div className="animate-in fade-in duration-300">
            <h3 className="font-bold text-lg mb-4 border-b border-black inline-block">Pending Verifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidates.filter(c => !c.docsVerified).map(c => (
                <div key={c.id} className="border-2 border-black p-4 flex justify-between items-center bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div>
                    <h4 className="font-black uppercase text-sm">{c.name}</h4>
                    <p className="text-xs text-gray-600 font-bold uppercase mt-1">Resume • 10th Marksheet • ID Proof</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 border-2 border-black hover:bg-red-200 transition-colors" title="Reject"><XSquare size={20} /></button>
                    <button onClick={() => verifyDocs(c.id)} className="p-2 bg-black text-white border-2 border-black hover:bg-gray-800 transition-colors" title="Verify Docs"><CheckSquare size={20} /></button>
                  </div>
                </div>
              ))}
              {candidates.filter(c => !c.docsVerified).length === 0 && (
                <p className="text-gray-500 font-bold p-4 border-2 border-dashed border-gray-400 w-full text-center">No pending documents to verify.</p>
              )}
            </div>
          </div>
        )}

        {/* --- TAB CONTENT: HISTORICAL REPORTS --- */}
        {activeTab === 'reports' && (
          <div className="animate-in fade-in duration-300 flex flex-col md:flex-row gap-6">
            <div className="flex-1 border-2 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-bold text-lg mb-4 border-b border-black inline-block uppercase">Hiring Trends</h3>
              <table className="w-full text-left border-collapse mt-2">
                <thead>
                  <tr className="bg-gray-200 border-b-2 border-black font-black uppercase text-xs">
                    <th className="p-2 border-r border-black">Year</th>
                    <th className="p-2 border-r border-black text-center">Hired</th>
                    <th className="p-2 border-r border-black">Avg CTC</th>
                    <th className="p-2">Top Branch</th>
                  </tr>
                </thead>
                <tbody>
                  {mockHistoricalData.map(data => (
                    <tr key={data.year} className="border-b border-gray-300 font-bold text-sm">
                      <td className="p-2 border-r border-gray-300">{data.year}</td>
                      <td className="p-2 border-r border-gray-300 text-center text-lg font-black">{data.hired}</td>
                      <td className="p-2 border-r border-gray-300">{data.avgCtc}</td>
                      <td className="p-2">{data.topBranch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex-1 border-2 border-black p-6 flex flex-col justify-center items-center text-center bg-yellow-50 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <BarChart size={48} className="mb-4 text-black" />
              <h4 className="font-black uppercase text-lg mb-2">Analytics Engine</h4>
              <p className="text-xs text-gray-700 font-bold uppercase mb-4">Generate predictive hiring reports based on your drive history.</p>
              <button className="bg-black text-white border-2 border-black px-6 py-2 font-black uppercase text-xs hover:bg-gray-800 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                Generate Full PDF Report
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}