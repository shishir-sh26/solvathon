import React from 'react';
import { LayoutDashboard, Users, Settings, Plus } from 'lucide-react';

const TPODashboard: React.FC = () => {
    return (
        <div className="flex bg-gray-50 min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r flex flex-col">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-primary-600">TPO Control</h2>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg font-medium">
                        <LayoutDashboard size={20} /> Dashboard
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">
                        <Plus size={20} /> Create Drive
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">
                        <Users size={20} /> Student List
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">
                        <Settings size={20} /> Settings
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Placement Overview</h1>
                        <p className="text-gray-500">Manage your upcoming drives and candidates.</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition">
                        <Plus size={18} /> New Drive
                    </button>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: 'Total Students', value: '1,240', change: '+12%' },
                        { label: 'Active Drives', value: '14', change: '5 Today' },
                        { label: 'Applications', value: '458', change: '+24%' },
                        { label: 'Placed', value: '62%', change: 'Target 80%' },
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold mt-1 text-gray-900">{stat.value}</h3>
                            <p className="text-xs text-primary-600 mt-2 font-semibold">{stat.change}</p>
                        </div>
                    ))}
                </div>

                {/* Recent Drives Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">Upcoming Drives</h2>
                        <button className="text-primary-600 text-sm font-semibold hover:underline">View All</button>
                    </div>
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Company</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Package</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { company: 'Google', role: 'SDE-1', package: '32 LPA', status: 'Active' },
                                { company: 'Microsoft', role: 'Support Eng', package: '24 LPA', status: 'Draft' },
                                { company: 'Adobe', role: 'Product Designer', package: '18 LPA', status: 'Active' },
                            ].map((drive, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-700">{drive.company[0]}</div>
                                            <span className="font-medium text-gray-900">{drive.company}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{drive.role}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{drive.package}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${drive.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                            {drive.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-primary-600 text-sm font-semibold">Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default TPODashboard;
