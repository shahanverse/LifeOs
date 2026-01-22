import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const ADMIN_HABITS_KEY = "lifeos_admin_habits";
const DAILY_TIP_KEY = "lifeos_daily_tip";

export default function Admin() {
  const { user } = useAuth();

  /* ---------------- ADMIN HABITS ---------------- */
  const [adminHabits, setAdminHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(ADMIN_HABITS_KEY)) || [];
    setAdminHabits(stored);
  }, []);

  const addAdminHabit = () => {
    if (!newHabit.trim()) return;

    const updated = [...adminHabits, { id: Date.now(), name: newHabit }];

    localStorage.setItem(ADMIN_HABITS_KEY, JSON.stringify(updated));
    setAdminHabits(updated);
    setNewHabit("");
  };

  const deleteAdminHabit = (id) => {
    const updated = adminHabits.filter((h) => h.id !== id);
    localStorage.setItem(ADMIN_HABITS_KEY, JSON.stringify(updated));
    setAdminHabits(updated);
  };

  /* ---------------- DAILY MOTIVATION ---------------- */
  const [dailyTip, setDailyTip] = useState(
    localStorage.getItem(DAILY_TIP_KEY) || "Focus on what truly matters today.",
  );
  const [savedTip, setSavedTip] = useState(false);

  const saveDailyTip = () => {
    localStorage.setItem(DAILY_TIP_KEY, dailyTip);
    setSavedTip(true);
    setTimeout(() => setSavedTip(false), 2000);
  };

  /* ---------------- STATS ---------------- */
  const habitsCount = user?.habits?.length || 0;

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
      <p className="text-gray-500 mb-8">Manage LifeOS global settings</p>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <AdminCard title="User Habits" value={habitsCount} />
        <AdminCard title="Journal Entries" value={journalEntries} />
        <AdminCard title="Focus Sessions" value={focusSessions} />
      </div>

      {/* ADMIN HABITS */}
      <div className="bg-white rounded-3xl shadow p-6 mb-8">
        <h2 className="font-semibold mb-4">✅ Default Habits (Global)</h2>

        <div className="flex gap-2 mb-4">
          <input
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Add default habit"
            className="flex-1 border rounded-xl p-3"
          />
          <button
            onClick={addAdminHabit}
            className="bg-indigo-600 text-white px-5 rounded-xl"
          >
            Add
          </button>
        </div>

        {adminHabits.length === 0 && (
          <p className="text-sm text-gray-400">No default habits added yet.</p>
        )}

        {adminHabits.map((habit) => (
          <div
            key={habit.id}
            className="flex justify-between items-center border-b py-2"
          >
            <span>{habit.name}</span>
            <button
              onClick={() => deleteAdminHabit(habit.id)}
              className="text-red-500"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* DAILY MOTIVATION */}
      <div className="bg-white rounded-3xl shadow p-6 mb-8">
        <h2 className="font-semibold mb-3">💡 Daily Motivation</h2>

        <textarea
          value={dailyTip}
          onChange={(e) => setDailyTip(e.target.value)}
          rows={3}
          className="w-full border rounded-xl p-3"
        />

        <div className="flex items-center gap-4 mt-3">
          <button
            onClick={saveDailyTip}
            className="bg-emerald-600 text-white px-5 py-2 rounded-xl"
          >
            Save
          </button>

          {savedTip && <span className="text-green-600 text-sm">✅ Saved</span>}
        </div>
      </div>

      {/* DANGEROUS */}
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
