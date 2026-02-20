import { useState } from 'react';
import { useWebSocketAuth } from '../../hooks/useWebSocketAuth';
import { Check, X, Bell, Users, Briefcase, LogOut } from 'lucide-react';

export default function TPODashboard() {
  const { pendingUsers, approveUser, rejectUser } = useWebSocketAuth();

  // FIX: Function to clear session and redirect
  const handleLogout = () => {
    localStorage.removeItem('currentUserRole');
    // Dispatch event so App.tsx re-renders immediately
    window.dispatchEvent(new Event('login-success'));
    window.location.href = "/"; 
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header with Logout */}
        <div className="border-b-4 border-black pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">TPO Control Center</h1>
            <p className="font-bold text-gray-600">Real-time Placement Management</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 border-2 border-black font-bold uppercase text-xs hover:bg-red-600 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Pending Approvals Section */}
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
            <Bell className="text-yellow-500" /> Pending Approvals ({pendingUsers.length})
          </h2>
          
          {pendingUsers.length === 0 ? (
            <p className="text-gray-400 font-bold italic">No new requests...</p>
          ) : (
            <div className="grid gap-4">
              {pendingUsers.map(user => (
                <div key={user.email} className="flex justify-between items-center border-2 border-black p-4 bg-gray-50">
                  <div>
                    <p className="font-black">{user.email}</p>
                    <p className="text-xs font-bold uppercase text-gray-500">Role: {user.role}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => rejectUser(user.email)}
                      className="p-2 border-2 border-black hover:bg-red-200 transition-colors"
                    >
                      <X size={20} />
                    </button>
                    <button 
                      onClick={() => approveUser(user.email)}
                      className="p-2 bg-black text-white border-2 border-black hover:bg-green-500 transition-colors"
                    >
                      <Check size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
              <div>
                <h3 className="font-black uppercase text-sm">Total Students</h3>
                <p className="text-4xl font-black">124</p>
              </div>
              <Users size={40} strokeWidth={3} />
          </div>
          <div className="bg-green-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
              <div>
                <h3 className="font-black uppercase text-sm">Active Drives</h3>
                <p className="text-4xl font-black">08</p>
              </div>
              <Briefcase size={40} strokeWidth={3} />
          </div>
        </div>
      </div>
    </div>
  );
}