import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- MERGED: Navigation hook for Sign Out
import {
  Bell, Search, User, Briefcase, Video, FileText,
  Youtube, TrendingUp, CheckCircle, Users, Calendar as CalendarIcon, UploadCloud,
  ChevronRight, LogOut, Settings, X, Target, ArrowRight, AlertCircle, Phone, Award, GraduationCap
} from 'lucide-react';

// --- NEW IMPORT: Bring in the Skill Suggestions Component ---
import SkillSuggestions from './components/SkillSuggestions';

export default function StudentPortal() {
  const navigate = useNavigate(); // <-- MERGED: Initialized navigate
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

  // --- TEAMMATE'S CODE: Fetch Profile ---
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

  // --- TEAMMATE'S CODE: Submit Profile to Backend ---
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

  // --- TEAMMATE'S CODE: Resume Generation ---
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

  // --- MERGED: SIGN OUT FUNCTION ---
  const handleSignOut = () => {
    localStorage.removeItem('currentUserRole');
    window.dispatchEvent(new Event('logout'));
    navigate('/');
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
                  <button
                    onClick={() => { setIsEditProfileModalOpen(true); setIsProfileDropdownOpen(false); }}
                    className="flex items-center p-4 hover:bg-black hover:text-white font-black uppercase text-sm border-b-2 border-black transition-colors"
                  >
                    <Settings className="w-5 h-5 mr-3" /> Update Master Profile
                  </button>
                  {/* --- MERGED: LOGOUT BUTTON WIRED HERE --- */}
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center p-4 hover:bg-red-500 hover:text-white font-black uppercase text-sm transition-colors text-red-600"
                  >
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

          {/* VIEW: LEARN & GROW */}
          {activeTab === 'learning' && (
            <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
              <SkillSuggestions />
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

    </div>
  );
}