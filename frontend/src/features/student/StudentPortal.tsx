import { useState } from 'react';import { 
  Bell, Search, User, Briefcase, Video, FileText, 
  Youtube, TrendingUp, CheckCircle, Users, Calendar as CalendarIcon, UploadCloud, ChevronRight
} from 'lucide-react';

// Import the Chatbot you just created!
import StudentChatBot from './components/StudentChatBot';

export default function StudentPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data (We will replace this with Supabase data later)
  const scheduledDates = [12, 18, 24]; 
  const studentData = {
    name: "ALEX JOHNSON",
    usn: "1RV21CS001",
    branch: "CS",
    cgpa: 8.5,
    skills: ["React", "Node.js", "MongoDB"]
  };

  const navItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: CalendarIcon },
    { id: 'placements', label: 'PLACEMENTS', icon: Briefcase },
    { id: 'applications', label: 'APPLICATION TRACK', icon: CheckCircle },
    { id: 'interviews', label: 'VIRTUAL INTERVIEWS', icon: Video },
    { id: 'resume', label: 'ATS RESUME BUILDER', icon: FileText },
    { id: 'skills', label: 'SKILL IMPROVEMENT', icon: TrendingUp },
    { id: 'learning', label: 'LEARN & GROW', icon: Youtube },
    { id: 'mentors', label: 'ALUMNI MENTORS', icon: Users },
    { id: 'upload', label: 'VERIFY CREDENTIALS', icon: UploadCloud },
  ];

  return (
    <div className="flex h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      
      {/* ================= SIDEBAR (BRUTALIST) ================= */}
      <aside className="w-72 bg-white border-r-4 border-black flex flex-col z-20">
        <div className="h-20 flex items-center px-6 border-b-4 border-black bg-yellow-300">
          <h1 className="text-2xl font-black uppercase tracking-widest">PlacementPro</h1>
        </div>
        
        {/* User Profile Snippet in Sidebar */}
        <div className="p-6 border-b-4 border-black bg-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white border-2 border-black">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-sm">{studentData.name}</p>
              <p className="text-xs font-mono font-bold text-gray-600">{studentData.usn} | {studentData.branch}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-6 py-4 text-left border-b-2 border-black transition-all ${
                    activeTab === item.id 
                      ? 'bg-black text-white font-black pl-8' 
                      : 'hover:bg-gray-200 font-bold text-gray-800'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className={`w-5 h-5 mr-3 ${activeTab === item.id ? 'text-yellow-400' : 'text-black'}`} />
                    <span className="tracking-wider text-sm">{item.label}</span>
                  </div>
                  {activeTab === item.id && <ChevronRight className="w-5 h-5" />}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 flex flex-col overflow-hidden bg-gray-50 relative">
        
        {/* TOP NAVIGATION */}
        <header className="h-20 bg-white border-b-4 border-black flex items-center justify-between px-8 z-10 sticky top-0">
          {/* Search Bar */}
          <div className="relative w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
            <input 
              type="text" 
              placeholder="SEARCH JOBS, SKILLS, MENTORS..." 
              className="w-full pl-10 pr-4 py-3 border-2 border-black bg-gray-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all font-bold text-sm uppercase tracking-wide placeholder-gray-500"
            />
          </div>

          {/* Right Side: Notifications */}
          <div className="flex items-center space-x-6">
            <button className="relative p-2 border-2 border-black hover:bg-yellow-300 transition-colors">
              <Bell className="w-6 h-6 text-black" />
              {/* Notification Badge */}
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold px-2 py-0.5 border-2 border-white">3</span>
            </button>
          </div>
        </header>

        {/* DYNAMIC VIEWS */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          
          {/* VIEW: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 max-w-7xl mx-auto">
              
              <div className="flex justify-between items-end border-b-4 border-black pb-4">
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-wider">Student Headquarters</h2>
                  <p className="text-gray-600 mt-2 font-bold uppercase">Overview of your placement journey.</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold uppercase">Current CGPA</p>
                  <p className="text-3xl font-black">{studentData.cgpa}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* CALENDAR WIDGET */}
                <div className="lg:col-span-2 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                  <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-2">
                    <h3 className="font-black text-xl uppercase tracking-wide flex items-center">
                      <CalendarIcon className="mr-2 w-6 h-6"/> Interview Schedule
                    </h3>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {['SUN','MON','TUE','WED','THU','FRI','SAT'].map(day => (
                      <div key={day} className="font-black text-xs uppercase bg-gray-200 py-2 border-2 border-black">{day}</div>
                    ))}
                    {Array.from({length: 30}, (_, i) => i + 1).map(day => {
                      const isInterview = scheduledDates.includes(day);
                      return (
                        <div 
                          key={day} 
                          className={`p-2 border-2 border-black font-bold h-16 flex flex-col items-center justify-center transition-all ${
                            isInterview 
                              ? 'bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-y-1' 
                              : 'bg-white hover:bg-gray-100'
                          }`}
                        >
                          <span className={isInterview ? 'text-lg font-black' : 'text-sm'}>{day}</span>
                          {isInterview && <span className="text-[9px] font-black uppercase mt-1 bg-black text-white px-1">Interview</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* STATS & ACTIONS WIDGET */}
                <div className="flex flex-col space-y-6">
                  <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="font-black text-lg uppercase border-b-2 border-black pb-2 mb-4">Quick Stats</h3>
                    <div className="space-y-3 font-bold">
                      <div className="flex justify-between items-center border-b border-dashed border-gray-400 pb-2">
                        <span>Eligible Drives</span> <span className="text-2xl font-black bg-black text-white px-2">12</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-dashed border-gray-400 pb-2">
                        <span>Applications</span> <span className="text-2xl font-black">4</span>
                      </div>
                      <div className="flex justify-between items-center pb-2">
                        <span>Skill Match</span> <span className="text-xl font-black text-green-600">85%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-600 text-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
                    <h3 className="font-black text-xl uppercase mb-2">Needs Attention</h3>
                    <p className="text-sm font-bold opacity-90 mb-4">You are missing 'PowerBI' for the upcoming Data Analyst roles.</p>
                    <button className="bg-white text-black font-black uppercase text-sm py-2 px-4 border-2 border-black w-full hover:bg-yellow-300 transition-colors">
                      View Skill Gap Analysis
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* VIEW: PLACEMENTS (Eligible Companies) */}
          {activeTab === 'placements' && (
            <div className="max-w-5xl mx-auto">
              <div className="mb-8 border-b-4 border-black pb-4">
                <h2 className="text-4xl font-black uppercase tracking-wider">Eligible Drives</h2>
                <p className="font-bold text-gray-600 uppercase mt-2">Companies matching your profile criteria.</p>
              </div>

              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6">
                <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-black uppercase">TCS Digital</h3>
                    <p className="font-bold text-gray-700">Software Engineer • 7.0 CGPA Cutoff</p>
                  </div>
                  <div className="text-right">
                    <span className="bg-green-400 text-black border-2 border-black font-black text-xs uppercase px-3 py-1">Highly Matched</span>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-sm font-bold text-gray-500 max-w-2xl">Required: React, Node.js, System Design. Last date to apply: Oct 25th.</p>
                  <button className="bg-black text-white font-black uppercase tracking-wider py-3 px-8 hover:bg-yellow-400 hover:text-black transition-colors border-2 border-transparent hover:border-black">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FALLBACK VIEW */}
          {!['dashboard', 'placements'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-black border-4 border-black border-dashed bg-white">
              <TrendingUp className="w-20 h-20 mb-6 text-gray-300" />
              <h2 className="text-3xl font-black uppercase text-center max-w-md">
                THE {navItems.find(i => i.id === activeTab)?.label} MODULE IS IN DEVELOPMENT
              </h2>
            </div>
          )}

        </div>
      </main>

      {/* Injecting the Student Chatbot Component here */}
      <StudentChatBot />
      
    </div>
  );
}