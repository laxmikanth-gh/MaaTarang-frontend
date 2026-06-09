import { useState } from "react";

export default function WelcomeCouponModal({ coupon, onClose }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal coupon-modal">
        <button className="modal__close" onClick={onClose}>✕</button>
        <div className="coupon-confetti">🎉</div>
        <div className="modal__title" style={{ textAlign: "center" }}>Welcome Gift!</div>
        <div className="modal__sub" style={{ textAlign: "center" }}>
          {coupon.description || `Use this code for ${coupon.discountValue}${coupon.discountType === "percent" ? "%" : "₹"} off your first order`}
        </div>
        <div className="modal__divider" style={{ margin: "1rem auto 1.5rem" }} />

        <div className="coupon-code-box" onClick={copy}>
          <span className="coupon-code-text">{coupon.code}</span>
          <span className="coupon-copy-hint">{copied ? "✓ Copied!" : "Tap to copy"}</span>
        </div>

        <p className="coupon-note">
          Save this code and use it when you place your order on WhatsApp or at checkout.
        </p>

        <button className="btn-primary" onClick={onClose} style={{ marginTop: "1.25rem" }}>
          Start Shopping
        </button>
      </div>
    </div>
  );
}
