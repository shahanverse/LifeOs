import { useAuth } from "../context/AuthContext";
import HabitList from "../components/HabitList";
import ProgressWheel from "../components/ProgressWheel";

export default function Dashboard() {
  const { user } = useAuth();
  const completed = user.habits.filter((h) => h.done).length;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="flex gap-6 items-center">
        <ProgressWheel completed={completed} total={user.habits.length} />
        <p className="text-gray-600">Daily completion</p>
      </div>

      <div className="mt-6">
        <HabitList />
      </div>
    </div>
  );
}
