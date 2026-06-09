import { useState } from "react";
import { useAuth, API_URL } from "./AuthContext";

export default function AuthModal({ onClose, onWelcomeCoupon }) {
  const { login } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async () => {
    setError("");
    if (!form.email || !form.password || (mode === "register" && !form.name)) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const body = mode === "login"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      login(data.user, data.token);
      onClose();

      // Show welcome coupon popup if new user gets one
      if (data.welcomeCoupon) {
        onWelcomeCoupon(data.welcomeCoupon);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal auth-modal">
        <button className="modal__close" onClick={onClose}>✕</button>

        <div className="modal__icon">
          {mode === "login" ? "🔐" : "✨"}
        </div>

        <div className="modal__title">
          {mode === "login" ? "Welcome Back" : "Join MaaTarang"}
        </div>
        <div className="modal__sub">
          {mode === "login"
            ? "Sign in to your account"
            : "Create an account & get an exclusive welcome offer"}
        </div>
        <div className="modal__divider" />

        {mode === "register" && (
          <div className="field-wrap">
            <label className="field-label">Full Name</label>
            <input
              className="field"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handle}
            />
          </div>
        )}

        <div className="field-wrap">
          <label className="field-label">Email</label>
          <input
            className="field"
            name="email"
            type="email"
            placeholder="you@email.com"
            value={form.email}
            onChange={handle}
          />
        </div>

        <div className="field-wrap">
          <label className="field-label">Password</label>
          <input
            className="field"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handle}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button className="btn-primary" onClick={submit} disabled={loading} style={{ marginTop: "0.5rem" }}>
          {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
        </button>

        <button
          className="btn-ghost"
          onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
        >
          {mode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
