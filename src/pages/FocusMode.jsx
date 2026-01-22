import { useEffect, useState } from "react";

const SETTINGS_KEY = "lifeos_focus_settings";
const TIMER_KEY = "lifeos_focus_timer";
const SESSION_KEY = "lifeos_focus_sessions";

export default function FocusMode() {
  /* ---------------- LOAD SETTINGS ---------------- */
  const savedSettings = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {
    focusMinutes: 25,
    breakMinutes: 5,
  };

  const [focusMinutes, setFocusMinutes] = useState(savedSettings.focusMinutes);
  const [breakMinutes, setBreakMinutes] = useState(savedSettings.breakMinutes);

  const [secondsLeft, setSecondsLeft] = useState(
    savedSettings.focusMinutes * 60,
  );
  const [mode, setMode] = useState("focus"); // focus | break
  const [isRunning, setIsRunning] = useState(false);
  const [settingsApplied, setSettingsApplied] = useState(false);

  /* ---------------- LOAD TIMER ON MOUNT ---------------- */
  useEffect(() => {
    const savedTimer = JSON.parse(localStorage.getItem(TIMER_KEY));

    if (!savedTimer) return;

    if (savedTimer.isRunning) {
      const remaining = Math.floor((savedTimer.endTime - Date.now()) / 1000);

      if (remaining > 0) {
        setMode(savedTimer.mode);
        setSecondsLeft(remaining);
        setIsRunning(true);
      } else {
        localStorage.removeItem(TIMER_KEY);
      }
    } else if (savedTimer.remaining > 0) {
      setMode(savedTimer.mode);
      setSecondsLeft(savedTimer.remaining);
    }
  }, []);

  /* ---------------- SESSION COUNT ---------------- */
  const todayKey = new Date().toDateString();
  const sessions = JSON.parse(localStorage.getItem(SESSION_KEY)) || {};
  const todaySessions = sessions[todayKey] || 0;

  /* ---------------- TIMER LOOP ---------------- */
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const savedTimer = JSON.parse(localStorage.getItem(TIMER_KEY));
      if (!savedTimer) return;

      const remaining = Math.floor((savedTimer.endTime - Date.now()) / 1000);

      if (remaining <= 0) {
        clearInterval(interval);

        if (savedTimer.mode === "focus") {
          // ✅ SAFE SESSION UPDATE
          const allSessions =
            JSON.parse(localStorage.getItem(SESSION_KEY)) || {};

          allSessions[todayKey] = (allSessions[todayKey] || 0) + 1;

          localStorage.setItem(SESSION_KEY, JSON.stringify(allSessions));

          startTimer("break");
        } else {
          startTimer("focus");
        }
      } else {
        setSecondsLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  /* ---------------- HELPERS ---------------- */
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  /* ---------------- TIMER CONTROLS ---------------- */
  const startTimer = (newMode = mode) => {
    const duration =
      newMode === "focus" ? focusMinutes * 60 : breakMinutes * 60;

    const endTime = Date.now() + duration * 1000;

    localStorage.setItem(
      TIMER_KEY,
      JSON.stringify({
        endTime,
        mode: newMode,
        isRunning: true,
      }),
    );

    setMode(newMode);
    setSecondsLeft(duration);
    setIsRunning(true);
  };

  const pause = () => {
    const saved = JSON.parse(localStorage.getItem(TIMER_KEY));
    if (!saved) return;

    const remaining = Math.max(
      Math.floor((saved.endTime - Date.now()) / 1000),
      0,
    );

    localStorage.setItem(
      TIMER_KEY,
      JSON.stringify({
        ...saved,
        remaining,
        isRunning: false,
      }),
    );

    setSecondsLeft(remaining);
    setIsRunning(false);
  };

  const reset = () => {
    localStorage.removeItem(TIMER_KEY);
    setIsRunning(false);
    setMode("focus");
    setSecondsLeft(focusMinutes * 60);
  };

  /* ---------------- APPLY SETTINGS ---------------- */
  const applySettings = () => {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({
        focusMinutes,
        breakMinutes,
      }),
    );

    reset();

    setSettingsApplied(true);
    setTimeout(() => setSettingsApplied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {/* POMODORO */}
        <div className="bg-white rounded-3xl shadow p-8 text-center">
          <h1 className="text-2xl font-bold mb-1">⏱ Pomodoro</h1>
          <p className="text-sm text-gray-500 mb-6">
            Focus smarter, not longer
          </p>

          <div
            className={`inline-block px-4 py-1 rounded-full text-sm mb-4 ${
              mode === "focus"
                ? "bg-emerald-50 text-emerald-800"
                : "bg-green-100 text-green-700"
            }`}
          >
            {mode === "focus" ? "Focus Time" : "Break Time"}
          </div>

          <div className="text-6xl font-mono font-bold mb-6">
            {formatTime(secondsLeft)}
          </div>

          <div className="flex justify-center gap-3 mb-6">
            {!isRunning && (
              <button
                onClick={() => startTimer()}
                className="bg-emerald-800 text-white px-6 py-2 rounded-xl"
              >
                Start
              </button>
            )}

            {isRunning && (
              <button
                onClick={pause}
                className="bg-yellow-500 text-white px-6 py-2 rounded-xl"
              >
                Pause
              </button>
            )}

            <button
              onClick={reset}
              className="bg-gray-200 px-6 py-2 rounded-xl"
            >
              Reset
            </button>
          </div>

          {/* SETTINGS */}
          <div className="bg-gray-50 rounded-2xl p-4 text-sm">
            <h3 className="font-medium mb-3">⚙ Customize</h3>

            <div className="flex gap-3 mb-3">
              <input
                type="number"
                min="5"
                value={focusMinutes}
                onChange={(e) => setFocusMinutes(Number(e.target.value))}
                className="w-full border rounded-lg p-2"
              />
              <input
                type="number"
                min="1"
                value={breakMinutes}
                onChange={(e) => setBreakMinutes(Number(e.target.value))}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <button
              onClick={applySettings}
              className="text-emerald-700 font-medium"
            >
              Apply settings
            </button>

            {settingsApplied && (
              <p className="mt-2 text-green-600">✅ Settings applied</p>
            )}
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Focus sessions today:{" "}
            <span className="font-semibold">{todaySessions}</span>
          </p>
        </div>

        {/* SPOTIFY (SAFE LINK VERSION) */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-3xl shadow p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">🎧 Focus Music</h2>
            <p className="text-sm opacity-90 mb-4">
              Boost concentration with the right sound
            </p>

            <div className="bg-white/20 rounded-2xl p-4 mb-4">
              Deep Focus · Ambient · Lo-fi
            </div>

            <div className="bg-white/20 rounded-2xl p-4">
              Coding Flow · Chill · Minimal
            </div>
          </div>

          <a
            href="https://open.spotify.com/search/focus"
            target="_blank"
            rel="noreferrer"
            className="mt-6 bg-white text-green-600 py-3 rounded-xl text-center font-semibold"
          >
            Open Spotify
          </a>
        </div>
      </div>
    </div>
  );
}
