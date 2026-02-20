import React, { useState } from 'react';
import {
  Bell, Search, User, Briefcase, Video, FileText,
  Youtube, TrendingUp, CheckCircle, Users, Calendar as CalendarIcon, UploadCloud,
  ChevronRight, LogOut, Settings, X, Target, ArrowRight, AlertCircle, Phone, Award, GraduationCap, Brain
} from 'lucide-react';

// Import your Chatbot component
import StudentChatBot from './components/StudentChatBot';
// --- NEW IMPORT: Bring in the Skill Suggestions Component ---
import SkillSuggestions from './components/SkillSuggestions';
import InterviewView from './components/InterviewView';

export default function StudentPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // STATE: Controls the massive profile edit modal
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  // Mock initial data
  const scheduledDates = [12, 18, 24];
  const studentData = {
    name: "ALEX JOHNSON",
    usn: "1RV21CS001",
    branch: "CS",
    cgpa: 8.5,
    backlogs: 0,
    skills: ["React", "Node.js", "MongoDB", "Python"]
  };

  // Form State for the Edit Modal
  const [formData, setFormData] = useState({
    fullName: studentData.name,
    usn: studentData.usn,
    dob: '',
    gender: '',
    email: 'alex@college.edu',
    phone: '',
    sslcPercentage: '',
    pucDiplomaPercentage: '',
    branch: studentData.branch,
    gradYear: '',
    cgpa: studentData.cgpa.toString(),
    backlogs: studentData.backlogs.toString(),
    skills: studentData.skills.join(', '),
    certifications: '',
  });

  // Mock ID for current development session
  const mockId = "00000000-0000-0000-0000-000000000000";

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/student/profile/${mockId}`);
        const result = await response.json();
        if (result.data) {
          const profile = result.data;
          setFormData({
            fullName: studentData.name, // Usually comes from user table
            usn: profile.roll_number || '',
            dob: profile.dob || '',
            gender: profile.gender || '',
            email: 'alex@college.edu',
            phone: profile.phone || '',
            sslcPercentage: profile.sslc_percentage?.toString() || '',
            pucDiplomaPercentage: profile.puc_percentage?.toString() || '',
            branch: profile.branch || '',
            gradYear: profile.graduation_year?.toString() || '',
            cgpa: profile.cgpa?.toString() || '',
            backlogs: profile.backlogs?.toString() || '0',
            skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : (profile.skills || ''),
            certifications: profile.certifications || '',
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    const cgpaNum = parseFloat(formData.cgpa);
    if (cgpaNum > 10 || cgpaNum < 0) {
      return alert("CGPA must be between 0 and 10.");
    }

    try {
      // Map frontend fields to backend schema
      const payload = {
        roll_number: formData.usn,
        dob: formData.dob,
        gender: formData.gender,
        phone: formData.phone,
        sslc_percentage: parseFloat(formData.sslcPercentage) || 0,
        puc_percentage: parseFloat(formData.pucDiplomaPercentage) || 0,
        branch: formData.branch,
        graduation_year: parseInt(formData.gradYear) || 2025,
        cgpa: cgpaNum,
        backlogs: parseInt(formData.backlogs) || 0,
        skills: formData.skills, // Backend will handle if string
        certifications: formData.certifications
      };

      // In a real app, 'id' comes from Auth. Using mock ID for now.
      const mockId = "00000000-0000-0000-0000-000000000000";

      const response = await fetch(`http://localhost:8000/api/student/profile/${mockId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const result = await response.json();
      console.log("Profile Saved:", result);
      alert("PROFILE VERIFIED & SAVED TO SUPABASE!");
      setIsEditProfileModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error saving profile. Please check if backend is running.");
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: CalendarIcon },
    { id: 'placements', label: 'PLACEMENTS', icon: Briefcase },
    { id: 'applications', label: 'APPLICATION TRACK', icon: CheckCircle },
    { id: 'interviews', label: 'VIRTUAL INTERVIEWS', icon: Video },
    { id: 'resume', label: 'ATS RESUME BUILDER', icon: FileText },
    { id: 'skills', label: 'SKILL IMPROVEMENT', icon: TrendingUp },
    { id: 'learning', label: 'LEARN & GROW', icon: Youtube }, // This is the trigger tab
    { id: 'mentors', label: 'ALUMNI MENTORS', icon: Users },
    { id: 'upload', label: 'VERIFY CREDENTIALS', icon: UploadCloud },
  ];

  const [isGeneratingResume, setIsGeneratingResume] = React.useState(false);

  const handleDownloadResume = async () => {
    setIsGeneratingResume(true);
    try {
      const response = await fetch(`http://localhost:8000/api/resume/generate/${mockId}`);
      if (!response.ok) throw new Error("Failed to generate resume");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ATS_Resume_${studentData.name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      alert("RESUME GENERATED & DOWNLOADED!");
    } catch (error) {
      console.error(error);
      alert("Error generating resume. Please ensure profile is saved first.");
    } finally {
      setIsGeneratingResume(false);
    }
  };

  return (
    <div className="flex h-screen bg-white text-black font-sans selection:bg-black selection:text-white relative">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-72 bg-white border-r-4 border-black flex flex-col z-20">
        <div className="h-20 flex items-center px-6 border-b-4 border-black bg-yellow-300">
          <h1 className="text-2xl font-black uppercase tracking-widest">PlacementPro</h1>
        </div>
        <nav className="flex-1 overflow-y-auto pt-4">
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    if (item.id === 'resume') {
                      handleDownloadResume();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  disabled={item.id === 'resume' && isGeneratingResume}
                  className={`w-full flex items-center justify-between px-6 py-4 text-left border-b-2 border-black transition-all ${activeTab === item.id ? 'bg-black text-white font-black pl-8' : 'hover:bg-gray-200 font-bold text-gray-800'
                    } ${isGeneratingResume && item.id === 'resume' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center">
                    <item.icon className={`w-5 h-5 mr-3 ${activeTab === item.id ? 'text-yellow-400' : 'text-black'}`} />
                    <span className="tracking-wider text-sm">
                      {item.id === 'resume' && isGeneratingResume ? 'GENERATING...' : item.label}
                    </span>
                  </div>
                  {activeTab === item.id && <ChevronRight className="w-5 h-5" />}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main
        className="flex-1 flex flex-col overflow-hidden bg-gray-50 relative"
        onClick={() => isProfileDropdownOpen && setIsProfileDropdownOpen(false)}
      >
        {/* TOP NAVIGATION */}
        <header className="h-20 bg-white border-b-4 border-black flex items-center justify-between px-8 z-30 sticky top-0">
          <div className="relative w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
            <input type="text" placeholder="SEARCH JOBS, SKILLS, MENTORS..." className="w-full pl-10 pr-4 py-3 border-2 border-black bg-gray-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all font-bold text-sm uppercase tracking-wide placeholder-gray-500" />
          </div>

          <div className="flex items-center space-x-6 relative">
            <button className="relative p-2 border-2 border-black hover:bg-yellow-300 transition-colors">
              <Bell className="w-6 h-6 text-black" />
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold px-2 py-0.5 border-2 border-white">3</span>
            </button>

            {/* Profile Button Trigger */}
            <button
              onClick={(e) => { e.stopPropagation(); setIsProfileDropdownOpen(!isProfileDropdownOpen); }}
              className={`flex items-center space-x-3 p-2 border-2 border-black transition-colors ${isProfileDropdownOpen ? 'bg-black text-white' : 'hover:bg-gray-200 text-black'}`}
            >
              <div className="font-bold text-sm uppercase hidden md:block">{studentData.name}</div>
              <div className={`w-8 h-8 flex items-center justify-center border-2 ${isProfileDropdownOpen ? 'border-white bg-black' : 'border-black bg-yellow-300'}`}>
                <User className="w-5 h-5" />
              </div>
            </button>

            {/* THE PROFILE DROPDOWN */}
            {isProfileDropdownOpen && (
              <div className="absolute top-16 right-0 w-80 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col z-50" onClick={(e) => e.stopPropagation()}>
                <div className="bg-yellow-300 p-4 border-b-4 border-black">
                  <h3 className="text-xl font-black uppercase tracking-wider">{studentData.name}</h3>
                  <p className="font-bold text-sm font-mono mt-1">{studentData.usn}</p>
                </div>

                {/* Profile Actions */}
                <div className="flex flex-col">
                  {/* TRIGGER FOR THE MASSIVE FORM MODAL */}
                  <button
                    onClick={() => { setIsEditProfileModalOpen(true); setIsProfileDropdownOpen(false); }}
                    className="flex items-center p-4 hover:bg-black hover:text-white font-black uppercase text-sm border-b-2 border-black transition-colors"
                  >
                    <Settings className="w-5 h-5 mr-3" /> Update Master Profile
                  </button>
                  <button className="flex items-center p-4 hover:bg-red-500 hover:text-white font-black uppercase text-sm transition-colors text-red-600">
                    <LogOut className="w-5 h-5 mr-3" /> Sign Out
                  </button>
                </div>
              </div>
            )}
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
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CALENDAR */}
                <div className="lg:col-span-2 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                  <h3 className="font-black text-xl uppercase tracking-wide flex items-center mb-6 border-b-2 border-black pb-2">
                    <CalendarIcon className="mr-2 w-6 h-6" /> Interview Schedule
                  </h3>
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => <div key={day} className="font-black text-xs uppercase bg-gray-200 py-2 border-2 border-black">{day}</div>)}
                    {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                      const isInterview = scheduledDates.includes(day);
                      return (
                        <div key={day} className={`p-2 border-2 border-black font-bold h-16 flex flex-col items-center justify-center transition-all ${isInterview ? 'bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-y-1' : 'bg-white hover:bg-gray-100'}`}>
                          <span className={isInterview ? 'text-lg font-black' : 'text-sm'}>{day}</span>
                          {isInterview && <span className="text-[9px] font-black uppercase mt-1 bg-black text-white px-1">Interview</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* STATS */}
                <div className="flex flex-col space-y-6">
                  <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="font-black text-lg uppercase border-b-2 border-black pb-2 mb-4">Quick Stats</h3>
                    <div className="space-y-3 font-bold">
                      <div className="flex justify-between items-center border-b border-dashed border-gray-400 pb-2"><span>Eligible Drives</span> <span className="text-2xl font-black bg-black text-white px-2">12</span></div>
                      <div className="flex justify-between items-center border-b border-dashed border-gray-400 pb-2"><span>Applications</span> <span className="text-2xl font-black">4</span></div>
                      <div className="flex justify-between items-center pb-2"><span>Skill Match</span> <span className="text-xl font-black text-green-600">85%</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: PLACEMENTS (JOB BOARD) */}
          {activeTab === 'placements' && (
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
              {/* Header */}
              <div className="flex justify-between items-end border-b-4 border-black pb-4">
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-wider">Active Placement Drives</h2>
                  <p className="text-gray-600 mt-2 font-bold uppercase">Discover and apply to premier recruiting partners.</p>
                </div>
                <div className="flex space-x-2">
                  <div className="bg-yellow-300 px-4 py-2 font-black uppercase text-xs border-2 border-black">12 Open Drives</div>
                  <div className="bg-black text-white px-4 py-2 font-black uppercase text-xs border-2 border-black">3 Applied</div>
                </div>
              </div>

              {/* Company Spotlight */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="bg-white p-6 flex flex-col md:flex-row items-center">
                  <div className="w-24 h-24 bg-gray-100 border-2 border-black flex items-center justify-center p-4 mb-4 md:mb-0 md:mr-8 shrink-0">
                    <div className="font-black text-2xl">Z</div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="inline-block bg-yellow-300 px-2 py-0.5 border-2 border-black text-[10px] font-black uppercase mb-2">Company Spotlight</div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">Z-Tech Global Solutions</h3>
                    <p className="font-bold text-gray-600 text-sm mt-1 uppercase">Full Stack Developer | ₹18,00,000 - ₹24,00,000 PA</p>
                    <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                      <span className="bg-gray-100 px-3 py-1 border-2 border-black text-[10px] font-black">8.0+ CGPA</span>
                      <span className="bg-gray-100 px-3 py-1 border-2 border-black text-[10px] font-black">CS / IS / EC</span>
                      <span className="bg-gray-100 px-3 py-1 border-2 border-black text-[10px] font-black">Deadline: 25 FEB</span>
                    </div>
                  </div>
                  <button className="mt-6 md:mt-0 bg-black text-white px-8 py-3 font-black uppercase tracking-widest border-2 border-black hover:bg-yellow-300 hover:text-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
                    Express Interest
                  </button>
                </div>
              </div>

              {/* Company Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[
                  { name: 'Google', role: 'SWE - Cloud Infrastructure', ctc: '₹32,00,000', eligibility: '8.5+ CGPA', dead: '28 FEB', color: 'bg-red-100', logo: 'G' },
                  { name: 'Microsoft', role: 'Software Engineer II', ctc: '₹28,00,000', eligibility: '8.0+ CGPA', dead: '02 MAR', color: 'bg-blue-100', logo: 'M' },
                  { name: 'Amazon', role: 'SDE Intern', ctc: '₹1,10,000 PM', eligibility: '7.5+ CGPA', dead: '24 FEB', color: 'bg-yellow-100', logo: 'A' },
                  { name: 'Intuit', role: 'Financial Software Eng', ctc: '₹22,00,000', eligibility: '7.0+ CGPA', dead: '05 MAR', color: 'bg-blue-50', logo: 'I' },
                  { name: 'Nvidia', role: 'Hardware Arch Engineer', ctc: '₹30,00,000', eligibility: '8.5+ CGPA', dead: '12 MAR', color: 'bg-green-100', logo: 'N' },
                  { name: 'Adobe', role: 'Product Design Engineer', ctc: '₹24,00,000', eligibility: '8.0+ CGPA', dead: '15 MAR', color: 'bg-red-50', logo: 'A' },
                ].map((co, i) => (
                  <div key={i} className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform h-full flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-12 h-12 ${co.color} border-2 border-black flex items-center justify-center font-black text-xl`}>
                        {co.logo}
                      </div>
                      <div className="bg-green-100 text-green-800 border-2 border-green-800 px-2 py-0.5 text-[8px] font-black uppercase">
                        Actively Recruiting
                      </div>
                    </div>
                    <h4 className="text-xl font-black uppercase">{co.name}</h4>
                    <p className="font-bold text-gray-500 text-xs uppercase mb-4">{co.role}</p>

                    <div className="flex-1 space-y-2 mb-6">
                      <div className="flex justify-between items-center text-[10px] py-1 border-b border-gray-100">
                        <span className="font-bold text-gray-400">PACKAGE</span>
                        <span className="font-black">{co.ctc}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] py-1 border-b border-gray-100">
                        <span className="font-bold text-gray-400">ELIGIBILITY</span>
                        <span className="font-black">{co.eligibility}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] py-1">
                        <span className="font-bold text-gray-400">DEADLINE</span>
                        <span className="font-black text-red-600">{co.dead}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 border-2 border-black py-2 font-black uppercase text-[10px] hover:bg-gray-100 transition-colors">
                        Syllabus
                      </button>
                      <button className="flex-1 bg-black text-white py-2 font-black uppercase text-[10px] hover:bg-yellow-300 hover:text-black transition-colors border-2 border-black">
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Eligibility Disclaimer */}
              <div className="bg-red-50 border-2 border-red-600 p-4 text-red-800 font-bold text-[10px] uppercase flex items-center">
                <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
                Your academic profile (8.5 CGPA) currently qualifies you for 100% of these drives. Ensure your documents are verified before the deadline.
              </div>
            </div>
          )}


          {/* VIEW: APPLICATION TRACK (STUDENT IMPROVEMENT) */}
          {activeTab === 'applications' && (
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-between items-end border-b-4 border-black pb-4">
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-wider">Improvement Analytics</h2>
                  <p className="text-gray-600 mt-2 font-bold uppercase">Visualizing your growth across all assessments.</p>
                </div>
                <div className="bg-black text-white px-4 py-2 font-black uppercase text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(253,224,71,1)]">
                  Level: Intermediate
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Improvement Trend Chart (SVG) */}
                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
                  <h3 className="font-black text-xl uppercase mb-6 flex items-center border-b-2 border-black pb-2">
                    <TrendingUp className="mr-2 w-6 h-6 text-green-600" /> Score Progression
                  </h3>
                  <div className="flex-1 min-h-[300px] relative mt-4">
                    <svg viewBox="0 0 400 200" className="w-full h-full">
                      {/* Grid Lines */}
                      {[0, 50, 100, 150].map((y, i) => (
                        <line key={i} x1="40" y1={200 - y} x2="380" y2={200 - y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
                      ))}
                      {/* Labels */}
                      <text x="10" y="195" fontSize="10" fontWeight="bold">0%</text>
                      <text x="10" y="95" fontSize="10" fontWeight="bold">50%</text>
                      <text x="5" y="15" fontSize="10" fontWeight="bold">100%</text>

                      {/* Line Chart Path */}
                      <path
                        d="M 60 170 L 120 150 L 180 130 L 240 110 L 300 90 L 360 40"
                        fill="none"
                        stroke="black"
                        strokeWidth="4"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 60 170 L 120 150 L 180 130 L 240 110 L 300 90 L 360 40"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="4"
                        strokeDasharray="1000"
                        strokeDashoffset="0"
                        className="animate-[draw_2s_ease-out]"
                      />

                      {/* Data Points */}
                      {[
                        { x: 60, y: 170, val: '45%' },
                        { x: 120, y: 150, val: '55%' },
                        { x: 180, y: 130, val: '62%' },
                        { x: 240, y: 110, val: '75%' },
                        { x: 300, y: 90, val: '82%' },
                        { x: 360, y: 40, val: '94%' },
                      ].map((p, i) => (
                        <g key={i}>
                          <circle cx={p.x} cy={p.y} r="6" fill="white" stroke="black" strokeWidth="3" />
                          <text x={p.x} y={p.y - 12} fontSize="8" fontWeight="black" textAnchor="middle">{p.val}</text>
                          <text x={p.x} y="215" fontSize="8" fontWeight="bold" textAnchor="middle">S{i + 1}</text>
                        </g>
                      ))}
                    </svg>
                    <div className="absolute top-0 right-0 text-[10px] font-black uppercase text-green-600 bg-green-50 px-2 py-1 border-2 border-green-600">
                      +49% Overall Growth
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase mt-8 italic">
                    * Data based on your last 6 comprehensive assessment sessions.
                  </p>
                </div>

                {/* Skill Proficiency Area Chart (SVG) */}
                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
                  <h3 className="font-black text-xl uppercase mb-6 flex items-center border-b-2 border-black pb-2">
                    <Target className="mr-2 w-6 h-6 text-blue-600" /> Domain Mastery
                  </h3>
                  <div className="flex-1 min-h-[300px] mt-4">
                    <div className="space-y-6">
                      {[
                        { label: 'Technical Logic', val: 85, color: 'bg-blue-500' },
                        { label: 'Communication', val: 72, color: 'bg-yellow-400' },
                        { label: 'System Design', val: 64, color: 'bg-green-500' },
                        { label: 'Problem Solving', val: 91, color: 'bg-red-500' },
                        { label: 'Aptitude Speed', val: 58, color: 'bg-purple-500' },
                      ].map((s, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between items-center text-xs font-black uppercase">
                            <span>{s.label}</span>
                            <span>{s.val}%</span>
                          </div>
                          <div className="h-4 border-2 border-black bg-gray-100 overflow-hidden relative">
                            <div
                              className={`h-full ${s.color} border-r-2 border-black transform origin-left transition-transform duration-1000 ease-out`}
                              style={{ width: `${s.val}%` }}
                            />
                            {/* Marker line */}
                            <div className="absolute left-[75%] top-0 bottom-0 w-0.5 bg-black dashed opacity-30" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 p-3 bg-blue-50 border-2 border-blue-600 text-blue-800 text-[10px] font-black uppercase flex items-center">
                      <Award className="w-5 h-5 mr-3" /> Recommended Focus: Aptitude Speed & System Design
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress History Table */}
              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <div className="bg-black text-white p-4 font-black uppercase tracking-widest text-sm flex justify-between items-center">
                  <span>Growth Narrative</span>
                  <div className="flex space-x-4 text-[10px]">
                    <span className="flex items-center"><div className="w-2 h-2 bg-green-500 mr-1" /> Improvement</span>
                    <span className="flex items-center"><div className="w-2 h-2 bg-yellow-500 mr-1" /> Stable</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100 border-b-4 border-black italic">
                        <th className="p-4 font-black uppercase text-xs">Date</th>
                        <th className="p-4 font-black uppercase text-xs">Session Mode</th>
                        <th className="p-4 font-black uppercase text-xs">Score</th>
                        <th className="p-4 font-black uppercase text-xs">Key Outcome</th>
                        <th className="p-4 font-black uppercase text-xs text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-gray-200">
                      {[
                        { date: 'Feb 21, 2026', mode: 'Video Interview', score: '94%', outcome: 'Exceptional Communication', status: 'Improved' },
                        { date: 'Feb 19, 2026', mode: 'Aptitude Test', score: '82%', outcome: 'High Logic Accuracy', status: 'Stable' },
                        { date: 'Feb 15, 2026', mode: 'Video Interview', score: '75%', outcome: 'Better Confidence', status: 'Improved' },
                        { date: 'Feb 10, 2026', mode: 'Technical Quiz', score: '62%', outcome: 'Foundational Knowledge', status: 'Initial' },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-yellow-50 transition-colors">
                          <td className="p-4 font-bold text-xs uppercase">{row.date}</td>
                          <td className="p-4 font-black text-xs uppercase text-blue-600">{row.mode}</td>
                          <td className="p-4 font-black text-lg">{row.score}</td>
                          <td className="p-4 font-bold text-xs uppercase italic">"{row.outcome}"</td>
                          <td className="p-4 text-right">
                            <span className={`px-2 py-0.5 border-2 border-black text-[9px] font-black uppercase ${row.status === 'Improved' ? 'bg-green-400' : 'bg-gray-200'}`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* --- NEW VIEW: LEARN & GROW --- */}
          {/* VIEW: SKILL IMPROVEMENT (LEARNING ANALYSIS) */}
          {activeTab === 'skills' && (
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-between items-end border-b-4 border-black pb-4">
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-wider">Skill Growth Matrix</h2>
                  <p className="text-gray-600 mt-2 font-bold uppercase">Tracking your learning velocity and mastery milestones.</p>
                </div>
                <div className="flex space-x-2">
                  <div className="bg-blue-600 text-white px-4 py-2 font-black uppercase text-xs border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    Elite Learner
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Learning Curve Graph (SVG) */}
                <div className="bg-white border-4 border-black p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
                  <h3 className="font-black text-xl uppercase mb-6 flex items-center border-b-2 border-black pb-2 pl-4">
                    <TrendingUp className="mr-2 w-6 h-6 text-blue-600" /> Proficiency Learning Curve
                  </h3>

                  <div className="flex-1 min-h-[300px] mt-4 ml-4">
                    <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible">
                      {/* Grid Background */}
                      <rect x="40" y="20" width="340" height="150" fill="#f9fafb" />
                      {[0, 25, 50, 75, 100].map((val, i) => (
                        <g key={i}>
                          <line x1="40" y1={170 - (val * 1.5)} x2="380" y2={170 - (val * 1.5)} stroke="#e5e7eb" strokeWidth="1" />
                          <text x="10" y={175 - (val * 1.5)} fontSize="8" fontWeight="black">{val}%</text>
                        </g>
                      ))}

                      {/* Learning Curve Path (Area) */}
                      <path
                        d="M 40 170 Q 100 160, 160 120 T 280 60 T 380 30 L 380 170 Z"
                        fill="rgba(37, 99, 235, 0.1)"
                        stroke="none"
                      />
                      <path
                        d="M 40 170 Q 100 160, 160 120 T 280 60 T 380 30"
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="4"
                        strokeLinecap="round"
                        className="animate-[draw_3s_ease-out]"
                        strokeDasharray="1000"
                        strokeDashoffset="0"
                      />

                      {/* Milestone Markers */}
                      {[
                        { x: 100, y: 160, label: 'Basics' },
                        { x: 190, y: 105, label: 'Intermediate' },
                        { x: 290, y: 55, label: 'Advanced' },
                        { x: 370, y: 35, label: 'Expert' }
                      ].map((m, i) => (
                        <g key={i}>
                          <circle cx={m.x} cy={m.y} r="5" fill="white" stroke="#2563eb" strokeWidth="3" />
                          <text x={m.x} y={m.y - 12} fontSize="7" fontWeight="black" textAnchor="middle" className="uppercase">{m.label}</text>
                        </g>
                      ))}

                      {/* X-Axis Labels */}
                      <text x="40" y="190" fontSize="8" fontWeight="bold">Week 1</text>
                      <text x="210" y="190" fontSize="8" fontWeight="bold">Week 4</text>
                      <text x="380" y="190" fontSize="8" textAnchor="end" fontWeight="bold">Today</text>
                    </svg>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-100 border-2 border-black">
                      <div className="text-[10px] font-black uppercase text-gray-500">Learning Velocity</div>
                      <div className="text-lg font-black">+14% / Week</div>
                    </div>
                    <div className="p-3 bg-gray-100 border-2 border-black">
                      <div className="text-[10px] font-black uppercase text-gray-500">Time to Mastery</div>
                      <div className="text-lg font-black">~3.2 Months</div>
                    </div>
                  </div>
                </div>

                {/* Skill Mastery Breakdown */}
                <div className="bg-white border-4 border-black p-6 shadow-[10px_10px_0px_0px_rgba(253,224,71,1)] flex flex-col">
                  <h3 className="font-black text-xl uppercase mb-6 flex items-center border-b-2 border-black pb-2">
                    <Award className="mr-2 w-6 h-6 text-yellow-500" /> Category Mastery
                  </h3>

                  <div className="space-y-6 flex-1">
                    {[
                      { label: 'Data Structures', val: 92, status: 'Mastered', color: 'bg-green-500' },
                      { label: 'Cloud Architecture', val: 45, status: 'Learning', color: 'bg-blue-500' },
                      { label: 'System Design', val: 68, status: 'Practicing', color: 'bg-yellow-400' },
                      { label: 'API Development', val: 81, status: 'Advanced', color: 'bg-purple-500' },
                      { label: 'Database Tuning', val: 32, status: 'Novice', color: 'bg-red-500' },
                    ].map((skill, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-end">
                          <span className="font-black text-xs uppercase">{skill.label}</span>
                          <span className="text-[10px] font-black text-white bg-black px-2 py-0.5 border-2 border-black">
                            {skill.status} ({skill.val}%)
                          </span>
                        </div>
                        <div className="h-4 bg-gray-100 border-2 border-black overflow-hidden relative">
                          <div
                            className={`h-full ${skill.color} border-r-2 border-black`}
                            style={{ width: `${skill.val}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-4 bg-yellow-50 border-2 border-yellow-600 flex items-start">
                    <Brain className="w-5 h-5 mr-3 mt-0.5 text-yellow-700" />
                    <div>
                      <div className="text-[10px] font-black uppercase text-yellow-700">AI Recommendation</div>
                      <p className="text-[10px] font-bold italic mt-1 leading-relaxed">
                        "Your logic scores are peaking. Focus on 'Database Tuning' to unlock Full-Stack Senior roles."
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Learning Roadmap */}
              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <div className="p-4 bg-black text-white font-black uppercase tracking-widest text-sm">
                  Curriculum Milestones
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { title: 'HTML/CSS Mastery', date: 'JAN 15', done: true },
                    { title: 'React Advanced', date: 'FEB 02', done: true },
                    { title: 'Backend APIs', date: 'FEB 20', done: true },
                    { title: 'Deployment Systems', date: 'MAR 05', done: false },
                  ].map((m, i) => (
                    <div key={i} className={`p-4 border-2 border-black ${m.done ? 'bg-green-50' : 'bg-gray-50 opacity-60'} relative`}>
                      {m.done && <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-green-600" />}
                      <div className="text-[9px] font-black text-gray-500 uppercase">{m.date}</div>
                      <div className="text-xs font-black uppercase mt-1 leading-tight">{m.title}</div>
                      <div className="h-1 bg-black/10 mt-3 relative">
                        {m.done && <div className="absolute inset-0 bg-green-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: ALUMNI MENTORS (MENTORSHIP MARKETPLACE) */}
          {activeTab === 'mentors' && (
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
              {/* Header */}
              <div className="flex justify-between items-end border-b-4 border-black pb-4">
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-wider">Alumni Mentors</h2>
                  <p className="text-gray-600 mt-2 font-bold uppercase">Connect with our global network of successful alumni.</p>
                </div>
                <div className="flex space-x-2">
                  <div className="bg-green-100 text-green-800 px-4 py-2 font-black uppercase text-xs border-2 border-green-800">250+ Mentors Active</div>
                </div>
              </div>

              {/* Company Legacy Banner */}
              <div className="bg-black text-white p-6 shadow-[8px_8px_0px_0px_rgba(253,224,71,1)] flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-black uppercase italic tracking-tighter">Placed in Top Companies</h3>
                  <p className="text-gray-400 text-[10px] font-bold uppercase mt-1">Our alumni work at the world's most innovative firms.</p>
                </div>
                <div className="flex flex-wrap gap-8 opacity-70 grayscale hover:grayscale-0 transition-all">
                  {['GOOGLE', 'META', 'MICROSOFT', 'APPLE', 'AMAZON', 'NETFLIX'].map(co => (
                    <div key={co} className="font-black text-lg tracking-widest">{co}</div>
                  ))}
                </div>
              </div>

              {/* Mentors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { name: 'Sarah Miller', company: 'Google', role: 'Staff Software Engineer', exp: '8+ Years', skills: ['System Design', 'ML Ops'], color: 'bg-red-50' },
                  { name: 'David Chen', company: 'Meta', role: 'Product Manager', exp: '6+ Years', skills: ['Product Strategy', 'Growth'], color: 'bg-blue-50' },
                  { name: 'Anita Rao', company: 'Microsoft', role: 'Azure Solutions Architect', exp: '10+ Years', skills: ['Cloud Infrastructure', 'Java'], color: 'bg-indigo-50' },
                  { name: 'Kevin Zhang', company: 'Apple', role: 'iOS Core Engineer', exp: '5+ Years', skills: ['Swift', 'Kernel Dev'], color: 'bg-gray-100' },
                  { name: 'Elena Petrova', company: 'Amazon', role: 'L6 SDE (AWS)', exp: '7+ Years', skills: ['Distributed Systems', 'Go'], color: 'bg-yellow-50' },
                  { name: 'Raj Malhotra', company: 'Netflix', role: 'UI/UX Architecture', exp: '9+ Years', skills: ['React', 'Motion Design'], color: 'bg-red-100' },
                ].map((mentor, i) => (
                  <div key={i} className="bg-white border-4 border-black p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-16 h-16 bg-gray-200 border-2 border-black flex items-center justify-center font-black text-2xl uppercase">
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="bg-black text-white px-2 py-1 text-[8px] font-black uppercase">
                        {mentor.company} Alumni
                      </div>
                    </div>

                    <h4 className="text-xl font-black uppercase">{mentor.name}</h4>
                    <p className="font-bold text-blue-600 text-xs uppercase mb-1">{mentor.role}</p>
                    <p className="font-black text-[10px] text-gray-400 uppercase mb-4">{mentor.exp} Experience</p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {mentor.skills.map(s => (
                        <span key={s} className="bg-gray-100 px-2 py-0.5 border-2 border-black text-[9px] font-black uppercase">
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto space-y-2">
                      <button className="w-full bg-yellow-300 text-black py-3 font-black uppercase text-xs border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                        Request Session
                      </button>
                      <button className="w-full bg-white text-black py-2 font-black uppercase text-[10px] border-2 border-black hover:bg-gray-50 transition-colors">
                        View LinkedIn
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Call to Action */}
              <div className="bg-yellow-50 border-4 border-black p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-2xl font-black uppercase tracking-tight">Need a Mock Interview?</h3>
                <p className="font-bold text-gray-600 mt-2 uppercase text-sm">Our alumni have successfully cleared rounds at these companies. Book a 1:1 slot now.</p>
                <div className="mt-6 flex justify-center space-x-4">
                  <div className="flex items-center font-black text-xs uppercase"><div className="w-3 h-3 bg-green-500 mr-2 border-2 border-black" /> 12 Mentors Online</div>
                  <div className="flex items-center font-black text-xs uppercase"><div className="w-3 h-3 bg-blue-500 mr-2 border-2 border-black" /> Next Slot: 2 PM</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'learning' && (
            <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
              <SkillSuggestions />
            </div>
          )}

          {/* --- NEW VIEW: VIRTUAL INTERVIEWS --- */}
          {activeTab === 'interviews' && (
            <div className="max-w-7xl mx-auto animate-in fade-in duration-300 space-y-8">
              <InterviewView studentId={mockId} studentName={studentData.name} />
            </div>
          )}

        </div>
      </main>

      {/* ================= MASSIVE PROFILE EDIT MODAL ================= */}
      {isEditProfileModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 overflow-y-auto">
          <div className="bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(253,224,71,1)] w-full max-w-4xl p-8 md:p-12 relative my-auto">

            {/* Close Button */}
            <button
              onClick={() => setIsEditProfileModalOpen(false)}
              className="absolute top-4 right-4 bg-black text-white p-2 border-2 border-black hover:bg-red-500 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-8 border-b-4 border-black pb-6 pr-12">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Master Database Entry</h2>
              <div className="bg-red-100 border-2 border-red-600 p-3 mt-4 text-red-800 font-bold text-xs uppercase flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
                <p>Required to access placement drives. All data is cross-verified by the TPO.</p>
              </div>
            </div>

            {/* The Form */}
            <form onSubmit={handleProfileSubmit} className="space-y-8">

              {/* SECTION 1: Personal & Contact */}
              <div className="space-y-4">
                <h3 className="font-black text-lg uppercase flex items-center bg-gray-200 p-2 border-2 border-black">
                  <User className="mr-3 w-5 h-5" /> 1. Identity & Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="font-black text-xs uppercase mb-1">Full Name *</label>
                    <input type="text" name="fullName" required value={formData.fullName} onChange={handleFormChange} className="border-2 border-black p-2 font-bold uppercase bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-300" />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-black text-xs uppercase mb-1">USN *</label>
                    <input type="text" name="usn" required value={formData.usn} onChange={handleFormChange} className="border-2 border-black p-2 font-bold uppercase bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-300" />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-black text-xs uppercase mb-1">Date of Birth *</label>
                    <input type="date" name="dob" required value={formData.dob} onChange={handleFormChange} className="border-2 border-black p-2 font-bold uppercase bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-300" />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-black text-xs uppercase mb-1">Gender *</label>
                    <select name="gender" required value={formData.gender} onChange={handleFormChange} className="border-2 border-black p-2 font-bold uppercase bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-300 cursor-pointer">
                      <option value="" disabled>SELECT</option>
                      <option value="Male">MALE</option>
                      <option value="Female">FEMALE</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="font-black text-xs uppercase mb-1 flex items-center"><Phone className="w-3 h-3 mr-1" /> Phone *</label>
                    <input type="tel" name="phone" pattern="[0-9]{10}" required value={formData.phone} onChange={handleFormChange} className="border-2 border-black p-2 font-bold uppercase bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-300" />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-black text-xs uppercase mb-1">College Email *</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleFormChange} className="border-2 border-black p-2 font-bold uppercase bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-300" />
                  </div>
                </div>
              </div>

              {/* SECTION 2 & 3: Academics */}
              <div className="space-y-4">
                <h3 className="font-black text-lg uppercase flex items-center bg-gray-200 p-2 border-2 border-black mt-6">
                  <GraduationCap className="mr-3 w-5 h-5" /> 2. Academic Record
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <label className="font-black text-xs uppercase mb-1">10th (SSLC) % *</label>
                    <input type="number" name="sslcPercentage" step="0.01" min="0" max="100" required value={formData.sslcPercentage} onChange={handleFormChange} className="border-2 border-black p-2 font-bold uppercase bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-300" />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-black text-xs uppercase mb-1">12th (PUC) % *</label>
                    <input type="number" name="pucDiplomaPercentage" step="0.01" min="0" max="100" required value={formData.pucDiplomaPercentage} onChange={handleFormChange} className="border-2 border-black p-2 font-bold uppercase bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-300" />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-black text-xs uppercase mb-1">Branch *</label>
                    <select name="branch" required value={formData.branch} onChange={handleFormChange} className="border-2 border-black p-2 font-bold uppercase bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-300 cursor-pointer">
                      <option value="" disabled>SELECT</option>
                      <option value="CS">CS</option>
                      <option value="CSD">CSD</option>
                      <option value="MCA">MCA</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="font-black text-xs uppercase mb-1">Grad Year *</label>
                    <input type="number" name="gradYear" min="2024" max="2030" required value={formData.gradYear} onChange={handleFormChange} className="border-2 border-black p-2 font-bold uppercase bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-300" />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-black text-xs uppercase mb-1">Current CGPA *</label>
                    <input type="number" name="cgpa" step="0.01" min="0" max="10" required value={formData.cgpa} onChange={handleFormChange} className="border-2 border-black p-2 font-bold uppercase bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-300" />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-black text-xs uppercase mb-1 flex items-center">Active Backlogs *</label>
                    <input type="number" name="backlogs" min="0" required value={formData.backlogs} onChange={handleFormChange} className="border-2 border-black p-2 font-bold uppercase bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-300" />
                  </div>
                </div>
              </div>

              {/* SECTION 4: Skills & Certifications */}
              <div className="space-y-4">
                <h3 className="font-black text-lg uppercase flex items-center bg-gray-200 p-2 border-2 border-black mt-6">
                  <Target className="mr-3 w-5 h-5" /> 3. Market Readiness
                </h3>
                <div className="flex flex-col mb-4">
                  <label className="font-black text-xs uppercase mb-1 flex justify-between"><span>Core Skills *</span><span className="text-gray-500">COMMA SEPARATED</span></label>
                  <textarea name="skills" required rows={2} value={formData.skills} onChange={handleFormChange} className="border-2 border-black p-2 font-bold uppercase bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-300 resize-none" />
                </div>
                <div className="flex flex-col">
                  <label className="font-black text-xs uppercase mb-1 flex justify-between"><span className="flex items-center"><Award className="w-3 h-3 mr-1" /> Certifications</span><span className="text-gray-500">OPTIONAL</span></label>
                  <textarea name="certifications" rows={2} value={formData.certifications} onChange={handleFormChange} className="border-2 border-black p-2 font-bold uppercase bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-300 resize-none" />
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-4">
                <button type="submit" className="w-full bg-blue-600 text-white border-4 border-black p-4 font-black text-xl uppercase tracking-widest hover:bg-black hover:text-yellow-300 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none flex justify-center items-center group">
                  Lock & Update Profile
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Injecting the Student Chatbot Component here */}
      <StudentChatBot />

    </div>
  );
}