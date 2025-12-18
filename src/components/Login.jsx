import React from "react";
import { doSignInWithGoogle } from "../auth";
import { Activity } from "lucide-react";

export default function Login() {
  const handleGoogleLogin = async () => {
    try {
      await doSignInWithGoogle();
      // AuthContext automatically handle karega redirect
    } catch (error) {
      console.error("Google login error:", error);
      alert("Login failed. Try again.");
      console.log(error.code);
      console.log(error.message);
      alert(error.code);

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
        
        {/* Logo / Title */}
        <div className="flex items-center justify-center gap-2 mb-6 text-indigo-600">
          <Activity className="w-8 h-8" />
          <h1 className="text-2xl font-extrabold">₹ Expense Tracker</h1>
        </div>

        <p className="text-center text-slate-500 mb-8">
          Sign in to continue tracking your expenses
        </p>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-slate-300 rounded-xl py-3 font-semibold hover:bg-slate-100 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        {/* Footer */}
        <p className="text-xs text-center text-slate-400 mt-8">
          Secure authentication powered by Firebase
        </p>
      </div>
    </div>
  );
}
