import { useState, useEffect } from "react";
import { useAuth, API_URL } from "./AuthContext";

const EMPTY_FORM = {
  code: "",
  discountType: "percent",
  discountValue: "",
  minOrderValue: "",
  maxUses: "",
  expiresAt: "",
  isActive: true,
  forNewUsersOnly: false,
  description: "",
};

export default function AdminCoupons() {
  const { token } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const flash = (text, isError = false) => {
    isError ? setError(text) : setMsg(text);
    setTimeout(() => (isError ? setError("") : setMsg("")), 3000);
  };

  useEffect(() => { fetchCoupons(); }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch(`${API_URL}/coupons`, { headers: authHeaders });
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    } catch { flash("Failed to load coupons", true); }
  };

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async () => {
    if (!form.code || !form.discountValue) {
      flash("Code and discount value are required", true);
      return;
    }
    setLoading(true);
    try {
      const url = editId ? `${API_URL}/coupons/${editId}` : `${API_URL}/coupons`;
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: authHeaders, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { flash(data.message, true); return; }
      flash(editId ? "Coupon updated!" : "Coupon created!");
      setForm(EMPTY_FORM);
      setEditId(null);
      fetchCoupons();
    } catch { flash("Something went wrong", true); }
    finally { setLoading(false); }
  };

  const startEdit = (c) => {
    setEditId(c._id);
    setForm({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      minOrderValue: c.minOrderValue || "",
      maxUses: c.maxUses || "",
      expiresAt: c.expiresAt ? c.expiresAt.split("T")[0] : "",
      isActive: c.isActive,
      forNewUsersOnly: c.forNewUsersOnly,
      description: c.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteCoupon = async (id) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      await fetch(`${API_URL}/coupons/${id}`, { method: "DELETE", headers: authHeaders });
      flash("Coupon deleted");
      fetchCoupons();
    } catch { flash("Delete failed", true); }
  };

  const toggleActive = async (c) => {
    try {
      await fetch(`${API_URL}/coupons/${c._id}`, {
        method: "PUT", headers: authHeaders,
        body: JSON.stringify({ ...c, isActive: !c.isActive }),
      });
      fetchCoupons();
    } catch { flash("Update failed", true); }
  };

  return (
    <div className="admin" style={{ maxWidth: 760 }}>
      <div className="admin__header">
        <div className="admin__icon">🎟️</div>
        <div>
          <div className="admin__title">{editId ? "Edit Coupon" : "Create Coupon"}</div>
          <div className="admin__sub">Admin · Discount Management</div>
        </div>
      </div>
      <div className="admin__divider" />

      {/* Form */}
      <div className="admin__grid">
        <div className="admin__row">
          <div className="field-wrap">
            <label className="field-label">Coupon Code *</label>
            <input className="field" name="code" value={form.code} onChange={handle}
              placeholder="e.g. WELCOME10" style={{ textTransform: "uppercase" }} />
          </div>
          <div className="field-wrap">
            <label className="field-label">Discount Type *</label>
            <select className="field" name="discountType" value={form.discountType} onChange={handle}>
              <option value="percent">Percentage (%)</option>
              <option value="flat">Flat Amount (₹)</option>
            </select>
          </div>
        </div>
        <div className="admin__row">
          <div className="field-wrap">
            <label className="field-label">
              Discount Value * {form.discountType === "percent" ? "(%)" : "(₹)"}
            </label>
            <input className="field" name="discountValue" type="number" min="1"
              value={form.discountValue} onChange={handle} placeholder={form.discountType === "percent" ? "10" : "200"} />
          </div>
          <div className="field-wrap">
            <label className="field-label">Min Order Value (₹)</label>
            <input className="field" name="minOrderValue" type="number" min="0"
              value={form.minOrderValue} onChange={handle} placeholder="0 = no minimum" />
          </div>
        </div>
        <div className="admin__row">
          <div className="field-wrap">
            <label className="field-label">Max Uses (blank = unlimited)</label>
            <input className="field" name="maxUses" type="number" min="1"
              value={form.maxUses} onChange={handle} placeholder="e.g. 100" />
          </div>
          <div className="field-wrap">
            <label className="field-label">Expires On (blank = never)</label>
            <input className="field" name="expiresAt" type="date"
              value={form.expiresAt} onChange={handle} />
          </div>
        </div>
        <div className="field-wrap">
          <label className="field-label">Description (shown to users)</label>
          <input className="field" name="description" value={form.description} onChange={handle}
            placeholder="e.g. 10% off your first order" />
        </div>
        <div style={{ display: "flex", gap: "1.5rem", margin: "0.5rem 0 1rem" }}>
          <label className="admin-check-label">
            <input type="checkbox" name="forNewUsersOnly" checked={form.forNewUsersOnly} onChange={handle} />
            <span>New users only</span>
          </label>
          <label className="admin-check-label">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handle} />
            <span>Active</span>
          </label>
        </div>
      </div>

      {error && <div className="auth-error">{error}</div>}
      {msg && <div className="auth-success">{msg}</div>}

      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button className="btn-primary" onClick={submit} disabled={loading} style={{ flex: 1 }}>
          {loading ? "Saving…" : editId ? "Update Coupon" : "Create Coupon"}
        </button>
        {editId && (
          <button className="btn-ghost" onClick={() => { setEditId(null); setForm(EMPTY_FORM); }}
            style={{ flex: "none", width: "auto", padding: "0 20px" }}>
            Cancel
          </button>
        )}
      </div>

      {/* Coupons list */}
      {coupons.length > 0 && (
        <>
          <div className="admin__divider" style={{ margin: "2rem 0 1.5rem" }} />
          <div className="admin__sub" style={{ marginBottom: "1rem" }}>All Coupons ({coupons.length})</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {coupons.map((c) => (
              <div key={c._id} className="coupon-row">
                <div className="coupon-row__left">
                  <span className="coupon-row__code">{c.code}</span>
                  <span className="coupon-row__badge">
                    {c.discountType === "percent" ? `${c.discountValue}% off` : `₹${c.discountValue} off`}
                  </span>
                  {c.forNewUsersOnly && <span className="coupon-row__tag">New Users</span>}
                </div>
                <div className="coupon-row__meta">
                  <span>{c.usedCount}/{c.maxUses ?? "∞"} uses</span>
                  {c.expiresAt && <span>Expires {new Date(c.expiresAt).toLocaleDateString("en-IN")}</span>}
                </div>
                <div className="coupon-row__actions">
                  <button
                    className={`coupon-toggle ${c.isActive ? "active" : "inactive"}`}
                    onClick={() => toggleActive(c)}
                  >
                    {c.isActive ? "Active" : "Inactive"}
                  </button>
                  <button className="coupon-row__edit" onClick={() => startEdit(c)}>Edit</button>
                  <button className="btn-delete" style={{ width: "auto", margin: 0, padding: "6px 14px" }}
                    onClick={() => deleteCoupon(c._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
