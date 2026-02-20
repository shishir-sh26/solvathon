import React, { useState } from 'react';
import { User, BookOpen, Target, ArrowRight, AlertCircle } from 'lucide-react';

export default function StudentOnboarding() {
  // Form State mapping exactly to your Supabase 'users' table schema
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    usn: '', 
    branch: '',
    cgpa: '',
    backlogs: '0',
    skills: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Next phase: Send this to Supabase -> supabase.from('users').insert([{ role: 'student', ...formData }])
    console.log("Profile Data Saved:", formData);
    alert("PROFILE SAVED! Redirecting to Dashboard...");
  };

  return (
    <div className="min-h-screen bg-yellow-300 flex items-center justify-center p-6 font-sans selection:bg-black selection:text-white">
      
      {/* Brutalist Card Container */}
      <div className="w-full max-w-3xl bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12 relative">
        
        {/* Decorative Top Badge */}
        <div className="absolute -top-5 left-8 bg-black text-white px-4 py-1 font-black uppercase tracking-widest text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
          Step 1 of 1
        </div>

        <div className="mb-10 border-b-4 border-black pb-6">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Complete Profile</h1>
          <p className="font-bold text-gray-600 mt-2 uppercase flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-blue-600" />
            Required to access placement drives
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: Basic Info */}
          <div className="space-y-4">
            <h2 className="font-black text-xl uppercase flex items-center bg-gray-200 p-2 border-2 border-black">
              <User className="mr-3 w-6 h-6" /> 1. Personal Identity
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="font-black text-sm uppercase mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  required
                  placeholder="E.G. ALEX JOHNSON"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="border-2 border-black p-3 font-bold uppercase bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all placeholder-gray-400"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-black text-sm uppercase mb-1">University Serial Number (USN)</label>
                <input 
                  type="text" 
                  name="usn"
                  required
                  placeholder="E.G. 1RV21CS001"
                  value={formData.usn}
                  onChange={handleChange}
                  className="border-2 border-black p-3 font-bold uppercase bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Academic Criteria (Crucial for TPO Filtering) */}
          <div className="space-y-4">
            <h2 className="font-black text-xl uppercase flex items-center bg-gray-200 p-2 border-2 border-black mt-8">
              <BookOpen className="mr-3 w-6 h-6" /> 2. Academic Record
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <label className="font-black text-sm uppercase mb-1">Branch</label>
                <select 
                  name="branch" 
                  required
                  value={formData.branch}
                  onChange={handleChange}
                  className="border-2 border-black p-3 font-bold uppercase bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all cursor-pointer"
                >
                  <option value="" disabled>SELECT BRANCH</option>
                  <option value="CS">Computer Science (CS)</option>
                  <option value="CSD">CS & Design (CSD)</option>
                  <option value="MCA">MCA</option>
                  <option value="IS">Information Science (IS)</option>
                  <option value="EC">Electronics (EC)</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="font-black text-sm uppercase mb-1">Current CGPA</label>
                <input 
                  type="number" 
                  name="cgpa"
                  step="0.01"
                  min="0"
                  max="10"
                  required
                  placeholder="e.g. 8.5"
                  value={formData.cgpa}
                  onChange={handleChange}
                  className="border-2 border-black p-3 font-bold uppercase bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-black text-sm uppercase mb-1">Active Backlogs</label>
                <input 
                  type="number" 
                  name="backlogs"
                  min="0"
                  required
                  value={formData.backlogs}
                  onChange={handleChange}
                  className="border-2 border-black p-3 font-bold uppercase bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Skills (Crucial for AI Matching) */}
          <div className="space-y-4">
            <h2 className="font-black text-xl uppercase flex items-center bg-gray-200 p-2 border-2 border-black mt-8">
              <Target className="mr-3 w-6 h-6" /> 3. Skill Profile
            </h2>
            
            <div className="flex flex-col">
              <label className="font-black text-sm uppercase mb-1 flex justify-between">
                <span>Top Technical Skills</span>
                <span className="text-gray-500 text-xs">COMMA SEPARATED</span>
              </label>
              <input 
                type="text" 
                name="skills"
                required
                placeholder="E.G. REACT, NEXT.JS, TAILWIND CSS, THREE.JS"
                value={formData.skills}
                onChange={handleChange}
                className="border-2 border-black p-3 font-bold uppercase bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all placeholder-gray-400"
              />
              <p className="text-xs font-bold text-gray-500 mt-2 uppercase">
                The PlacementBot AI will use these to match you with eligible companies and find your skill gaps.
              </p>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-6">
            <button 
              type="submit"
              className="w-full bg-blue-600 text-white border-4 border-black p-4 font-black text-xl uppercase tracking-widest hover:bg-black hover:text-yellow-300 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none flex justify-center items-center group"
            >
              Enter Portal 
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}