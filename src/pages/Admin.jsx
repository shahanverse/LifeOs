import { useAuth } from "../context/AuthContext";

export default function Admin() {
  const { user } = useAuth();

  const habits = user?.habits?.length || 0;

  const journalEntries =
    JSON.parse(localStorage.getItem("lifeos_journal_entries"))?.length || 0;

  const focusSessions = Object.values(
    JSON.parse(localStorage.getItem("lifeos_focus_sessions")) || {},
  ).reduce((a, b) => a + b, 0);

  const clearData = (key) => {
    if (window.confirm("Are you sure? This action cannot be undone.")) {
      localStorage.removeItem(key);
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-2">🛠 Admin Dashboard</h1>
      <p className="text-gray-500 mb-8">Manage LifeOS data & settings</p>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <AdminCard title="Habits" value={habits} />
        <AdminCard title="Journal Entries" value={journalEntries} />
        <AdminCard title="Focus Sessions" value={focusSessions} />
      </div>

      {/* CONTROLS */}
      <div className="bg-white rounded-3xl shadow p-6">
        <h2 className="font-semibold mb-4">⚠️ Dangerous Actions</h2>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => clearData("lifeos_journal_entries")}
            className="bg-red-500 text-white px-4 py-2 rounded-xl"
          >
            Clear Journal
          </button>

          <button
            onClick={() => clearData("lifeos_focus_sessions")}
            className="bg-red-500 text-white px-4 py-2 rounded-xl"
          >
            Clear Focus Sessions
          </button>

          <button
            onClick={() => clearData("lifeos_session")}
            className="bg-red-700 text-white px-4 py-2 rounded-xl"
          >
            Force Logout All
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminCard({ title, value }) {
  return (
    <div className="bg-white rounded-3xl shadow p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-3xl font-bold">{value}</h3>
    </div>
  );
}
