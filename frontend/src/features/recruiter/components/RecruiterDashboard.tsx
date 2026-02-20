import React from 'react';
import { LayoutDashboard, Users, Briefcase, BarChart } from 'lucide-react';

const RecruiterDashboard: React.FC = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Recruiter Dashboard</h1>
                    <p className="text-gray-500 mt-2">Manage your job postings and find top student talent.</p>
                </div>
                <button className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all flex items-center gap-2">
                    <Briefcase size={20} /> Post New Job
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                    { label: 'Active Jobs', val: '12', icon: Briefcase, color: 'text-blue-600' },
                    { label: 'Applications', val: '450', icon: Users, color: 'text-green-600' },
                    { label: 'Interviews', val: '24', icon: LayoutDashboard, color: 'text-purple-600' },
                    { label: 'Hired', val: '8', icon: BarChart, color: 'text-orange-600' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <h2 className="font-bold text-gray-900">Recent Applications</h2>
                    <button className="text-primary-600 text-sm font-bold hover:underline">View All</button>
                </div>
                <div className="divide-y divide-gray-50">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                                    S
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">Student Name {i}</p>
                                    <p className="text-xs text-gray-500">Applied for Software Engineer II</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                    92% Match
                                </span>
                                <button className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                    View Profile
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecruiterDashboard;
