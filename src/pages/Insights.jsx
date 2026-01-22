import { useAuth } from "../context/AuthContext";

export default function Insights() {
  const { user } = useAuth();

  // 🔒 HARD GUARD
  if (!user) return null;

  /* ---------------- HABITS ---------------- */
  const habits = user.habits || [];
  const totalHabits = habits.length;
  const completedHabits = habits.filter((h) => h.done).length;
  const habitCompletion =
    totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);

  const bestHabit = habits.find((h) => h.done)?.name || "No data yet";

  /* ---------------- FOCUS SESSIONS ---------------- */
  const sessionData =
    JSON.parse(localStorage.getItem("lifeos_focus_sessions")) || {};

  const todayKey = new Date().toDateString();
  const todaySessions = sessionData[todayKey] || 0;

  // last 7 days
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toDateString();
    return {
      day: d.toLocaleDateString("en-IN", {
        weekday: "short",
      }),
      sessions: sessionData[key] || 0,
    };
  });

  const weeklyTotal = last7Days.reduce((sum, d) => sum + d.sessions, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">📊 Insights</h1>
        <p className="text-gray-500">Your productivity, broken down</p>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <InsightCard title="Focus Today" value={todaySessions} sub="sessions" />
        <InsightCard
          title="Habit Completion"
          value={`${habitCompletion}%`}
          sub={`${completedHabits}/${totalHabits} done`}
        />
        <InsightCard
          title="Weekly Focus"
          value={weeklyTotal}
          sub="sessions (7 days)"
        />
      </div>

      {/* DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* HABIT INSIGHTS */}
        <div className="bg-emerald-50 rounded-3xl shadow p-6">
          <h2 className="font-semibold mb-4">✅ Habit Insights</h2>

          <p className="text-sm mb-2">
            Total habits: <span className="font-medium">{totalHabits}</span>
          </p>

          <p className="text-sm mb-2">
            Completed today:{" "}
            <span className="font-medium">{completedHabits}</span>
          </p>

          <p className="text-sm">
            Best habit today: <span className="font-medium">{bestHabit}</span>
          </p>
        </div>

        {/* FOCUS INSIGHTS */}
        <div className="bg-emerald-50 rounded-3xl shadow p-6">
          <h2 className="font-semibold mb-4">🎯 Focus (Last 7 Days)</h2>

          <div className="space-y-2">
            {last7Days.map((d) => (
              <div key={d.day} className="flex justify-between text-sm">
                <span>{d.day}</span>
                <span className="font-medium">{d.sessions}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- SMALL COMPONENT ---------------- */
function InsightCard({ title, value, sub }) {
  return (
    <div className="bg-white rounded-3xl shadow p-6">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold">{value}</h3>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );
}
