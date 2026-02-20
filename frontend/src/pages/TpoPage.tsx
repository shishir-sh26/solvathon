import TPODashboard from "../features/tpo/TPODashboard";

export default function TpoPage() {
  return (
    <div className="w-full animate-in fade-in duration-500">
      {/* Responsive Header */}
      <header className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-100">
          TPO Control Center
        </h2>
        <p className="text-sm md:text-base text-slate-400 mt-1 md:mt-2">
          Manage placement drives, filter students, and trigger automated schedules.
        </p>
      </header>

      {/* Feature Component */}
      <TPODashboard />
    </div>
  );
}