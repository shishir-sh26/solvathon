import React from 'react';
import { BarChart3, Info, TrendingUp } from 'lucide-react';

const MarketIntelligence: React.FC = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Market Intelligence</h1>
                    <p className="text-gray-600 mt-2">Skill Gap Analysis & Market Trends for 2024.</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Market Demand</p>
                        <p className="text-2xl font-bold text-green-600">+18.5% <span className="text-sm font-normal text-gray-400 font-sans">YoY</span></p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Demand Chart Placeholder */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <BarChart3 size={20} className="text-primary-600" /> Skill Demand vs Student Supply
                        </h3>
                        <div className="text-xs flex gap-4">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-primary-600 rounded-full"></span> Demand</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-gray-300 rounded-full"></span> Supply</span>
                        </div>
                    </div>
                    {/* Mock Chart Visualization */}
                    <div className="h-64 flex items-end justify-between gap-4">
                        {[
                            { label: 'React', val1: 90, val2: 60 },
                            { label: 'Cloud', val1: 85, val2: 40 },
                            { label: 'Python', val1: 70, val2: 75 },
                            { label: 'Design', val1: 45, val2: 30 },
                            { label: 'AI/ML', val1: 95, val2: 25 },
                        ].map(data => (
                            <div key={data.label} className="flex-1 flex flex-col items-center">
                                <div className="w-full flex justify-center gap-1 items-end h-full">
                                    <div className="w-4 bg-primary-600 rounded-t-sm" style={{ height: `${data.val1}%` }}></div>
                                    <div className="w-4 bg-gray-200 rounded-t-sm" style={{ height: `${data.val2}%` }}></div>
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 mt-4 uppercase">{data.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Insight Cards */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold text-gray-900">Skill Gap Alert</h3>
                            <p className="text-sm text-gray-500 mt-2">Students are lagging in **Cloud Infrastructure**. 65% of drives now require AWS/Azure knowledge.</p>
                            <button className="mt-4 text-primary-600 text-xs font-bold uppercase hover:underline">Launch Training Drive</button>
                        </div>
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Info size={40} /></div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold text-gray-900">Trending Role</h3>
                            <p className="text-sm text-gray-500 mt-2">**Full Stack AI Engineers** are seeing a 40% hike in package offers this quarter.</p>
                            <button className="mt-4 text-primary-600 text-xs font-bold uppercase hover:underline">View Top Candidates</button>
                        </div>
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-green-600"><TrendingUp size={40} /></div>
                    </div>
                </div>

                {/* Regional Stats */}
                <div className="lg:col-span-3 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap justify-between items-center gap-8">
                    <div className="flex-1 min-w-[200px]">
                        <h4 className="text-gray-400 text-xs font-bold uppercase">Avg. Package</h4>
                        <p className="text-3xl font-bold mt-1 tracking-tight">₹12.4 <span className="text-lg font-medium text-gray-400">LPA</span></p>
                    </div>
                    <div className="flex-1 min-w-[200px] border-l border-gray-100 pl-8">
                        <h4 className="text-gray-400 text-xs font-bold uppercase">Top Recruiter</h4>
                        <p className="text-3xl font-bold mt-1 tracking-tight">Accenture</p>
                    </div>
                    <div className="flex-1 min-w-[200px] border-l border-gray-100 pl-8">
                        <h4 className="text-gray-400 text-xs font-bold uppercase">Placement Rate</h4>
                        <p className="text-3xl font-bold mt-1 tracking-tight text-primary-600">88.2%</p>
                    </div>
                    <div className="flex-1 min-w-[200px] border-l border-gray-100 pl-8">
                        <h4 className="text-gray-400 text-xs font-bold uppercase">Job Growth</h4>
                        <p className="text-3xl font-bold mt-1 tracking-tight text-green-600">+22%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketIntelligence;
