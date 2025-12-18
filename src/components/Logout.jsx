import React, { useEffect } from "react";
import { doLogout } from "../auth";
import { useAuth } from "../contexts/authContext";
import { Activity } from "lucide-react";

export default function Logout() {

  const { currentUser } = useAuth();

  useEffect(() => {
    async function logout() {
      try {
        await doLogout();
      } catch (err) {
        console.error("Logout failed:", err);
      }
    }

    logout();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-center">

        <div className="flex justify-center mb-4">
          <Activity className="w-8 h-8 text-indigo-500" />
        </div>

        <h1 className="text-xl font-bold text-slate-800 mb-3">
          Logging you out...
        </h1>

        <p className="text-slate-500 text-sm">
          Please wait while we safely end your session.
        </p>
      </div>
    </div>
  );
}
