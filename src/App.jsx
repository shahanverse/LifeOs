import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";
import FocusMode from "./pages/FocusMode";
import Insights from "./pages/Insights";
import Journal from "./pages/Journal";
import AdminRoute from "./components/AdminRoute";

export default function App() {
  const { user, loading } = useAuth();

  // ⏳ Wait for auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      {!user ? (
        // ❌ NOT LOGGED IN
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      ) : (
        // ✅ LOGGED IN
        <>
          <Navbar />

          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/focus" element={<FocusMode />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/journal" element={<Journal />} />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />

            {/* 🔥 ALWAYS LAST */}
            <Route
              path="*"
              element={
                <Navigate to={user.role === "admin" ? "/admin" : "/home"} />
              }
            />
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
}
