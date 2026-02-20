import { useState } from 'react';
import { Users, FileCheck, BarChart, Send, CheckSquare, XSquare } from 'lucide-react';
// import ChatWindow from '../../placement-bot/components/ChatWindow'; // Uncomment if you want the bot here too

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
  const [activeTab, setActiveTab] = useState<'pipeline' | 'docs' | 'reports'>('pipeline');
  const [candidates, setCandidates] = useState(mockCandidates);

  const handleNotify = (target: 'Student' | 'TPO') => {
    alert(`System Jarvis: Notification sent to ${target}s regarding upcoming interview slots.`);
  };

  const verifyDocs = (id: number) => {
    setCandidates(candidates.map(c => c.id === id ? { ...c, docsVerified: true } : c));
    alert("Documents verified successfully.");
  };

  return (
    <>
      <div className="p-6 bg-white text-black border-2 border-black font-sans">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 border-b-2 border-black pb-4 gap-4">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-wider">Recruiter Portal</h2>
            <p className="text-gray-600 mt-1 font-bold">Company: TechNova Global • Active Drive: Software Engineer Intern</p>
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
                    <th className="p-3 border-r border-black font-bold">AI Match Score</th>
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
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">{c.matchScore}%</span>
                          {/* Visual progress bar */}
                          <div className="w-24 h-2 bg-gray-300 border border-black overflow-hidden">
                            <div className="h-full bg-black" style={{ width: `${c.matchScore}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 border-r border-gray-300 text-sm">{c.skills.join(', ')}</td>
                      <td className="p-3 border-r border-gray-300 text-center">
                        {c.docsVerified ? <span className="text-xs bg-black text-white px-2 py-1 uppercase font-bold">Verified</span> : <span className="text-xs border border-black px-2 py-1 uppercase font-bold text-gray-500">Pending</span>}
                      </td>
                      <td className="p-3 text-center">
                        <select className="border-2 border-black p-1 text-sm font-bold bg-white focus:outline-none">
                          <option value="Applied" selected={c.status === 'Applied'}>Applied</option>
                          <option value="Shortlisted" selected={c.status === 'Shortlisted'}>Shortlist</option>
                          <option value="Interview" selected={c.status === 'Interview'}>Schedule Interview</option>
                          <option value="Selected" selected={c.status === 'Selected'}>Select / Hire</option>
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
                <div key={c.id} className="border-2 border-black p-4 flex justify-between items-center bg-gray-50">
                  <div>
                    <h4 className="font-bold">{c.name}</h4>
                    <p className="text-sm text-gray-600">Resume.pdf • 10th_Marksheet.pdf • ID_Proof.jpg</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 border border-black hover:bg-gray-200" title="Reject"><XSquare size={20} /></button>
                    <button onClick={() => verifyDocs(c.id)} className="p-2 bg-black text-white border border-black hover:bg-gray-800" title="Verify Docs"><CheckSquare size={20} /></button>
                  </div>
                </div>
              ))}
              {candidates.filter(c => !c.docsVerified).length === 0 && (
                <p className="text-gray-500 font-bold p-4 border-2 border-dashed border-gray-400">No pending documents to verify.</p>
              )}
            </div>
          </div>
        )}

        {/* --- TAB CONTENT: HISTORICAL REPORTS --- */}
        {activeTab === 'reports' && (
          <div className="animate-in fade-in duration-300 flex flex-col md:flex-row gap-6">
            <div className="flex-1 border-2 border-black p-4">
              <h3 className="font-bold text-lg mb-4 border-b border-black inline-block">Hiring Trends (TechNova Global)</h3>
              <table className="w-full text-left border-collapse mt-2">
                <thead>
                  <tr className="bg-gray-200 border-b-2 border-black">
                    <th className="p-2 border-r border-black font-bold">Year</th>
                    <th className="p-2 border-r border-black font-bold text-center">Students Hired</th>
                    <th className="p-2 border-r border-black font-bold">Avg CTC</th>
                    <th className="p-2 font-bold">Top Branch</th>
                  </tr>
                </thead>
                <tbody>
                  {mockHistoricalData.map(data => (
                    <tr key={data.year} className="border-b border-gray-300">
                      <td className="p-2 border-r border-gray-300 font-bold">{data.year}</td>
                      <td className="p-2 border-r border-gray-300 text-center text-lg">{data.hired}</td>
                      <td className="p-2 border-r border-gray-300">{data.avgCtc}</td>
                      <td className="p-2">{data.topBranch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex-1 border-2 border-black p-6 flex flex-col justify-center items-center text-center bg-gray-50">
              <BarChart size={48} className="mb-4 text-gray-400" />
              <h4 className="font-bold text-xl mb-2">Analytics Engine</h4>
              <p className="text-sm text-gray-600 mb-4">Connect to the backend to generate visual charts comparing your hires against overall campus averages.</p>
              <button className="border-2 border-black px-6 py-2 font-bold hover:bg-black hover:text-white transition-colors">
                Generate Full PDF Report
              </button>
            </div>
          </div>
        )}

      </div>
      {/* <ChatWindow /> // Add this if you want the recruiter to also have access to the bot from within this component file */}
    </>
  );
}