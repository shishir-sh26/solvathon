import React from 'react';
import { Briefcase, FileText, TrendingUp, User, Bell } from 'lucide-react';

const StudentPortal: React.FC = () => {
    return (
        <div className="flex bg-gray-50 min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r flex flex-col">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-primary-600">Student Portal</h2>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg font-medium">
                        <Briefcase size={20} /> Jobs & Drives
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">
                        <FileText size={20} /> Resume Builder
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">
                        <TrendingUp size={20} /> Skill Analytics
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">
                        <User size={20} /> Profile
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome Back, Alex!</h1>
                        <p className="text-gray-500">Your profile is 85% complete. Boost your ATS score.</p>
                    </div>
                    <button className="relative p-2 text-gray-400 hover:text-gray-600">
                        <Bell size={24} />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                </header>

                {/* Top Section: ATS Score & Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm md:col-span-1">
                        <p className="text-sm text-gray-500 font-medium">Resume ATS Score</p>
                        <div className="mt-4 flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full border-4 border-primary-500 flex items-center justify-center text-xl font-bold">78</div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Good Score!</p>
                                <p className="text-xs text-gray-500">Add 3 more Java projects to hit 90+.</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-primary-600 p-6 rounded-xl shadow-lg text-white md:col-span-2 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold">Recommended for You</h3>
                            <p className="opacity-90 text-sm mt-1">SDE Intern at Spotify - Matches 92% of your skills.</p>
                            <button className="mt-4 px-6 py-2 bg-white text-primary-600 rounded-lg text-sm font-bold">Apply Now</button>
                        </div>
                        <div className="hidden lg:block w-32 h-32 bg-primary-500 rounded-full opacity-20 blur-2xl"></div>
                    </div>
                </div>

                {/* Applications Tracking */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 italic font-bold text-gray-900">My Applications</div>
                    <div className="p-4">
                        {[
                            { company: 'Meta', status: 'Shortlisted', date: '2 days ago' },
                            { company: 'Amazon', status: 'Pending', date: '5 days ago' },
                            { company: 'Netflix', status: 'Rejected', date: '1 week ago' },
                        ].map((app, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition border-b last:border-0 border-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold">{app.company[0]}</div>
                                    <div>
                                        <p className="font-bold text-gray-900">{app.company}</p>
                                        <p className="text-xs text-gray-500">Applied {app.date}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${app.status === 'Shortlisted' ? 'bg-green-100 text-green-700' : app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {app.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentPortal;
