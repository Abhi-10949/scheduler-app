const tabs = [
  { id: "events", label: "Events" },
  { id: "bookings", label: "Bookings" },
];

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header className="glass-panel sticky top-4 z-20 mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div>
        <p className="eyebrow">Scheduling Studio</p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">Scheduler</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage events and bookings from one calm, polished workspace.
        </p>
      </div>

      <div className="inline-flex w-full rounded-[22px] bg-white/70 p-1.5 sm:w-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-2xl px-4 py-2.5 text-sm font-semibold sm:flex-none ${
                isActive
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/15"
                  : "text-slate-600 hover:bg-white hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
