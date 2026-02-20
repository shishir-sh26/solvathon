import { useState, useEffect } from 'react';
import { useWebSocketAuth } from '../../hooks/useWebSocketAuth';
import { Check, X, Bell, LogOut, Search, Users, Briefcase, Calendar as CalendarIcon, Loader2 } from 'lucide-react'; 

export default function TPODashboard() {
  // --- REAL WEBSOCKET AUTH HOOK ---
  const { pendingUsers, approveUser, rejectUser } = useWebSocketAuth();

  // Local Filter & Scheduling States
  const [minCgpa, setMinCgpa] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  
  // --- General Search State ---
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- NEW: Backend Data State ---
  const [students, setStudents] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock Scheduled Interview Dates for the Calendar
  const scheduledDates = [12, 18, 24];

  // --- NEW: Fetch Students from Backend Engine ---
  useEffect(() => {
    const fetchStudents = async () => {
      setIsSearching(true);
      try {
        // Construct URL: If searchTerm exists, pass it to the backend
        const url = searchTerm 
          ? `http://localhost:8000/api/recruiter/tpo/students?search=${encodeURIComponent(searchTerm)}`
          : `http://localhost:8000/api/recruiter/tpo/students`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch students");
        
        const data = await response.json();
        // Map backend dummy dataset keys to frontend keys if needed
        const formattedStudents = data.students.map((s: any) => ({
          id: s.id,
          name: s.name,
          usn: `1RV21${s.branch}0${s.id}`, // Faking a USN since dummy data doesn't have it
          branch: s.branch,
          cgpa: (Math.random() * (9.5 - 6.5) + 6.5).toFixed(1), // Faking CGPA for dummy data
          email: `${s.name.split(' ')[0].toLowerCase()}@college.edu`,
          phone: '9876543210',
          skills: s.skills,
          matchScore: s.matchScore // From matching engine
        }));
        
        setStudents(formattedStudents);
      } catch (error) {
        console.error("Error fetching from matching engine:", error);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce the search so it doesn't hit the API on every single keystroke
    const delayDebounceFn = setTimeout(() => {
      fetchStudents();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]); // Re-run whenever searchTerm changes

  // 1. Calculate Eligibility Dynamically (Local Filters applied AFTER backend search)
  const processedStudents = students.map(student => {
    // Check strict eligibility criteria
    const meetsCgpa = minCgpa ? parseFloat(student.cgpa) >= parseFloat(minCgpa) : true;
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

  // 3. Functional Sign Out
  const handleLogout = () => {
    localStorage.removeItem('currentUserRole');
    window.dispatchEvent(new Event('login-success')); 
    window.location.href = "/";
  };

  return (
    <div className="p-6 bg-white text-black border-4 border-black font-sans shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-7xl mx-auto my-6">
      
      {/* --- TOP HEADER & LOGOUT --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b-4 border-black pb-4 gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-wider">TPO Command Center</h2>
          <p className="text-gray-700 mt-1 font-bold">Real-time Placement Management</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 border-2 border-black font-bold uppercase text-xs hover:bg-red-600 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* --- SECTION 1: CALENDAR & STATISTICS CARDS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* CALENDAR */}
        <div className="lg:col-span-2 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
          <h3 className="font-black text-xl uppercase tracking-wide flex items-center mb-6 border-b-2 border-black pb-2">
            <CalendarIcon className="mr-2 w-6 h-6"/> Interview & Drive Schedule
          </h3>
          <div className="grid grid-cols-7 gap-2 text-center">
            {['SUN','MON','TUE','WED','THU','FRI','SAT'].map(day => <div key={day} className="font-black text-xs uppercase bg-gray-200 py-2 border-2 border-black">{day}</div>)}
            {Array.from({length: 30}, (_, i) => i + 1).map(day => {
              const isInterview = scheduledDates.includes(day);
              return (
                <div key={day} className={`p-2 border-2 border-black font-bold h-16 flex flex-col items-center justify-center transition-all ${isInterview ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(253,224,71,1)] -translate-y-1' : 'bg-white hover:bg-gray-100'}`}>
                  <span className={isInterview ? 'text-lg font-black' : 'text-sm'}>{day}</span>
                  {isInterview && <span className="text-[9px] font-black uppercase mt-1 bg-yellow-300 text-black px-1 border border-black">Drive</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* STATS */}
        <div className="flex flex-col gap-6">
          <div className="bg-blue-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between flex-1">
              <div>
                <h3 className="font-black uppercase text-sm">Total Students</h3>
                <p className="text-4xl font-black">{students.length}</p>
              </div>
              <Users size={40} strokeWidth={3} />
          </div>
          <div className="bg-green-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between flex-1">
              <div>
                <h3 className="font-black uppercase text-sm">Active Drives</h3>
                <p className="text-4xl font-black">08</p>
              </div>
              <Briefcase size={40} strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* --- SECTION 2: WEBSOCKET SIGN-IN APPROVALS --- */}
      <div className="mb-8 border-4 border-black p-4 bg-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="font-black uppercase tracking-widest border-b-4 border-black pb-2 mb-4 flex items-center gap-2 text-red-600">
          <Bell size={20} /> Action Required: Sign-In Approvals ({pendingUsers.length})
        </h3>
        
        {pendingUsers.length === 0 ? (
          <p className="text-gray-500 font-bold italic uppercase text-sm text-center py-2">No pending sign-in requests at this time.</p>
        ) : (
          <div className="space-y-3">
            {pendingUsers.map(user => (
              <div key={user.email} className="flex justify-between items-center border-2 border-black p-3 bg-white">
                <div>
                  <span className="font-bold">{user.email}</span>
                  <span className="ml-3 text-xs bg-black text-white px-2 py-1 uppercase tracking-wide font-bold">Requested: {user.role}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => rejectUser(user.email)} 
                    className="p-2 border-2 border-black hover:bg-red-200 transition-colors" 
                    title="Reject Request"
                  >
                    <X size={18} />
                  </button>
                  <button 
                    onClick={() => approveUser(user.email)} 
                    className="p-2 bg-black text-white border-2 border-black hover:bg-green-500 transition-colors" 
                    title="Approve Request"
                  >
                    <Check size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- SECTION 3: CRITERIA ENGINE & SCHEDULER --- */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 p-4 border-4 border-black bg-gray-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        
        {/* Filter Panel */}
        <div className="flex-1 space-y-3">
          <h3 className="font-bold text-lg uppercase border-b-2 border-black pb-1 flex items-center gap-2">
             1. Filter Eligibility
          </h3>
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
              className="border-2 border-black p-2 bg-white text-sm font-bold outline-none cursor-pointer"
            />
            <button onClick={handleSchedule} className="bg-black text-white font-bold py-2 px-4 uppercase tracking-widest hover:bg-gray-800 transition-colors border-2 border-black">
              Confirm Schedule
            </button>
          </div>
        </div>
      </div>

      {/* --- SECTION 4: STUDENT DATABASE & SEARCH --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-4">
        
        {/* NEW: AI Search Bar */}
        <div className="flex-1 w-full max-w-md">
          <h3 className="font-black text-xl uppercase mb-2">Student Database</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="SEARCH BY SKILLS (Powered by AI Engine)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border-4 border-black font-bold uppercase tracking-wide outline-none focus:bg-yellow-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
            {isSearching && <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5 animate-spin" />}
          </div>
        </div>

        <button 
          onClick={handleNotify} 
          className="bg-white text-black border-4 border-black font-black py-3 px-6 uppercase hover:bg-yellow-300 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 active:translate-x-1"
        >
          Notify {eligibleCount} Eligible Students
        </button>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black text-white border-b-4 border-black">
              <th className="p-3 border-r-2 border-gray-600 font-bold uppercase tracking-wider text-sm">USN</th>
              <th className="p-3 border-r-2 border-gray-600 font-bold uppercase tracking-wider text-sm">Name</th>
              <th className="p-3 border-r-2 border-gray-600 font-bold uppercase tracking-wider text-sm">Branch / CGPA</th>
              <th className="p-3 border-r-2 border-gray-600 font-bold uppercase tracking-wider text-sm">Contact</th>
              <th className="p-3 border-r-2 border-gray-600 font-bold uppercase tracking-wider text-sm">Top Skills</th>
              {searchTerm && <th className="p-3 border-r-2 border-gray-600 font-bold uppercase tracking-wider text-sm text-center text-yellow-300">Match %</th>}
              <th className="p-3 font-bold uppercase tracking-wider text-sm text-center">Eligibility</th>
            </tr>
          </thead>
          <tbody>
            {processedStudents.length > 0 ? (
              processedStudents.map((student) => (
                <tr key={student.id} className="border-b-2 border-black hover:bg-yellow-50 transition-colors">
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
                  {searchTerm && (
                    <td className="p-3 border-r-2 border-black text-center font-black text-lg">
                      {student.matchScore}%
                    </td>
                  )}
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
              ))
            ) : (
              <tr>
                <td colSpan={searchTerm ? 7 : 6} className="p-6 text-center font-bold text-gray-500 uppercase tracking-widest">
                  No students found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}