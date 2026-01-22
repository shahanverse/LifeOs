import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");

  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const initials = user.email ? user.email.charAt(0).toUpperCase() : "U";

  /* ---------------- PROFILE COMPLETION ---------------- */
  const completion = Math.round(
    (((name ? 1 : 0) + (bio ? 1 : 0) + (age ? 1 : 0) + (gender ? 1 : 0)) / 4) *
      100,
  );

  /* ---------------- SAVE HANDLER ---------------- */
  const handleSave = () => {
    setSaving(true);
    setIsDirty(false);

    updateUser({ name, bio, age, gender });

    // UX timing
    setTimeout(() => {
      setSaving(false);
      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 4000);
    }, 2000);
  };

  /* ---------------- CHANGE HANDLER ---------------- */
  const markDirty = (setter) => (e) => {
    setter(e.target.value);
    setIsDirty(true);
    setSaved(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto">
        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-700 text-white flex items-center justify-center text-2xl font-bold">
              {initials}
            </div>

            <div>
              <h1 className="text-2xl font-semibold">
                {name || "Your Profile"}
              </h1>
              <p className="text-sm text-gray-500">{user.email}</p>

              <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-gray-200">
                {user.role === "admin" ? "Admin" : "User"}
              </span>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-sm mb-1">Profile completion: {completion}%</p>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-emerald-800 rounded-full transition-all"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="bg-white rounded-3xl shadow p-6">
          <label className="block text-sm font-medium mb-1">Display Name</label>
          <input
            value={name}
            onChange={markDirty(setName)}
            className="w-full border rounded-xl p-3 mb-4"
          />

          <label className="block text-sm font-medium mb-1">Age</label>
          <input
            type="number"
            value={age}
            onChange={markDirty(setAge)}
            className="w-full border rounded-xl p-3 mb-4"
          />

          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            value={gender}
            onChange={markDirty(setGender)}
            className="w-full border rounded-xl p-3 mb-4"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not">Prefer not to say</option>
          </select>

          <label className="block text-sm font-medium mb-1">
            🌱 Lifestyle Goals
          </label>
          <textarea
            value={bio}
            onChange={markDirty(setBio)}
            rows={4}
            className="w-full border rounded-2xl p-4 resize-none"
          />

          {/* ACTION AREA */}
          <div className="flex justify-end items-center mt-5 min-h-8">
            {saving && (
              <span className="text-green-600 text-sm animate-pulse">
                Saving changes…
              </span>
            )}

            {!saving && saved && (
              <span className="text-green-600 text-sm">
                ✓ Your changes have been saved
              </span>
            )}

            {!saving && !saved && isDirty && (
              <button
                onClick={handleSave}
                className="bg-emerald-800 hover:bg-emerald-900 text-white px-6 py-2 rounded-xl font-medium transition"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
