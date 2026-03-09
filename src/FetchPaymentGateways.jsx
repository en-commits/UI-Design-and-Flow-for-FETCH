import { useState } from "react";
import { Sidebar, Ico as SharedIco } from "./FetchShared";

// ─── GATEWAY DEFINITIONS ─────────────────────────────────────────────────────
const GATEWAYS = [
  {
    id: "paystack",
    name: "Paystack",
    tagline: "Payments built for Africa",
    description: "Accept payments via cards, bank transfers, USSD, QR and more. Nigeria's most popular gateway.",
    color: "#00C3F7",
    bgColor: "#f0fbff",
    borderColor: "#b3ecfd",
    fields: [
      { key: "publicKey",  label: "Public Key",  placeholder: "pk_live_xxxxxxxxxxxxxxxxxxxx",  type: "text"     },
      { key: "secretKey",  label: "Secret Key",  placeholder: "sk_live_xxxxxxxxxxxxxxxxxxxx",  type: "password" },
    ],
    logo: PaystackLogo,
    payLink: "https://paystack.com/pay/",
  },
  {
    id: "flutterwave",
    name: "Flutterwave",
    tagline: "Payments for Africa, to the world",
    description: "Collect payments globally with support for 150+ currencies, cards, mobile money and bank transfers.",
    color: "#F5A623",
    bgColor: "#fffbf0",
    borderColor: "#fde8b0",
    fields: [
      { key: "publicKey",  label: "Public Key",  placeholder: "FLWPUBK-xxxxxxxxxxxxxxxxxxxx-X", type: "text"     },
      { key: "secretKey",  label: "Secret Key",  placeholder: "FLWSECK-xxxxxxxxxxxxxxxxxxxx-X", type: "password" },
    ],
    logo: FlutterwaveLogo,
    payLink: "https://flutterwave.com/pay/",
  },
  {
    id: "monnify",
    name: "Monnify",
    tagline: "By Moniepoint — trusted by businesses",
    description: "Collect payments via bank transfers, cards and USSD. Backed by Moniepoint's banking infrastructure.",
    color: "#0066CC",
    bgColor: "#f0f5ff",
    borderColor: "#b3c9f7",
    fields: [
      { key: "apiKey",      label: "API Key",      placeholder: "MK_TEST_xxxxxxxxxxxxxxxxxxxx", type: "text"     },
      { key: "secretKey",   label: "Secret Key",   placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxx",   type: "password" },
      { key: "contractCode",label: "Contract Code", placeholder: "xxxxxxxxxx",                  type: "text"     },
    ],
    logo: MonnifyLogo,
    payLink: "https://monnify.com/checkout/",
  },
  {
    id: "stripe",
    name: "Stripe",
    tagline: "Global payments infrastructure",
    description: "Accept international payments from customers worldwide. Ideal for diaspora clients and global invoicing.",
    color: "#635BFF",
    bgColor: "#f5f4ff",
    borderColor: "#d0ccff",
    fields: [
      { key: "publishableKey", label: "Publishable Key", placeholder: "pk_live_xxxxxxxxxxxxxxxxxxxx",  type: "text"     },
      { key: "secretKey",      label: "Secret Key",      placeholder: "sk_live_xxxxxxxxxxxxxxxxxxxx",  type: "password" },
    ],
    logo: StripeLogo,
    payLink: "https://checkout.stripe.com/pay/",
  },
  {
    id: "remita",
    name: "Remita",
    tagline: "Nigeria's government-grade payment engine",
    description: "Collect payments including government remittances, NGO disbursements and enterprise billing across Nigeria.",
    color: "#E31837",
    bgColor: "#fff0f2",
    borderColor: "#f7b3bc",
    fields: [
      { key: "merchantId",  label: "Merchant ID",  placeholder: "xxxxxxxxxxxx",               type: "text"     },
      { key: "serviceTypeId", label: "Service Type ID", placeholder: "xxxxxxxxxxxx",           type: "text"     },
      { key: "apiKey",      label: "API Key",       placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxx", type: "password" },
    ],
    logo: RemitaLogo,
    payLink: "https://remita.net/pay/",
  },
];

// ─── LOGO COMPONENTS ─────────────────────────────────────────────────────────
function PaystackLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: "#00C3F7", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="#fff"/>
        </svg>
      </div>
      <span style={{ fontWeight: 800, fontSize: 15, color: "#1a1f36", letterSpacing: -0.3 }}>Paystack</span>
    </div>
  );
}

function FlutterwaveLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: "#F5A623", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <path d="M4 6h16M4 12h10M4 18h13" stroke="#fff" strokeWidth={2.5} strokeLinecap="round"/>
        </svg>
      </div>
      <span style={{ fontWeight: 800, fontSize: 15, color: "#1a1f36", letterSpacing: -0.3 }}>Flutterwave</span>
    </div>
  );
}

function MonnifyLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: "#0066CC", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <path d="M3 12l4-7 5 9 3-4 4 6" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span style={{ fontWeight: 800, fontSize: 15, color: "#1a1f36", letterSpacing: -0.3 }}>Monnify</span>
    </div>
  );
}

function StripeLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: "#635BFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <path d="M12 4c-1.5 0-3 .8-3 2.5 0 3.5 6.5 2.5 6.5 6.5C15.5 15.5 14 16 12 16c-1.5 0-3-.5-4-1.5" stroke="#fff" strokeWidth={2} strokeLinecap="round"/>
          <path d="M12 2v2M12 18v2" stroke="#fff" strokeWidth={2} strokeLinecap="round"/>
        </svg>
      </div>
      <span style={{ fontWeight: 800, fontSize: 15, color: "#1a1f36", letterSpacing: -0.3 }}>Stripe</span>
    </div>
  );
}

function RemitaLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: "#E31837", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <rect x="4" y="6" width="16" height="12" rx="2" stroke="#fff" strokeWidth={2}/>
          <path d="M4 10h16" stroke="#fff" strokeWidth={2}/>
        </svg>
      </div>
      <span style={{ fontWeight: 800, fontSize: 15, color: "#1a1f36", letterSpacing: -0.3 }}>Remita</span>
    </div>
  );
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Ico = {
  ...SharedIco,
  bell:    <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>,
  close:   <svg width={16} height={16} fill="none" stroke="#6b7280" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/></svg>,
  key:     <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>,
  eye:     <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>,
  eyeOff:  <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" strokeLinejoin="round"/></svg>,
  check:   <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>,
  star:    <svg width={13} height={13} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  link:    <svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path strokeLinecap="round" strokeLinejoin="round" d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  info:    <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 16v-4M12 8h.01"/></svg>,
  unlink:  <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a3 3 0 010 4.243L15.536 12.9a3 3 0 01-4.243 0M5.636 18.364a3 3 0 010-4.243l2.829-2.828a3 3 0 014.243 0M3 3l18 18"/></svg>,
};

// ─── CONFIGURE DRAWER ────────────────────────────────────────────────────────
function ConfigureDrawer({ gateway, existing, onClose, onSave }) {
  const init = existing?.keys || {};
  const [keys, setKeys]       = useState(init);
  const [visible, setVisible] = useState({});

  const set = (k, v) => setKeys(p => ({ ...p, [k]: v }));
  const toggleVis = k => setVisible(p => ({ ...p, [k]: !p[k] }));

  const allFilled = gateway.fields.every(f => keys[f.key]?.trim());

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", zIndex: 200 }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 460, background: "#fff", zIndex: 201, display: "flex", flexDirection: "column", boxShadow: "-6px 0 32px rgba(0,0,0,.12)", animation: "drawerIn .25s cubic-bezier(.22,1,.36,1)" }}>
        <style>{`@keyframes drawerIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: gateway.bgColor, border: `1px solid ${gateway.borderColor}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 18 }}>{Ico.key}</span>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1f36" }}>Configure {gateway.name}</div>
              <div style={{ fontSize: 12.5, color: "#9ca3af", marginTop: 1 }}>Enter your API credentials</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>{Ico.close}</button>
        </div>

        {/* Info banner */}
        <div style={{ margin: "16px 24px 0", background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 8, padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ color: "#0284c7", flexShrink: 0, marginTop: 1 }}>{Ico.info}</span>
          <p style={{ fontSize: 12.5, color: "#0369a1", lineHeight: 1.6, margin: 0 }}>
            Your API keys are stored locally and used only to generate payment links on invoices. They are never shared with third parties.
          </p>
        </div>

        {/* Fields */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {gateway.fields.map(f => (
            <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{f.label}</label>
              <div style={{ position: "relative" }}>
                <input
                  type={f.type === "password" && !visible[f.key] ? "password" : "text"}
                  value={keys[f.key] || ""}
                  onChange={e => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  style={{ width: "100%", padding: f.type === "password" ? "9px 40px 9px 12px" : "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13.5, color: "#1a1f36", outline: "none", fontFamily: "monospace", background: "#fff", boxSizing: "border-box" }}
                />
                {f.type === "password" && (
                  <button onClick={() => toggleVis(f.key)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 2 }}>
                    {visible[f.key] ? Ico.eyeOff : Ico.eye}
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Docs link */}
          <a href="#" onClick={e => e.preventDefault()} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, color: gateway.color, fontWeight: 600, textDecoration: "none", marginTop: 4 }}>
            {Ico.link} View {gateway.name} API documentation
          </a>
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #f0f0f0", display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", fontSize: 14, fontWeight: 600, color: "#374151", cursor: "pointer" }}>Cancel</button>
          <button
            onClick={() => allFilled && onSave(gateway.id, keys)}
            disabled={!allFilled}
            style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: allFilled ? "#e8472a" : "#f0b4a8", fontSize: 14, fontWeight: 700, color: "#fff", cursor: allFilled ? "pointer" : "not-allowed", boxShadow: allFilled ? "0 2px 8px rgba(232,71,42,.3)" : "none" }}>
            Save & Connect
          </button>
        </div>
      </div>
    </>
  );
}

// ─── INVOICE PREVIEW MODAL ────────────────────────────────────────────────────
function InvoicePreviewModal({ gateway, onClose }) {
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, width: 480, boxShadow: "0 24px 64px rgba(0,0,0,.18)", overflow: "hidden", animation: "modalIn .2s ease" }}>
          <style>{`@keyframes modalIn{from{transform:scale(.95);opacity:0}to{transform:scale(1);opacity:1}}`}</style>

          {/* Modal header */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1f36" }}>Invoice Preview — {gateway.name} payment link</span>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>{Ico.close}</button>
          </div>

          {/* Fake invoice */}
          <div style={{ padding: "24px 28px" }}>
            {/* Invoice top */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, color: "#e8472a", letterSpacing: -0.3 }}>FETCH<sup style={{ fontSize: 9 }}>TM</sup></div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Let's File Smarter, Together</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1f36", fontFamily: "monospace" }}>INV-2026-006</div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Due: Mar 16, 2026</div>
              </div>
            </div>

            <div style={{ height: 1, background: "#f0f0f0", marginBottom: 16 }} />

            {/* Bill to */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 }}>Bill To</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1f36" }}>Apex Technologies Ltd</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>info@apextech.ng</div>
            </div>

            {/* Line items */}
            <div style={{ background: "#f9fafb", borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
              {[
                { desc: "IT Consulting (5hrs)", qty: 5, rate: 25000 },
                { desc: "Standing Desk ×2",    qty: 2, rate: 1000  },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#374151", padding: "5px 0", borderBottom: i === 0 ? "1px solid #e5e7eb" : "none" }}>
                  <span>{item.desc}</span>
                  <span style={{ fontWeight: 600 }}>₦{(item.qty * item.rate).toLocaleString()}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, fontWeight: 800, color: "#1a1f36", paddingTop: 8, marginTop: 4 }}>
                <span>Total</span>
                <span>₦127,000.00</span>
              </div>
            </div>

            {/* Payment link section */}
            <div style={{ border: `1.5px solid ${gateway.borderColor}`, borderRadius: 10, padding: "14px 16px", background: gateway.bgColor }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: gateway.color, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10, display: "flex", alignItems: "center", gap: 5 }}>
                {Ico.link} Pay Online via {gateway.name}
              </div>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12, lineHeight: 1.5 }}>
                Click the button below to pay securely online using {gateway.name}. You can pay with your card, bank transfer, or other supported methods.
              </div>
              <button style={{ width: "100%", padding: "11px", borderRadius: 8, border: "none", background: gateway.color, color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer", letterSpacing: 0.2 }}>
                Pay ₦127,000.00 with {gateway.name}
              </button>
              <div style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", marginTop: 8 }}>
                Powered by {gateway.name} · Secure & encrypted
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── GATEWAY CARD ─────────────────────────────────────────────────────────────
function GatewayCard({ gateway, state, isDefault, onConnect, onDisconnect, onConfigure, onSetDefault, onPreview }) {
  const isConnected = state?.connected;
  const LogoComp = gateway.logo;

  return (
    <div style={{ background: "#fff", border: `1px solid ${isConnected ? gateway.borderColor : "#e4e6ea"}`, borderRadius: 14, padding: "22px 24px", display: "flex", flexDirection: "column", gap: 0, position: "relative", transition: "box-shadow .2s", boxShadow: isConnected ? `0 2px 12px ${gateway.color}18` : "none" }}>

      {/* Default badge */}
      {isDefault && (
        <div style={{ position: "absolute", top: 14, right: 14, display: "flex", alignItems: "center", gap: 4, background: "#fef9ec", border: "1px solid #fde68a", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: "#b45309" }}>
          <span style={{ color: "#f59e0b" }}>{Ico.star}</span> Default
        </div>
      )}

      {/* Logo + status */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <LogoComp />
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700,
          color: isConnected ? "#16a34a" : "#9ca3af",
          background: isConnected ? "#f0fdf4" : "#f4f5f7",
          border: `1px solid ${isConnected ? "#bbf7d0" : "#e5e7eb"}`,
          borderRadius: 20, padding: "3px 10px" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: isConnected ? "#16a34a" : "#d1d5db" }} />
          {isConnected ? "Connected" : "Not connected"}
        </div>
      </div>

      {/* Tagline & description */}
      <div style={{ fontSize: 12, fontWeight: 600, color: gateway.color, marginBottom: 5 }}>{gateway.tagline}</div>
      <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, margin: "0 0 18px" }}>{gateway.description}</p>

      {/* Divider */}
      <div style={{ height: 1, background: "#f0f0f0", marginBottom: 16 }} />

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        {!isConnected ? (
          <button
            onClick={onConnect}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", background: "#e8472a", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(232,71,42,.25)" }}
            onMouseEnter={e => e.currentTarget.style.background = "#d03d22"}
            onMouseLeave={e => e.currentTarget.style.background = "#e8472a"}>
            {Ico.link} Connect
          </button>
        ) : (
          <>
            <button
              onClick={onConfigure}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#fff", color: "#374151", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f4f5f7"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
              {Ico.key} API Keys
            </button>

            {!isDefault && (
              <button
                onClick={onSetDefault}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#fff", color: "#374151", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f4f5f7"}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                {Ico.star} Set as Default
              </button>
            )}

            <button
              onClick={onPreview}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#fff", color: "#374151", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f4f5f7"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
              {Ico.eye} Preview
            </button>

            <button
              onClick={onDisconnect}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "none", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", marginLeft: "auto" }}
              onMouseEnter={e => e.currentTarget.style.background = "#fff5f5"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}>
              {Ico.unlink} Disconnect
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function FetchPaymentGateways({ navigate }) {
  const [gatewayStates, setGatewayStates] = useState({});  // { [id]: { connected, keys } }
  const [defaultGateway, setDefaultGateway] = useState(null);
  const [configuring, setConfiguring]   = useState(null);  // gateway id
  const [previewing, setPreviewing]     = useState(null);  // gateway id

  const connectedCount = Object.values(gatewayStates).filter(s => s?.connected).length;

  const handleSave = (id, keys) => {
    setGatewayStates(p => ({ ...p, [id]: { connected: true, keys } }));
    if (!defaultGateway) setDefaultGateway(id);
    setConfiguring(null);
  };

  const handleDisconnect = (id) => {
    setGatewayStates(p => ({ ...p, [id]: { connected: false, keys: {} } }));
    if (defaultGateway === id) {
      const nextDefault = GATEWAYS.find(g => g.id !== id && gatewayStates[g.id]?.connected);
      setDefaultGateway(nextDefault?.id || null);
    }
  };

  const configuringGateway = GATEWAYS.find(g => g.id === configuring);
  const previewingGateway  = GATEWAYS.find(g => g.id === previewing);

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw", background: "#f4f5f7", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <style>{`*, *::before, *::after{box-sizing:border-box;margin:0;padding:0}html,body,#root{width:100%;min-height:100vh}`}</style>

      <Sidebar activePage="payment-gateways" navigate={navigate} />

      <div style={{ marginLeft: 224, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* Topbar */}
        <header style={{ background: "#fff", borderBottom: "1px solid #ebebeb", padding: "0 32px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <span style={{ color: "#6b7280", fontWeight: 500 }}>Home</span>
            <span style={{ color: "#d1d5db" }}>/</span>
            <span style={{ color: "#1a1f36", fontWeight: 600 }}>Payment Gateways</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ cursor: "pointer", color: "#6b7280" }}>{Ico.bell}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1f36", lineHeight: 1 }}>Jonathan</div>
                <div style={{ fontSize: 10, color: "#9ca3af", letterSpacing: 0.5, textTransform: "uppercase", marginTop: 1 }}>Admin</div>
              </div>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#e8472a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>JO</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: "28px 32px 40px" }}>

          {/* Title row */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a1f36", marginBottom: 5, letterSpacing: -0.3 }}>Payment Gateways</h1>
            <p style={{ fontSize: 13, color: "#9ca3af" }}>Connect online payment gateways to attach payment links to invoices sent digitally.</p>
          </div>

          {/* Status banner */}
          {connectedCount === 0 ? (
            <div style={{ background: "#fff", border: "1.5px dashed #e5e7eb", borderRadius: 12, padding: "18px 22px", marginBottom: 28, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#fef2f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#e8472a", flexShrink: 0 }}>
                {Ico.link}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1f36", marginBottom: 2 }}>No gateway connected yet</div>
                <div style={{ fontSize: 13, color: "#9ca3af" }}>Connect at least one gateway to enable online payments on your invoices.</div>
              </div>
            </div>
          ) : (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "14px 20px", marginBottom: 28, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
                {Ico.check}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#15803d" }}>
                  {connectedCount} gateway{connectedCount > 1 ? "s" : ""} connected
                  {defaultGateway && ` · Default: ${GATEWAYS.find(g => g.id === defaultGateway)?.name}`}
                </div>
                <div style={{ fontSize: 12.5, color: "#16a34a" }}>Payment links will be attached to digitally sent invoices automatically.</div>
              </div>
            </div>
          )}

          {/* Gateway grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            {GATEWAYS.map(gateway => (
              <GatewayCard
                key={gateway.id}
                gateway={gateway}
                state={gatewayStates[gateway.id]}
                isDefault={defaultGateway === gateway.id}
                onConnect={() => setConfiguring(gateway.id)}
                onDisconnect={() => handleDisconnect(gateway.id)}
                onConfigure={() => setConfiguring(gateway.id)}
                onSetDefault={() => setDefaultGateway(gateway.id)}
                onPreview={() => setPreviewing(gateway.id)}
              />
            ))}
          </div>

          {/* Footer note */}
          <div style={{ marginTop: 32, padding: "14px 18px", background: "#fff", border: "1px solid #e4e6ea", borderRadius: 10, display: "flex", alignItems: "flex-start", gap: 10, maxWidth: 680 }}>
            <span style={{ color: "#9ca3af", marginTop: 1, flexShrink: 0 }}>{Ico.info}</span>
            <p style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.7, margin: 0 }}>
              When sending an invoice digitally (via email or WhatsApp), Fetch will automatically append a "Pay Online" button linked to your default gateway. Customers can then pay directly from the invoice without needing to log in anywhere.
            </p>
          </div>
        </main>
      </div>

      {/* Configure drawer */}
      {configuringGateway && (
        <ConfigureDrawer
          gateway={configuringGateway}
          existing={gatewayStates[configuringGateway.id]}
          onClose={() => setConfiguring(null)}
          onSave={handleSave}
        />
      )}

      {/* Invoice preview modal */}
      {previewingGateway && (
        <InvoicePreviewModal
          gateway={previewingGateway}
          onClose={() => setPreviewing(null)}
        />
      )}
    </div>
  );
}
