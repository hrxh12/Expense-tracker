import React from "react";
import { Activity } from "lucide-react";
import { useAuth } from "../contexts/authContext";
import { doLogout } from "../auth";

export default function Navbar({ view, setView }) {
  
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await doLogout();
      console.log("Logged out");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-[99] mb-8 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">

        {/* Brand */}
        <div className="flex items-center space-x-2 text-indigo-600">
          <Activity className="w-6 h-6" />
          <h1 className="text-2xl font-extrabold tracking-tight">
            ₹ Expense<span className="text-slate-800">Tracker</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl shadow-inner">

          <button
            onClick={() => setView("tracker")}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all active:scale-95 ${
              view === "tracker"
                ? "bg-white shadow-md text-indigo-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setView("splitter")}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all active:scale-95 ${
              view === "splitter"
                ? "bg-white shadow-md text-indigo-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Split Bill
          </button>

          {/* logout only visible when logged in */}
          {currentUser && (
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 text-sm font-bold rounded-lg bg-red-500 text-white hover:bg-red-600 active:scale-95 transition-all"
            >
              Logout
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}
