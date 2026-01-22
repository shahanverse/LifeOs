import { useAuth } from "../context/AuthContext";
import ProgressWheel from "../components/ProgressWheel";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, updateUser } = useAuth();
  if (!user) return null;

  /* ---------------- USER ---------------- */
  const habits = user.habits || [];
  const userName = user.email ? user.email.split("@")[0] : "User";

  /* ---------------- GREETING ---------------- */
  const hour = new Date().getHours();
  let greeting = "Good day";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 17) greeting = "Good afternoon";
  else if (hour < 21) greeting = "Good evening";
  else greeting = "Good night";

  /* ---------------- HABITS ---------------- */
  const [newHabit, setNewHabit] = useState("");

  const completedHabits = habits.filter((h) => h.done).length;
  const totalHabits = habits.length;

  const toggleHabit = (id) => {
    updateUser({
      habits: habits.map((h) => (h.id === id ? { ...h, done: !h.done } : h)),
    });
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;

    updateUser({
      habits: [
        ...habits,
        {
          id: Date.now(),
          name: newHabit,
          done: false,
        },
      ],
    });

    setNewHabit("");
  };

  const deleteHabit = (id) => {
    updateUser({
      habits: habits.filter((h) => h.id !== id),
    });
  };

  /* ---------------- STREAK ---------------- */
  const todayKey = new Date().toDateString();
  const streakData = JSON.parse(localStorage.getItem("lifeos_streak")) || {
    lastDate: null,
    count: 0,
  };

  useEffect(() => {
    if (completedHabits > 0 && streakData.lastDate !== todayKey) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const isContinuous = streakData.lastDate === yesterday.toDateString();

      const newStreak = {
        lastDate: todayKey,
        count: isContinuous ? streakData.count + 1 : 1,
      };

      localStorage.setItem("lifeos_streak", JSON.stringify(newStreak));
    }
  }, [completedHabits]);

  const streak = JSON.parse(localStorage.getItem("lifeos_streak"))?.count || 0;

  /* ---------------- FOCUS TASKS ---------------- */
  const [focusTasks, setFocusTasks] = useState(
    JSON.parse(localStorage.getItem("lifeos_focus_tasks")) || [],
  );

  const [focusInput, setFocusInput] = useState("");

  useEffect(() => {
    localStorage.setItem("lifeos_focus_tasks", JSON.stringify(focusTasks));
  }, [focusTasks]);

  const addFocusTask = () => {
    if (!focusInput.trim()) return;

    setFocusTasks([
      ...focusTasks,
      {
        id: Date.now(),
        text: focusInput,
        done: false,
      },
    ]);

    setFocusInput("");
  };

  const toggleFocusTask = (id) => {
    setFocusTasks(
      focusTasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const deleteFocusTask = (id) => {
    setFocusTasks(focusTasks.filter((t) => t.id !== id));
  };

  const clearCompletedFocus = () => {
    setFocusTasks(focusTasks.filter((t) => !t.done));
  };

  const focusDone = focusTasks.filter((t) => t.done).length;

  /* ---------------- DAILY NOTE ---------------- */
  const noteKey = `lifeos_note_${todayKey}`;
  const [dailyNote, setDailyNote] = useState(
    localStorage.getItem(noteKey) || "",
  );

  useEffect(() => {
    localStorage.setItem(noteKey, dailyNote);
  }, [dailyNote]);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {greeting}, {userName} 👋
        </h1>
        <p className="text-gray-500">{today}</p>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4  gap-4 mb-8">
        <Stat label="Habits" value={totalHabits} />
        <Stat label="Completed" value={completedHabits} />
        <Stat label="Focus Done" value={focusDone} />
        <Stat label="🔥 Streak" value={`${streak} days`} />
      </div>

      {/* TOP GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-emerald-50 p-6 rounded-2xl shadow flex flex-col items-center">
          <ProgressWheel completed={completedHabits} total={totalHabits} />
          <p className="text-sm text-gray-600 mt-3">
            {completedHabits}/{totalHabits} habits completed
          </p>
        </div>

        <div className="md:col-span-2 bg-linear-to-br from-emerald-700 via-emerald-800  to-emerald-900 text-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold mb-2">💡 Daily Motivation</h2>
          <p className="text-sm">Focus on what truly matters today.</p>
        </div>
      </div>

      {/* DAILY NOTE */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <h2 className="font-semibold mb-2">📝 Today’s Note</h2>
        <textarea
          value={dailyNote}
          onChange={(e) => setDailyNote(e.target.value)}
          placeholder="What’s important today?"
          rows={3}
          className="w-full border rounded-xl p-3"
        />
      </div>

      {/* FOCUS */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <h2 className="font-semibold mb-4">🎯 Today’s Focus</h2>

        <div className="flex gap-2 mb-4">
          <input
            value={focusInput}
            onChange={(e) => setFocusInput(e.target.value)}
            className="flex-1 border rounded-xl p-3"
            placeholder="Add focus task"
          />
          <button
            onClick={addFocusTask}
            className="bg-emerald-700 text-white px-5 rounded-xl"
          >
            Add
          </button>
        </div>

        {focusTasks.map((task) => (
          <div
            key={task.id}
            className="flex justify-between items-center border-b py-2"
          >
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleFocusTask(task.id)}
              />
              <span className={task.done ? "line-through text-gray-400" : ""}>
                {task.text}
              </span>
            </div>

            <button
              onClick={() => deleteFocusTask(task.id)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        ))}

        {focusDone > 0 && (
          <button
            onClick={clearCompletedFocus}
            className="text-sm text-red-500 mt-3"
          >
            Clear completed
          </button>
        )}
      </div>

      {/* HABITS */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="font-semibold mb-4">✅ Daily Habits</h2>

        <div className="flex gap-2 mb-4">
          <input
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            className="flex-1 border rounded-xl p-3"
            placeholder="Add habit"
          />
          <button
            onClick={addHabit}
            className="bg-emerald-700 text-white px-5 rounded-xl"
          >
            Add
          </button>
        </div>

        {habits.map((habit) => (
          <div
            key={habit.id}
            className="flex justify-between items-center border-b py-2"
          >
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                checked={habit.done}
                onChange={() => toggleHabit(habit.id)}
              />
              <span className={habit.done ? "line-through text-gray-400" : ""}>
                {habit.name}
              </span>
            </div>

            <button
              onClick={() => deleteHabit(habit.id)}
              className="text-red-500"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- SMALL COMPONENT ---------------- */
function Stat({ label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
