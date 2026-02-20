import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Check, X, Bell } from 'lucide-react';
// Verify this path to your ChatWindow component!
import ChatWindow from '../placement-bot/components/ChatWindow';

// --- Extended Mock Data ---
const mockStudents = [
  { id: 1, name: 'Alex Johnson', usn: '1RV21CS001', branch: 'CS', cgpa: 8.5, email: 'alex@college.edu', phone: '9876543210', skills: ['React', 'Node'] },
  { id: 2, name: 'Priya Sharma', usn: '1RV21IS045', branch: 'IS', cgpa: 7.2, email: 'priya@college.edu', phone: '9123456780', skills: ['Python', 'SQL'] },
  { id: 3, name: 'Rahul Verma', usn: '1RV21EC089', branch: 'EC', cgpa: 6.8, email: 'rahul@college.edu', phone: '9988776655', skills: ['C++', 'IoT'] },
  { id: 4, name: 'Neha Gupta', usn: '1RV21CS112', branch: 'CS', cgpa: 9.1, email: 'neha@college.edu', phone: '9112233445', skills: ['Java', 'Spring Boot'] },
];

export default function TPODashboard() {
  // Global Store: Pulling the approval actions from Zustand
  const { pendingUsers, approveUser, rejectUser } = useAppStore();

  // Local Filter & Scheduling States
  const [minCgpa, setMinCgpa] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [interviewDate, setInterviewDate] = useState('');

  // 1. Calculate Eligibility Dynamically
  const processedStudents = mockStudents.map(student => {
    const meetsCgpa = minCgpa ? student.cgpa >= parseFloat(minCgpa) : true;
    const meetsBranch = branchFilter ? student.branch.toLowerCase().includes(branchFilter.toLowerCase()) : true;
    const isEligible = meetsCgpa && meetsBranch;
    return { ...student, isEligible };
  });

  const eligibleCount = processedStudents.filter(s => s.isEligible).length;

  // 2. Action Handlers
  const handleNotify = () => {
    if (eligibleCount === 0) return alert('No eligible students to notify based on current filters.');
    alert(`System Jarvis: Sending drive notifications to exactly ${eligibleCount} ELIGIBLE students.`);
  };

  const handleSchedule = () => {
    if (!interviewDate) return alert('Please select a date from the calendar first.');
    if (eligibleCount === 0) return alert('No eligible students found for this schedule.');
    alert(`Interview scheduled for ${eligibleCount} eligible students on ${interviewDate}.`);
  };

  return (
    <>
      <div className="p-6 bg-white text-black border-4 border-black font-sans shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        
        {/* --- SECTION 1: NOTIFICATIONS & SIGN-IN APPROVALS --- */}
        {pendingUsers.length > 0 ? (
          <div className="mb-8 border-4 border-black p-4 bg-gray-100">
            <h3 className="font-black uppercase tracking-widest border-b-4 border-black pb-2 mb-4 flex items-center gap-2">
              <Bell size={20} /> Action Required: Sign-In Approvals ({pendingUsers.length})
            </h3>
            <div className="space-y-3">
              {pendingUsers.map(user => (
                <div key={user.email} className="flex justify-between items-center border-2 border-black p-3 bg-white">
                  <div>
                    <span className="font-bold">{user.email}</span>
                    <span className="ml-3 text-xs bg-black text-white px-2 py-1 uppercase tracking-wide font-bold">Requested: {user.role}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => rejectUser(user.email)} className="p-2 border-2 border-black hover:bg-gray-200 transition-colors" title="Reject Request">
                      <X size={18} />
                    </button>
                    <button onClick={() => approveUser(user.email)} className="p-2 bg-black text-white border-2 border-black hover:bg-gray-800 transition-colors" title="Approve Request">
                      <Check size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-8 border-2 border-dashed border-gray-400 p-4 text-center text-gray-500 font-bold uppercase text-sm">
            No pending sign-in requests at this time.
          </div>
        )}

        {/* --- SECTION 2: DRIVE CONTROL HEADER --- */}
        <div className="mb-6 border-b-4 border-black pb-4">
          <h2 className="text-3xl font-black uppercase tracking-wider">Placement Drive Control</h2>
          <p className="text-gray-700 mt-1 font-bold">Filter candidates, schedule interviews, and notify eligible students.</p>
        </div>

        {/* --- SECTION 3: CRITERIA ENGINE & SCHEDULER --- */}
        <div className="flex flex-col md:flex-row gap-6 mb-8 p-4 border-4 border-black bg-gray-50">
          
          {/* Filter Panel */}
          <div className="flex-1 space-y-3">
            <h3 className="font-bold text-lg uppercase border-b-2 border-black pb-1">1. Filter Eligibility</h3>
            <div className="flex gap-4">
              <label className="flex flex-col text-sm font-bold uppercase w-1/2">
                Min CGPA Cutoff
                <input 
                  type="number" step="0.1" value={minCgpa} onChange={(e) => setMinCgpa(e.target.value)} 
                  className="mt-1 border-2 border-black p-2 bg-white focus:bg-gray-100 outline-none" placeholder="e.g. 7.0"
                />
              </label>
              <label className="flex flex-col text-sm font-bold uppercase w-1/2">
                Target Branch
                <input 
                  type="text" value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} 
                  className="mt-1 border-2 border-black p-2 bg-white focus:bg-gray-100 outline-none" placeholder="e.g. CS"
                />
              </label>
            </div>
          </div>

          {/* Scheduler Panel */}
          <div className="flex-1 space-y-3 border-t-4 md:border-t-0 md:border-l-4 border-black pt-4 md:pt-0 md:pl-6">
            <h3 className="font-bold text-lg uppercase border-b-2 border-black pb-1">2. Schedule Interview</h3>
            <div className="flex flex-col gap-3">
              <input 
                type="datetime-local" value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)} 
                className="border-2 border-black p-2 bg-white text-sm font-bold outline-none"
              />
              <button onClick={handleSchedule} className="bg-black text-white font-bold py-2 px-4 uppercase tracking-widest hover:bg-gray-800 transition-colors border-2 border-black">
                Confirm Schedule
              </button>
            </div>
          </div>
        </div>

        {/* --- SECTION 4: STUDENT DATABASE & NOTIFY BUTTON --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-4">
          <h3 className="font-black text-xl uppercase">Student Database</h3>
          <button 
            onClick={handleNotify} 
            className="bg-white text-black border-4 border-black font-black py-3 px-6 uppercase hover:bg-gray-200 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 active:translate-x-1"
          >
            Notify {eligibleCount} Eligible Students
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border-4 border-black bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white border-b-4 border-black">
                <th className="p-3 border-r-2 border-gray-600 font-bold uppercase tracking-wider text-sm">USN</th>
                <th className="p-3 border-r-2 border-gray-600 font-bold uppercase tracking-wider text-sm">Name</th>
                <th className="p-3 border-r-2 border-gray-600 font-bold uppercase tracking-wider text-sm">Branch / CGPA</th>
                <th className="p-3 border-r-2 border-gray-600 font-bold uppercase tracking-wider text-sm">Contact</th>
                <th className="p-3 border-r-2 border-gray-600 font-bold uppercase tracking-wider text-sm">Top Skills</th>
                <th className="p-3 font-bold uppercase tracking-wider text-sm text-center">Eligibility</th>
              </tr>
            </thead>
            <tbody>
              {processedStudents.map((student) => (
                <tr key={student.id} className="border-b-2 border-black hover:bg-gray-100 transition-colors">
                  <td className="p-3 border-r-2 border-black font-mono text-sm font-bold">{student.usn}</td>
                  <td className="p-3 border-r-2 border-black font-bold">{student.name}</td>
                  <td className="p-3 border-r-2 border-black font-bold">
                    {student.branch} <br/> <span className="text-gray-600 text-xs">CGPA: {student.cgpa}</span>
                  </td>
                  <td className="p-3 border-r-2 border-black text-sm font-bold text-gray-700">
                    <div>{student.email}</div>
                    <div>{student.phone}</div>
                  </td>
                  <td className="p-3 border-r-2 border-black text-sm font-bold text-gray-700">
                    {student.skills.join(', ')}
                  </td>
                  <td className="p-3 text-center">
                    {student.isEligible ? (
                      <span className="bg-black text-white px-3 py-1 text-xs uppercase font-black tracking-widest border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]">
                        Eligible
                      </span>
                    ) : (
                      <span className="bg-white text-gray-400 px-3 py-1 text-xs uppercase font-bold tracking-widest border-2 border-gray-300">
                        Excluded
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* --- GLOBAL CHATBOT INJECTED HERE --- */}
      {/* This ensures the Chat Window is always available on the TPO screen */}
      <ChatWindow />
    </>
  );
}