import React, { useState } from "react";
import { doSignInWithGoogle, doCreateUserWithEmailAndPassword, doSignInWithEmailAndPassword } from "../auth";
import { Activity } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

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

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await doCreateUserWithEmailAndPassword(email, password);
      } else {
        await doSignInWithEmailAndPassword(email, password);
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert(`${isSignUp ? "Sign up" : "Sign in"} failed: ${error.message}`);
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
          {isSignUp ? "Create an account" : "Sign in"} to continue tracking your expenses
        </p>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-slate-300 rounded-xl py-3 font-semibold hover:bg-slate-100 transition mb-4"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center mb-4">
          <div className="flex-1 border-t border-slate-300"></div>
          <span className="px-3 text-slate-500 text-sm">or</span>
          <div className="flex-1 border-t border-slate-300"></div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        {/* Toggle Sign Up / Sign In */}
        <p className="text-center text-slate-500 mt-4">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-indigo-600 hover:underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>

        {/* Footer */}
        <p className="text-xs text-center text-slate-400 mt-8">
          Secure authentication powered by Firebase
        </p>
      </div>
    </div>
  );
}
