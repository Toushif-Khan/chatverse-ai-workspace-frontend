import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";

function Auth() {
  const { login, register } = useApp();

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!name.trim()) throw new Error("Name is required");
        await register(name, email, password);
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-100 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-900/60 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="relative w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-3">
            <Sparkles size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Workspace Chat AI
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {isLogin
              ? "Welcome back. Sign in to access your workspaces."
              : "Create an account to organize your chats & ideas."}
          </p>
        </div>

        <div className="flex bg-slate-950/70 p-1 rounded-xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              isLogin
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              !isLogin
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="text"
                  required
                  placeholder="Alex Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="email"
                required
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-medium text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            {loading ? (
              <span className="inline-block animate-spin size-4 border-2 border-white/30 border-t-white rounded-full" />
            ) : (
              <>
                <span>{isLogin ? "Sign In" : "Get Started"}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Auth;
