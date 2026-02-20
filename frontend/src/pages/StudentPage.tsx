import StudentPortal from '../features/student/StudentPortal';
import InterviewPanel from '../features/interview/components/InterviewPanel';
// Corrected path to match your provided location
import AlumniConnect from '../features/alumni-connect/AlumniConnect';

export default function StudentPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Student Dashboard</h2>
      
      {/* The massive portal code goes here */}
      <StudentPortal />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InterviewPanel />
        <AlumniConnect />
      </div>
    </div>
  )
}