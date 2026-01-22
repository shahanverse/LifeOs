import { useEffect, useState } from "react";

const JOURNAL_KEY = "lifeos_journal_entries";

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState("");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [saved, setSaved] = useState(false);

  /* ---------------- LOAD ENTRIES ---------------- */
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(JOURNAL_KEY));
      if (Array.isArray(stored)) {
        setEntries(stored);
      }
    } catch {
      setEntries([]);
    }
  }, []);

  /* ---------------- SAVE ENTRY ---------------- */
  const saveEntry = () => {
    if (!text.trim()) return;

    const now = new Date();

    const newEntry = {
      id: Date.now(),
      date: now.toDateString(),
      time: now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text,
    };

    const updated = [newEntry, ...entries];
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));

    setEntries(updated);

    // ✅ RESET TO NEW ENTRY MODE
    setText("");
    setSelectedEntry(null);

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  /* ---------------- DELETE ENTRY ---------------- */
  const deleteEntry = (id) => {
    if (!window.confirm("Delete this entry?")) return;

    const updated = entries.filter((e) => e.id !== id);
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));

    setEntries(updated);
    setSelectedEntry(null);
    setText("");
  };

  /* ---------------- GROUP BY DATE ---------------- */
  const groupedEntries = entries.reduce((acc, entry) => {
    acc[entry.date] = acc[entry.date] || [];
    acc[entry.date].push(entry);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">📓 Journal</h1>
        <p className="text-gray-500">
          Write, reflect, and revisit your thoughts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ENTRY LIST */}
        <div className="bg-white rounded-3xl shadow p-4 max-h-[500px] overflow-y-auto">
          <h2 className="font-semibold mb-4">📅 Entries</h2>

          {entries.length === 0 && (
            <p className="text-sm text-gray-400">No entries yet</p>
          )}

          {Object.keys(groupedEntries).map((date) => (
            <div key={date} className="mb-4">
              <p className="text-xs text-gray-400 mb-2">{date}</p>

              {groupedEntries[date].map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className={`p-2 rounded-xl cursor-pointer text-sm mb-2 ${
                    selectedEntry?.id === entry.id
                      ? "bg-indigo-100 text-indigo-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  🕒 {entry.time}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* EDITOR / VIEWER */}
        <div
          className="md:col-span-2 bg-white rounded-3xl shadow p-6"
          onClick={() => {
            // ✅ CLICK OUTSIDE → NEW ENTRY
            setSelectedEntry(null);
            setText("");
          }}
        >
          <h2 className="font-semibold mb-2">
            {selectedEntry ? "📖 Journal Entry" : "✍️ New Entry"}
          </h2>

          {selectedEntry && (
            <>
              <p className="text-xs text-gray-400 mb-2">
                {selectedEntry.date} · {selectedEntry.time}
              </p>

              {/* NEW ENTRY BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEntry(null);
                  setText("");
                }}
                className="text-sm text-indigo-600 mb-3"
              >
                ← New entry
              </button>
            </>
          )}

          <textarea
            value={selectedEntry ? selectedEntry.text : text}
            onChange={(e) => setText(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="Write your thoughts here..."
            disabled={!!selectedEntry}
            className="w-full min-h-[220px] border rounded-xl p-4 resize-none focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
          />

          {!selectedEntry && (
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  saveEntry();
                }}
                className="bg-emerald-800 text-white px-6 py-2 rounded-xl"
              >
                Save entry
              </button>

              {saved && (
                <span className="text-green-600 text-sm">✅ Entry saved</span>
              )}
            </div>
          )}

          {selectedEntry && (
            <div className="mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteEntry(selectedEntry.id);
                }}
                className="text-red-500 text-sm"
              >
                Delete entry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
