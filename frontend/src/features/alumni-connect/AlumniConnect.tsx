import React from 'react';
import { Users, Award } from 'lucide-react';

const AlumniConnect: React.FC = () => {
    const mentors = [
        { name: 'Sarah Chen', company: 'Google', role: 'Senior SDE', expertise: ['Backend', 'System Design'], available: true },
        { name: 'James Wilson', company: 'Meta', role: 'Product Manager', expertise: ['Product Strategy', 'Interviews'], available: false },
        { name: 'Priya Sharma', company: 'Netflix', role: 'UI/UX Lead', expertise: ['Design Systems', 'Figma'], available: true },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Alumni Mentorship</h1>
                <p className="text-gray-600 mt-2">Connect with our top alumni for guidance and referrals.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Mentors List */}
                <div className="md:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Users size={24} className="text-primary-600" /> Featured Mentors
                        </h2>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-white border rounded-full text-xs font-medium cursor-pointer hover:border-primary-500">All</span>
                            <span className="px-3 py-1 bg-white border rounded-full text-xs font-medium cursor-pointer hover:border-primary-500">Tech</span>
                            <span className="px-3 py-1 bg-white border rounded-full text-xs font-medium cursor-pointer hover:border-primary-500">Product</span>
                        </div>
                    </div>

                    {mentors.map((mentor, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 font-bold text-xl">
                                    {mentor.name[0]}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-gray-900 text-lg">{mentor.name}</h3>
                                        {mentor.available && (
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500">{mentor.role} @ {mentor.company}</p>
                                    <div className="mt-2 flex gap-2">
                                        {mentor.expertise.map(exp => (
                                            <span key={exp} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase">{exp}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button className={`px-6 py-2 rounded-lg text-sm font-bold transition ${mentor.available ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                                    Book Slot
                                </button>
                                <button className="px-6 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50">
                                    Message
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar: Community & Stats */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                            <Award size={20} className="text-yellow-500" /> Community Leaderboard
                        </h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="text-sm font-bold text-gray-400">#{i}</div>
                                        <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
                                        <div className="text-sm font-medium text-gray-800">User_{i}</div>
                                    </div>
                                    <div className="text-xs font-bold text-primary-600">450 pts</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-primary-600 p-6 rounded-2xl shadow-lg text-white">
                        <h3 className="font-bold text-lg mb-2">Referral Hub</h3>
                        <p className="text-sm opacity-90 mb-4">5 new referral opportunities from our alumni network.</p>
                        <button className="w-full py-2 bg-white text-primary-600 rounded-lg text-sm font-bold">View Referrals</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlumniConnect;
