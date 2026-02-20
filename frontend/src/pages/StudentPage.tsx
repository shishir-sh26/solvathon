import StudentPortal from '../features/student/StudentPortal'
import InterviewPanel from '../features/interview/components/InterviewPanel'
import AlumniConnect from '../features/alumni-connect/AlumniConnect'
import ChatWindow from '../features/shared/placementBot/components/ChatWindow'

export default function StudentPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Student Dashboard</h2>
      <StudentPortal />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InterviewPanel />
        <AlumniConnect />
      </div>
      <ChatWindow context="student" />
    </div>
  )
}