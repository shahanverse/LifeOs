import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
     ${
       isActive
         ? "bg-emerald-800 text-white shadow-sm"
         : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
     }`;

  const initials = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="text-2xl">🌿</span>
          <span className="font-semibold text-lg tracking-tight">LifeOS</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex gap-2">
          <NavLink to="/home" className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/focus" className={linkClass}>
            Focus
          </NavLink>

          <NavLink to="/journal" className={linkClass}>
            Journal
          </NavLink>

          <NavLink to="/insights" className={linkClass}>
            Insights
          </NavLink>

          <NavLink to="/profile" className={linkClass}>
            Profile
          </NavLink>

          {user?.role === "admin" && (
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* User Pill */}
          <div className="hidden sm:flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
            <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
              {initials}
            </div>
            <span className="text-sm text-gray-700 max-w-30truncate">
              {user?.name || user?.email}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
