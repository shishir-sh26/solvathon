import { useState } from 'react';
// Import the ChatWindow (verify this relative path matches your folder tree)
import ChatWindow from '../placement-bot/components/ChatWindow';

// Extended Mock Data to include "all their details"
const mockStudents = [
  { id: 1, name: 'Alex Johnson', usn: '1RV21CS001', branch: 'CS', cgpa: 8.5, email: 'alex@college.edu', phone: '9876543210', skills: ['React', 'Node'] },
  { id: 2, name: 'Priya Sharma', usn: '1RV21IS045', branch: 'IS', cgpa: 7.2, email: 'priya@college.edu', phone: '9123456780', skills: ['Python', 'SQL'] },
  { id: 3, name: 'Rahul Verma', usn: '1RV21EC089', branch: 'EC', cgpa: 6.8, email: 'rahul@college.edu', phone: '9988776655', skills: ['C++', 'IoT'] },
];

export default function TPODashboard() {
  // Filter States
  const [minCgpa, setMinCgpa] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [interviewDate, setInterviewDate] = useState('');

  // Calculate eligibility dynamically based on filters
  const processedStudents = mockStudents.map(student => {
    const meetsCgpa = minCgpa ? student.cgpa >= parseFloat(minCgpa) : true;
    const meetsBranch = branchFilter ? student.branch.toLowerCase().includes(branchFilter.toLowerCase()) : true;
    const isEligible = meetsCgpa && meetsBranch;
    return { ...student, isEligible };
  });

  const eligibleCount = processedStudents.filter(s => s.isEligible).length;

  const handleNotify = () => {
    alert(`System Jarvis: Sending notifications to ${eligibleCount} eligible students.`);
  };

  const handleSchedule = () => {
    if (!interviewDate) return alert('Please select a date from the calendar first.');
    alert(`Interview scheduled for ${eligibleCount} eligible students on ${interviewDate}.`);
  };

  return (
    <>
      <div className="p-6 bg-white text-black border-2 border-black font-sans">
        
        {/* Header */}
        <div className="mb-6 border-b-2 border-black pb-4">
          <h2 className="text-2xl font-bold uppercase tracking-wider">Placement Drive Control</h2>
          <p className="text-gray-600 mt-1">Configure criteria, view details, and schedule interviews.</p>
        </div>

        {/* Control Panel: Filters & Scheduling */}
        <div className="flex flex-col md:flex-row gap-6 mb-8 p-4 border border-gray-400 bg-gray-50">
          
          {/* Filters */}
          <div className="flex-1 space-y-3">
            <h3 className="font-bold border-b border-black pb-1">1. Filter Eligibility</h3>
            <div className="flex gap-4">
              <label className="flex flex-col text-sm font-bold">
                Min CGPA
                <input 
                  type="number" 
                  step="0.1"
                  value={minCgpa}
                  onChange={(e) => setMinCgpa(e.target.value)}
                  className="mt-1 border border-black p-2 bg-white" 
                  placeholder="e.g. 7.0"
                />
              </label>
              <label className="flex flex-col text-sm font-bold">
                Branch
                <input 
                  type="text" 
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="mt-1 border border-black p-2 bg-white" 
                  placeholder="e.g. CS"
                />
              </label>
            </div>
          </div>

          {/* Scheduling Calendar */}
          <div className="flex-1 space-y-3 border-l-0 md:border-l-2 border-gray-400 md:pl-6">
            <h3 className="font-bold border-b border-black pb-1">2. Schedule Interview</h3>
            <div className="flex flex-col gap-2">
              <input 
                type="datetime-local" 
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="border border-black p-2 bg-white text-sm"
              />
              <button 
                onClick={handleSchedule}
                className="bg-black text-white font-bold py-2 px-4 hover:bg-gray-800 transition-colors"
              >
                Schedule Date
              </button>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-end mb-4">
          <h3 className="font-bold text-lg">Student Database</h3>
          <button 
            onClick={handleNotify}
            className="border-2 border-black bg-white text-black font-bold py-2 px-6 hover:bg-gray-200 transition-colors"
          >
            Notify {eligibleCount} Eligible Students
          </button>
        </div>

        {/* Detailed Student Data Table */}
        <div className="overflow-x-auto border-2 border-black">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 border-b-2 border-black">
                <th className="p-3 border-r border-black font-bold">USN</th>
                <th className="p-3 border-r border-black font-bold">Name</th>
                <th className="p-3 border-r border-black font-bold">Branch</th>
                <th className="p-3 border-r border-black font-bold">CGPA</th>
                <th className="p-3 border-r border-black font-bold">Contact Details</th>
                <th className="p-3 border-r border-black font-bold">Skills</th>
                <th className="p-3 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {processedStudents.map((student) => (
                <tr key={student.id} className="border-b border-gray-300 hover:bg-gray-50">
                  <td className="p-3 border-r border-gray-300 font-mono text-sm">{student.usn}</td>
                  <td className="p-3 border-r border-gray-300 font-bold">{student.name}</td>
                  <td className="p-3 border-r border-gray-300">{student.branch}</td>
                  <td className="p-3 border-r border-gray-300">{student.cgpa}</td>
                  <td className="p-3 border-r border-gray-300 text-sm text-gray-700">
                    <div>{student.email}</div>
                    <div>{student.phone}</div>
                  </td>
                  <td className="p-3 border-r border-gray-300 text-sm">
                    {student.skills.join(', ')}
                  </td>
                  <td className="p-3 text-center font-bold">
                    {student.isEligible ? (
                      <span className="bg-black text-white px-3 py-1 text-xs uppercase tracking-wide">Eligible</span>
                    ) : (
                      <span className="border border-black text-gray-500 px-3 py-1 text-xs uppercase tracking-wide">Not Eligible</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Injecting the Chatbot Component */}
      <ChatWindow />
    </>
  );
}