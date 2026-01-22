import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();

  const [mode, setMode] = useState("login"); // login | register

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  /* ================= REGISTER ================= */
  const handleRegister = (e) => {
    e.preventDefault();
    resetMessages();

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
      return setError("All fields are required.");
    }

    if (cleanPassword.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    const account = {
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
      role,
      habits: [
        { id: 1, name: "Drink Water", done: false },
        { id: 2, name: "Exercise", done: false },
        { id: 3, name: "Read", done: false },
      ],
    };

    localStorage.setItem("lifeos_account", JSON.stringify(account));

    setSuccess("Account created successfully. Please login.");
    setMode("login");

    setName("");
    setEmail("");
    setPassword("");
    setRole("user");
  };

  /* ================= LOGIN ================= */
 const handleLogin = (e) => {
   e.preventDefault();
   resetMessages();

   const cleanEmail = email.trim().toLowerCase();
   const cleanPassword = password.trim();

   const raw = localStorage.getItem("lifeos_account");

   if (!raw) {
     console.log("❌ No account in storage");
     return setError("No account found. Please register.");
   }

   const saved = JSON.parse(raw);

   console.log("🔍 SAVED ACCOUNT:", saved);
   console.log("🔍 ENTERED EMAIL:", cleanEmail);
   console.log("🔍 ENTERED PASSWORD:", cleanPassword);

   if (saved.email !== cleanEmail || saved.password !== cleanPassword) {
     console.log("❌ MISMATCH");
     return setError("Invalid email or password.");
   }

   console.log("✅ LOGIN SUCCESS");

   login({
     name: saved.name,
     email: saved.email,
     role: saved.role,
     habits: saved.habits || [],
   });
 };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-700 via-purple-700 to-pink-800 px-4">
      <div className="bg-white/90 backdrop-blur-xl w-full max-w-md rounded-3xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">🌿 LifeOS</h1>
          <p className="text-gray-500 text-sm mt-1">Lifestyle Dashboard</p>
        </div>

        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-xl mb-6">
          <button
            onClick={() => {
              resetMessages();
              setMode("login");
            }}
            className={`flex-1 py-2 rounded-xl ${
              mode === "login" ? "bg-white shadow font-semibold" : ""
            }`}
          >
            Login
          </button>

          <button
            onClick={() => {
              resetMessages();
              setMode("register");
            }}
            className={`flex-1 py-2 rounded-xl ${
              mode === "register" ? "bg-white shadow font-semibold" : ""
            }`}
          >
            Register
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-600 p-2 rounded mb-4 text-sm">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={mode === "login" ? handleLogin : handleRegister}>
          {mode === "register" && (
            <>
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-xl p-3 mb-3"
              />

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border rounded-xl p-3 mb-3"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </>
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-xl p-3 mb-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-xl p-3 mb-4"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
          >
            {mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Frontend-only authentication
        </p>
      </div>
    </div>
  );
}
