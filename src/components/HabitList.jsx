import { useAuth } from "../context/AuthContext";

export default function HabitList() {
  const { user, updateUser } = useAuth();

  const toggleHabit = (id) => {
    const updated = user.habits.map((h) =>
      h.id === id ? { ...h, done: !h.done } : h,
    );
    updateUser({ habits: updated });
  };

  return (
    <div className="bg-white p-4 rounded-xl">
      <h2 className="font-bold mb-3">Daily Habits</h2>
      {user.habits.map((h) => (
        <label key={h.id} className="flex gap-2 mb-2">
          <input
            type="checkbox"
            checked={h.done}
            onChange={() => toggleHabit(h.id)}
          />
          {h.name}
        </label>
      ))}
    </div>
  );
}
