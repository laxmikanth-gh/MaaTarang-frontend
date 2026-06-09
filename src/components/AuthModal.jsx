import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, LogIn, UserPlus, Eye, EyeOff } from "lucide-react";

export default function AuthModal({ isOpen, onClose, onAuthSuccess, API_URL }) {
  const [tab, setTab] = useState("login"); // 'login' or 'register'
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = tab === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload =
        tab === "login"
          ? { emailOrUsername, password }
          : { username, email, password };

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong. Please try again.");
      }

      // Successful auth
      onAuthSuccess(data.token, data.user, data.message);
      // Reset form states
      setEmailOrUsername("");
      setUsername("");
      setEmail("");
      setPassword("");
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100 z-10"
        >
          {/* Header design with background accent pattern */}
          <div className="relative bg-teal-800 p-8 text-white">
            <div className="absolute top-0 right-0 p-4">
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <h3 className="font-serif text-3xl font-bold tracking-wide">MaaTarang</h3>
            <p className="mt-1 text-teal-100/90 text-sm font-light">
              {tab === "login"
                ? "Sign in to see wishlisted designs and customized order portals."
                : "Create an account to browse custom tailoring & Maggam collections."}
            </p>
          </div>

          {/* Form Tabs */}
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => {
                setTab("login");
                setError("");
              }}
              className={`flex-1 py-4 text-center text-sm font-semibold transition-all relative ${
                tab === "login" ? "text-teal-800" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Sign In
              {tab === "login" && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-700"
                />
              )}
            </button>
            <button
              onClick={() => {
                setTab("register");
                setError("");
              }}
              className={`flex-1 py-4 text-center text-sm font-semibold transition-all relative ${
                tab === "register" ? "text-teal-800" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Sign Up
              {tab === "register" && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-700"
                />
              )}
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {error && (
              <div className="p-3 text-xs bg-rose-50 text-rose-600 rounded-lg border border-rose-100">
                {error}
              </div>
            )}

            {tab === "register" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 outline-none text-slate-700 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all text-sm"
                  />
                </div>
              </div>
            )}

            {tab === "login" ? (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter email or username"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 outline-none text-slate-700 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all text-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 outline-none text-slate-700 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all text-sm"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4.5 h-4.5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-lg border border-slate-200 outline-none text-slate-700 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-teal-800 text-white py-3 rounded-lg font-semibold hover:bg-teal-900 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : tab === "login" ? (
                <>
                  <LogIn className="w-4 h-4" /> Sign In
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Sign Up
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
