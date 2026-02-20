import { useAppStore } from '../../store/useAppStore';

export default function TPOApprovalList() {
  const { pendingUsers, approveUser, rejectUser } = useAppStore();

  return (
    <div className="p-6 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-2xl mx-auto my-8 font-sans">
      <h2 className="text-2xl font-black uppercase tracking-widest border-b-4 border-black pb-4 mb-6">
        Pending Approvals
      </h2>

      {pendingUsers.length === 0 ? (
        <p className="text-gray-600 font-bold">No pending requests at the moment.</p>
      ) : (
        <div className="space-y-4">
          {pendingUsers.map((user) => (
            <div key={user.email} className="flex items-center justify-between p-4 border-2 border-black bg-gray-50">
              
              <div>
                <p className="font-bold text-lg">{user.email}</p>
                <p className="text-sm font-bold text-gray-500 uppercase">Role: {user.role}</p>
              </div>

              <div className="flex space-x-3">
                <button 
                  onClick={() => approveUser(user.email)}
                  className="bg-green-400 hover:bg-green-500 text-black border-2 border-black font-bold py-2 px-4 uppercase text-sm transition-colors"
                >
                  Approve
                </button>
                <button 
                  onClick={() => rejectUser(user.email)}
                  className="bg-red-400 hover:bg-red-500 text-black border-2 border-black font-bold py-2 px-4 uppercase text-sm transition-colors"
                >
                  Reject
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}